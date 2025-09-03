"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, CheckCircle, AlertCircle, Plus, Wand2 } from "lucide-react"
import { AIService, AIResponse } from "@/lib/ai-service"
import { toast } from "sonner"

interface AIAssistantProps {
  onAIResponse: (response: AIResponse) => void
  currentMarkdown: string
  lastResponse: AIResponse | null
}

export function AIAssistant({ onAIResponse, currentMarkdown, lastResponse }: AIAssistantProps) {
  const [loadingStates, setLoadingStates] = useState({
    create: false,
    convert: false,
    improve: false,
    suggest: false
  })
  const [createPrompt, setCreatePrompt] = useState("")
  const [convertText, setConvertText] = useState("")

  const handleAIRequest = async (aiFunction: () => Promise<AIResponse>, loadingKey: keyof typeof loadingStates) => {
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }))
    
    try {
      const response = await aiFunction()
      
      if (response.error) {
        toast.error(`AI Error: ${response.error}`)
      } else if (response.content) {
        toast.success("AI request completed successfully")
      }
      
      // Call onAIResponse to update the parent state
      onAIResponse(response)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Request failed: ${errorMessage}`)
      
      const errorResponse = { 
        content: '', 
        error: errorMessage
      }
      onAIResponse(errorResponse)
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleCreateMarkmap = () => {
    if (!createPrompt.trim()) {
      toast.error("Please enter a description for the markmap")
      return
    }
    handleAIRequest(() => AIService.createMarkmap(createPrompt), 'create')
  }

  const handleConvertText = () => {
    if (!convertText.trim()) {
      toast.error("Please enter text to convert")
      return
    }
    handleAIRequest(() => AIService.convertTextToMarkmap(convertText), 'convert')
  }

  const handleImproveMarkmap = () => {
    if (!currentMarkdown.trim()) {
      toast.error("No markdown content to improve")
      return
    }
    handleAIRequest(() => AIService.improveMarkmap(currentMarkdown), 'improve')
  }

  const handleSuggestContent = () => {
    if (!currentMarkdown.trim()) {
      toast.error("No markdown content to suggest improvements for")
      return
    }
      handleAIRequest(() => AIService.suggestContent(currentMarkdown), 'suggest')
  }

  return (
    <div className="space-y-4">
      {/* 1. Create Markmap from Prompt */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Markmap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="e.g., 'create a markmap for studying React for a beginner' or 'make a mindmap about project management'"
            value={createPrompt}
            onChange={(e) => setCreatePrompt(e.target.value)}
            rows={3}
            aria-label="Describe the markmap you want to create"
          />
          <Button 
            className="w-full" 
            size="sm"
            onClick={handleCreateMarkmap}
            disabled={loadingStates.create || !createPrompt.trim()}
            aria-label="Generate new markmap using AI"
          >
            {loadingStates.create ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Create Markmap
          </Button>
        </CardContent>
      </Card>

      {/* 2. Convert Text to Markmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Convert Text to Markmap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Paste any text, article, or content to convert into a mindmap structure..."
            value={convertText}
            onChange={(e) => setConvertText(e.target.value)}
            rows={4}
            aria-label="Text content to convert to mindmap format"
          />
          <Button 
            className="w-full" 
            size="sm" 
            variant="outline"
            onClick={handleConvertText}
            disabled={loadingStates.convert || !convertText.trim()}
            aria-label="Convert text content to mindmap format"
          >
            {loadingStates.convert ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Convert to Markmap
          </Button>
        </CardContent>
      </Card>

      {/* 3. Improve Existing Markmap (always visible, buttons disabled when no content) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Improve Existing Markmap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            className="w-full" 
            size="sm" 
            variant="outline"
            onClick={handleImproveMarkmap}
            disabled={loadingStates.improve || !currentMarkdown.trim()}
            aria-label="Improve existing mindmap structure and organization"
          >
            {loadingStates.improve ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Improve Structure & Organization
          </Button>
          <Button 
            className="w-full" 
            size="sm" 
            variant="outline"
            onClick={handleSuggestContent}
            disabled={loadingStates.suggest || !currentMarkdown.trim()}
            aria-label="Get AI suggestions for additional mindmap content"
          >
            {loadingStates.suggest ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Suggest More Content
          </Button>
          {!currentMarkdown.trim() && (
            <p className="text-xs text-muted-foreground text-center">
              Add some content to your mindmap to enable these features
            </p>
          )}
        </CardContent>
      </Card>

      {/* AI Response Display */}
      {lastResponse && (
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              {lastResponse.error ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              AI Response
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lastResponse.error ? (
              <div className="text-sm text-destructive">
                Error: {lastResponse.error}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  AI generated content:
                </div>
                <div className="p-3 bg-muted rounded-md text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border">
                  {lastResponse.content}
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => onAIResponse(lastResponse)}
                >
                  Apply to Mindmap
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
