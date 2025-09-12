"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { 
  FileText, 
  Map, 
  Sparkles, 
  Download,
  Upload
} from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"
import { AIResponse } from "@/lib/ai-service"
import { MarkmapViewer } from "@/components/markmap-viewer"
import { MarkmapUtils } from "@/lib/markmap-utils"
import { ErrorBoundary } from "@/components/error-boundary"
import { EmptyState } from "@/components/empty-state"
import { toast } from "sonner"

export default function MarkyPage() {
  const [markdownContent, setMarkdownContent] = useState(`# Welcome to Marky! 🧠
## Getting Started
### Basic Structure
- Use # for main topics
- Use ## for subtopics
- Use - for details

### Quick Tips
- Keep topics concise
- Group related ideas
- Use clear titles

## AI Assistant ✨
### What it can do
- Generate mindmaps from text
- Expand your ideas
- Improve structure

### How to use
- Click the sparkles icon
- Try "Create a mindmap about..."
- Ask for expansions

## Import & Export
### Supported Files
- Markdown (.md)
- HTML mindmaps (.html)

### Export Options
- Standalone HTML files
- Share with others
- Print-friendly format`)

  const [mapTitle, setMapTitle] = useState("My First Mindmap")
  const [lastAIResponse, setLastAIResponse] = useState<AIResponse | null>(null)

  // localStorage persistence
  useEffect(() => {
    // Load saved data on component mount
    const savedData = localStorage.getItem('marky-mindmap-data');
    if (savedData) {
      try {
        const { content, title, timestamp } = JSON.parse(savedData);
        // Only load if saved within last 7 days
        if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
          setMarkdownContent(content);
          setMapTitle(title);
          toast.success("Previous work restored!");
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = () => {
      const data = {
        content: markdownContent,
        title: mapTitle,
        timestamp: Date.now()
      };
      localStorage.setItem('marky-mindmap-data', JSON.stringify(data));
    };

    // Save immediately when content changes
    saveData();

    // Also save every 30 seconds as backup
    const interval = setInterval(saveData, 30000);
    return () => clearInterval(interval);
  }, [markdownContent, mapTitle]);

  // Clear saved data function
  const clearSavedData = () => {
    localStorage.removeItem('marky-mindmap-data');
    toast.success("Saved data cleared!");
  };

  // Check if content is truly empty (not the starter content)
  const isMinimalContent = markdownContent.trim() === "" || markdownContent.trim() === "# My New Mindmap\n## Start typing your ideas here...";

  // Empty state handlers
  const handleStartCreating = () => {
    setMarkdownContent("# My New Mindmap\n## Start typing your ideas here...");
    setMapTitle("My New Mindmap");
  };

  const handleImportFile = () => {
    // Trigger file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  };

  const handleTryAI = () => {
    // This will be handled by opening the AI assistant sheet
    toast.info("Open the AI Assistant (✨) to get started!");
  };

  // AI response handlers
  const handleAIResponse = (response: AIResponse) => {
    setLastAIResponse(response)
  }

  const applyAIResponse = (response: AIResponse) => {
    try {
      setMarkdownContent(response.content)
      toast.success("AI content applied successfully!")
    } catch (error) {
      toast.error("Failed to apply AI content. Please try again.")
      console.error("Apply AI response error:", error)
    }
  }

  // File operations
  const handleExport = async () => {
    try {
      const { generateMarkmapHTML } = await import("@/lib/html-export")
      const html = generateMarkmapHTML(markdownContent, mapTitle)
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${mapTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Mindmap exported successfully!")
    } catch (error) {
      toast.error("Failed to export mindmap. Please try again.")
      console.error("Export error:", error)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // File size validation (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Please use files under 5MB.")
      return
    }

    // File type validation
    const fileName = file.name.toLowerCase()
    const allowedExtensions = ['.md', '.markdown', '.html', '.htm']
    const isValidFile = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    if (!isValidFile) {
      toast.error("Unsupported file type. Please import .md, .markdown, or .html files.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        
        // Content length validation (prevent extremely large content)
        if (content.length > 1000000) { // 1MB of text
          toast.error("File content is too large. Please use smaller files.")
          return
        }
        
        if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
          // Import HTML file - extract markdown from markmap HTML
          const extractedMarkdown = MarkmapUtils.extractMarkdownFromHTML(content)
          setMarkdownContent(extractedMarkdown)
          setMapTitle(file.name.replace(/\.(html|htm)$/i, ''))
          toast.success("HTML mindmap imported successfully!")
        } else if (fileName.endsWith('.md') || fileName.endsWith('.markdown')) {
          // Import markdown file directly
          setMarkdownContent(content)
          setMapTitle(file.name.replace(/\.(md|markdown)$/i, ''))
          toast.success("Markdown file imported successfully!")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Failed to import file: ${errorMessage}`)
        console.error("Import error:", error)
      }
    }
    
    reader.onerror = () => {
      toast.error("Failed to read file. Please try again.")
    }
    
    reader.readAsText(file)
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col lg:flex-row bg-background h-full">
      {/* Mobile Layout: Stacked (Markdown Editor on top, View on bottom) */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Mobile Header with Sheet Triggers */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <Map className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Mindmap Workspace</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Markdown Editor Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Editor
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Markdown Editor</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4 px-2">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-title">Map Title</Label>
                    <Input
                      id="mobile-title"
                      value={mapTitle}
                      onChange={(e) => {
                        const value = e.target.value
                        setMapTitle(value)
                        
                        // Validate title length
                        if (value.length > 100) {
                          toast.error("Map title is too long. Please keep it under 100 characters.")
                          return
                        }
                        
                        // Validate title content
                        if (value.trim() && value.length < 3) {
                          toast.warning("Map title is quite short. Consider a more descriptive name.")
                        }
                      }}
                      placeholder="Enter map title..."
                      className="font-medium"
                      minLength={1}
                      required
                      aria-describedby="mobile-title-error"
                    />
                    {!mapTitle.trim() && (
                      <p id="mobile-title-error" className="text-xs text-destructive">
                        Map title is required
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile-markdown">Markdown Content</Label>
                    <Textarea
                      id="mobile-markdown"
                      value={markdownContent}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      placeholder="Enter your markdown content here..."
                      className="min-h-[200px] resize-none font-mono text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <label className="cursor-pointer" aria-label="Import markdown or HTML file">
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                          <input
                            type="file"
                            accept=".md,.markdown,.html,.htm"
                            onChange={handleImport}
                            className="hidden"
                            aria-describedby="mobile-import-description"
                          />
                        </label>
                      </Button>
                      <p id="mobile-import-description" className="sr-only">
                        Import a markdown file (.md) or HTML mindmap file (.html) to load existing content
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1" 
                        onClick={handleExport}
                        aria-label="Export mindmap as HTML file"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export HTML
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                        onClick={clearSavedData}
                        aria-label="Clear saved data"
                      >
                        Clear Saved Data
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* AI Assistant Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>AI Assistant</SheetTitle>
                </SheetHeader>
                <div className="mt-4 px-2">
                  <AIAssistant
                    onAIResponse={handleAIResponse}
                    onApplyAIResponse={() => lastAIResponse && applyAIResponse(lastAIResponse)}
                    currentMarkdown={markdownContent}
                    lastResponse={lastAIResponse}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Content Area - Only Markmap */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="border-b bg-muted/20 flex items-center justify-center px-4 py-2">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Mindmap View</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            {isMinimalContent ? (
              <EmptyState 
                onStartCreating={handleStartCreating}
                onImportFile={handleImportFile}
                onTryAI={handleTryAI}
              />
            ) : (
              <MarkmapViewer 
                markdown={markdownContent}
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout: Side-by-side (3 columns) */}
      <div className="hidden lg:flex bg-background h-full w-full">
        {/* Left Sidebar - Markdown Editor */}
        <div className="w-100 border-r bg-muted/30 flex flex-col">
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Markdown Editor</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Map Title</Label>
              <Input
                id="title"
                value={mapTitle}
                onChange={(e) => {
                  const value = e.target.value
                  setMapTitle(value)
                  
                  // Validate title length
                  if (value.length > 100) {
                    toast.error("Map title is too long. Please keep it under 100 characters.")
                    return
                  }
                  
                  // Validate title content
                  if (value.trim() && value.length < 3) {
                    toast.warning("Map title is quite short. Consider a more descriptive name.")
                  }
                }}
                placeholder="Enter map title..."
                className="font-medium"
                minLength={1}
                required
                aria-describedby="title-error"
              />
              {!mapTitle.trim() && (
                <p id="title-error" className="text-xs text-destructive">
                  Map title is required
                </p>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 p-4 min-h-0">
              <div className="space-y-4 h-full flex flex-col">
                <div className="space-y-2 flex-1 flex flex-col min-h-0">
                  <Label htmlFor="markdown">Markdown Content</Label>
                  <Textarea
                    id="markdown"
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    placeholder="Enter your markdown content here..."
                    className="flex-1 resize-none font-mono text-sm min-h-0"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2 flex-shrink-0">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <label className="cursor-pointer" aria-label="Import markdown or HTML file">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                        <input
                          type="file"
                          accept=".md,.markdown,.html,.htm"
                          onChange={handleImport}
                          className="hidden"
                          aria-describedby="import-description"
                        />
                      </label>
                    </Button>
                    <p id="import-description" className="sr-only">
                      Import a markdown file (.md) or HTML mindmap file (.html) to load existing content
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      onClick={handleExport}
                      aria-label="Export mindmap as HTML file"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export HTML
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs text-muted-foreground hover:text-foreground"
                      onClick={clearSavedData}
                      aria-label="Clear saved data"
                    >
                      Clear Saved Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Markmap View */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Mindmap View</h2>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            {isMinimalContent ? (
              <EmptyState 
                onStartCreating={handleStartCreating}
                onImportFile={handleImportFile}
                onTryAI={handleTryAI}
              />
            ) : (
              <MarkmapViewer 
                markdown={markdownContent}
                className="w-full h-full"
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Assistant */}
        <div className="w-100 border-l bg-muted/30 flex flex-col">
          <div className="px-4 pt-4 pb-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            </div>
          </div>
          
          <div className="flex-1 px-4 pb-4 min-h-0">
            <AIAssistant
              onAIResponse={handleAIResponse}
              onApplyAIResponse={() => lastAIResponse && applyAIResponse(lastAIResponse)}
              currentMarkdown={markdownContent}
              lastResponse={lastAIResponse}
            />
          </div>
        </div>
      </div>
      </div>
    </ErrorBoundary>
  )
}