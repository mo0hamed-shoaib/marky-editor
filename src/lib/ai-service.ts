export interface AIResponse {
  content: string
  error?: string
}

export class AIService {
  private static async makeRequest(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemPrompt: systemPrompt || `You are an AI assistant that helps users create and expand mindmaps. 

IMPORTANT: Follow these strict markdown formatting rules for Markmap compatibility:

1. Use headers (# ## ###) ONLY for the first 3 structural levels (depth 0-2)
2. Use indented lists (- item) for all deeper levels (depth 3+) 
3. Calculate list indentation as: '  '.repeat(depth - 3)
4. Never use more than 3 header levels (###) - beyond that, everything must be lists
5. This works around Markmap's limitation with deep header nesting

Example of correct format:
# Main Topic
## Sub Category
### Specific Area
  - Detail item
    - Sub-detail
      - Deep item

Always respond with only the markdown structure, no explanations.`
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('AI request failed:', error)
      return { 
        content: '', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  static async createMarkmap(prompt: string): Promise<AIResponse> {
    const promptText = `Create a comprehensive mindmap based on this request: "${prompt}"

IMPORTANT: Follow Markmap formatting rules:
- Use headers (# ## ###) for first 3 levels only
- Use indented lists (- item) for deeper levels
- Never exceed 3 header levels
- Make it comprehensive and well-structured

Please respond with only the markdown structure, no explanations.`
    
    return this.makeRequest(promptText)
  }

  static async convertTextToMarkmap(text: string): Promise<AIResponse> {
    const promptText = `Convert the following text into a well-organized mindmap structure:

IMPORTANT: Follow Markmap formatting rules:
- Use headers (# ## ###) for first 3 levels only
- Use indented lists (- item) for deeper levels
- Never exceed 3 header levels
- Extract main ideas and organize them logically

Text to convert:
${text}

Please respond with only the markdown structure, no explanations.`
    
    return this.makeRequest(promptText)
  }

  static async improveMarkmap(markdown: string): Promise<AIResponse> {
    const promptText = `Review and improve this mindmap structure to make it more organized, logical, and comprehensive:

IMPORTANT: Follow Markmap formatting rules:
- Use headers (# ## ###) for first 3 levels only
- Use indented lists (- item) for deeper levels
- Never exceed 3 header levels
- Improve organization, add missing connections, restructure if needed

Current mindmap:
${markdown}

Please respond with only the improved markdown structure, no explanations.`
    
    return this.makeRequest(promptText)
  }

  static async suggestContent(markdown: string): Promise<AIResponse> {
    const promptText = `Analyze this mindmap and suggest additional content, topics, or ideas that would make it more comprehensive:

IMPORTANT: Follow Markmap formatting rules:
- Use headers (# ## ###) for first 3 levels only
- Use indented lists (- item) for deeper levels
- Never exceed 3 header levels
- Suggest new branches, subtopics, examples, or related concepts

Current mindmap:
${markdown}

Please respond with only the additional content in markdown format, no explanations.`
    
    return this.makeRequest(promptText)
  }
}
