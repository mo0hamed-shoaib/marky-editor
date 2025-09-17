"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Lightbulb, 
  Sparkles, 
  FileText, 
  Download, 
  Upload,
  ArrowRight,
  Zap
} from 'lucide-react'

interface EmptyStateProps {
  onStartCreating?: () => void
  onImportFile?: () => void
  onTryAI?: () => void
}

export function EmptyState({ onStartCreating, onImportFile, onTryAI }: EmptyStateProps) {
  const quickStartIdeas = [
    "Project planning",
    "Learning roadmap", 
    "Brainstorming session",
    "Meeting notes",
    "Study guide",
    "Recipe collection"
  ]

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Generate mindmaps from any text or idea"
    },
    {
      icon: FileText,
      title: "Smart Import",
      description: "Works with markdown and HTML files"
    },
    {
      icon: Download,
      title: "Easy Export",
      description: "Share your mindmaps as HTML files"
    },
    {
      icon: Zap,
      title: "Real-time Preview",
      description: "See your mindmap update as you type"
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome to Marky! 🧠
        </h2>
        <p className="text-muted-foreground max-w-md">
          Your AI-powered mindmap creator. Transform ideas into beautiful visual maps in seconds.
        </p>
      </div>

      {/* Quick Start Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Button onClick={onTryAI} className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Try AI Assistant
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" onClick={onImportFile} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import File
        </Button>
        
        <Button variant="ghost" onClick={onStartCreating} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Start from Scratch
        </Button>
      </div>

      {/* Quick Start Ideas */}
      <Card className="w-full max-w-2xl mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Start Ideas</CardTitle>
          <CardDescription>
            Try these prompts with the AI Assistant to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickStartIdeas.map((idea, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onTryAI?.()}
              >
                {idea}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting Started Steps */}
      <Card className="w-full max-w-2xl mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Getting Started</CardTitle>
          <CardDescription>
            Follow these simple steps to create your first mindmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">Choose your approach</h4>
                <p className="text-sm text-muted-foreground">
                  Use AI to generate content or start typing your own ideas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">Structure your content</h4>
                <p className="text-sm text-muted-foreground">
                  Use # for main topics, ## for subtopics, and - for details
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">Export and share</h4>
                <p className="text-sm text-muted-foreground">
                  Save your mindmap as HTML or import existing files
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
