import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Simple in-memory rate limiting (in production, use Redis or database)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const MAX_REQUESTS_PER_MINUTE = 10

function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const userData = requestCounts.get(identifier)
  
  if (!userData || now > userData.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + 60000 })
    return false
  }
  
  if (userData.count >= MAX_REQUESTS_PER_MINUTE) {
    return true
  }
  
  userData.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Basic rate limiting using IP address
    const identifier = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    if (isRateLimited(identifier)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { prompt, systemPrompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Make request to OpenRouter
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': request.headers.get('origin') || 'http://localhost:3000',
        'X-Title': 'Markflow - AI Mindmap Assistant'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'You are an AI assistant that helps users create and expand mindmaps. Always respond with clear, structured content that can be easily converted to markdown format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API request failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content received from AI')
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json(
      { 
        content: '', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    )
  }
}
