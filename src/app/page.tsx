"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  FileText, 
  Map, 
  Sparkles, 
  Save, 
  Download,
  Upload,
  Plus,
  X
} from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"
import { AIResponse } from "@/lib/ai-service"
import { MarkmapViewer } from "@/components/markmap-viewer"

export default function MarkflowPage() {
  const [markdownContent, setMarkdownContent] = useState(`# Markflow
## Getting Started
### Create your first mindmap
- Drag and drop nodes
- Edit text inline
- Use AI to expand ideas

## Features
### Visual Editor
- Intuitive interface
- Real-time preview
- Multiple themes

### AI Integration
- Smart summarization
- Auto-expansion
- Free API usage`)

    const [mapTitle, setMapTitle] = useState("Untitled Mindmap")
  const [activeView, setActiveView] = useState<"tree" | "markmap">("tree")
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false)
  const [lastAIResponse, setLastAIResponse] = useState<AIResponse | null>(null)
  
  // Tree structure for the outline editor
  const [treeData, setTreeData] = useState([
    {
      id: '1',
      text: 'Getting Started',
      level: 1,
      children: [
        {
          id: '1.1',
          text: 'Create your first mindmap',
          level: 2,
          children: [
            { id: '1.1.1', text: 'Drag and drop nodes', level: 3, children: [] },
            { id: '1.1.2', text: 'Edit text inline', level: 3, children: [] },
            { id: '1.1.3', text: 'Use AI to expand ideas', level: 3, children: [] }
          ]
        }
      ]
    },
    {
      id: '2',
      text: 'Features',
      level: 1,
      children: [
        {
          id: '2.1',
          text: 'Visual Editor',
          level: 2,
          children: [
            { id: '2.1.1', text: 'Intuitive interface', level: 3, children: [] },
            { id: '2.1.2', text: 'Real-time preview', level: 3, children: [] },
            { id: '2.1.3', text: 'Multiple themes', level: 3, children: [] }
          ]
        },
        {
          id: '2.2',
          text: 'AI Integration',
          level: 2,
          children: [
            { id: '2.2.1', text: 'Smart summarization', level: 3, children: [] },
            { id: '2.2.2', text: 'Auto-expansion', level: 3, children: [] },
            { id: '2.2.3', text: 'Free API usage', level: 3, children: [] }
          ]
        }
      ]
    }
  ])

  // Tree editor functions
  const addNode = (parentId: string | null, level: number) => {
    const newNode = {
      id: Date.now().toString(),
      text: 'New Item',
      level: level,
      children: []
    }

    if (!parentId) {
      setTreeData([...treeData, newNode])
    } else {
      const updateChildren = (nodes: any[]): any[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return { ...node, children: [...node.children, newNode] }
          }
          if (node.children) {
            return { ...node, children: updateChildren(node.children) }
          }
          return node
        })
      }
      setTreeData(updateChildren(treeData))
    }
  }

  const updateNodeText = (id: string, newText: string) => {
    const updateNodes = (nodes: any[]): any[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, text: newText }
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) }
        }
        return node
      })
    }
    setTreeData(updateNodes(treeData))
  }

  const deleteNode = (id: string) => {
    const removeNode = (nodes: any[]): any[] => {
      return nodes.filter(node => {
        if (node.id === id) return false
        if (node.children) {
          node.children = removeNode(node.children)
        }
        return true
      })
    }
    setTreeData(removeNode(treeData))
  }

  // Convert tree data to markdown format with proper nesting
  // Following the principle: Headers for structure (0-2), Lists for content (3+)
  // This works around Markmap's limitation with deep header nesting
  const treeToMarkdown = (nodes: any[], depth: number = 0, isRoot: boolean = true): string => {
    let markdown = ''
    
    // Only add YAML frontmatter at the root level
    if (isRoot) {
      markdown = `---
title: Tree Structure
markmap:
  initialExpandLevel: 4
  colorFreezeLevel: 3
---

`
    }
    
    nodes.forEach(node => {
      if (depth <= 2) {
        // Use headers for first 3 structural levels (depth 0, 1, 2)
        const headingLevel = depth + 1
        const headingMark = '#'.repeat(headingLevel)
        markdown += `${headingMark} ${node.text}\n\n`
      } else {
        // Use indented lists for deeper levels (depth 3+) - Markmap handles these better
        const indent = '  '.repeat(depth - 3) // Start list indentation from depth 3
        markdown += `${indent}- ${node.text}\n`
      }
      
      // Recursively process children with incremented depth, but not as root
      if (node.children && node.children.length > 0) {
        markdown += treeToMarkdown(node.children, depth + 1, false)
      }
    })
    return markdown
  }



  // Convert markdown to tree data structure
  const markdownToTree = (markdown: string) => {
    const lines = markdown.split('\n').filter(line => line.trim())
    const tree: any[] = []
    const stack: { node: any; level: number }[] = []
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return
      
      // Check for headings
      const headerMatch = trimmedLine.match(/^(#+)\s+(.+)/)
      if (headerMatch) {
        const level = headerMatch[1].length
        const text = headerMatch[2].trim()
        const newNode = {
          id: Date.now().toString() + Math.random(),
          text: text,
          level: level,
          children: []
        }
        
        if (level === 1) {
          // Root level heading
          tree.push(newNode)
          stack.length = 0 // Clear stack
          stack.push({ node: newNode, level: level })
        } else {
          // Find the right parent in the stack
          while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop()
          }
          
          if (stack.length > 0) {
            stack[stack.length - 1].node.children.push(newNode)
            stack.push({ node: newNode, level: level })
          }
        }
        return
      }
      
      // Check for list items
      const listMatch = trimmedLine.match(/^(\s*)([-*+])\s+(.+)/)
      if (listMatch) {
        const indentLevel = Math.floor(listMatch[1].length / 2) + 1
        const text = listMatch[3].trim()
        const newNode = {
          id: Date.now().toString() + Math.random(),
          text: text,
          level: indentLevel,
          children: []
        }
        
        // Find the right parent based on indentation
        while (stack.length > 0 && stack[stack.length - 1].level >= indentLevel) {
          stack.pop()
        }
        
        if (stack.length > 0) {
          stack[stack.length - 1].node.children.push(newNode)
        } else {
          // If no parent found, add to root
          tree.push(newNode)
        }
        stack.push({ node: newNode, level: indentLevel })
      }
    })
    
    return tree
  }

  // Render tree node component
  const renderTreeNode = (node: any, depth: number = 0) => {
    const marginLeft = depth * 20
    
    return (
      <div key={node.id} className="space-y-1">
        <div 
          className="flex items-center gap-2 p-2 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors group"
          style={{ marginLeft: `${marginLeft}px` }}
        >
          <div className={`w-2 h-2 rounded-full ${
            node.level === 1 ? 'bg-primary' : 
            node.level === 2 ? 'bg-secondary' : 
            'bg-muted-foreground'
          }`}></div>
          
          <input
            type="text"
            value={node.text}
            onChange={(e) => updateNodeText(node.id, e.target.value)}
            className={`flex-1 bg-transparent border-none outline-none text-sm ${
              node.level === 1 ? 'font-semibold' : 
              node.level === 2 ? 'font-medium' : 
              'font-normal'
            }`}
            placeholder="Enter text..."
          />
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => addNode(node.id, node.level + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-destructive"
              onClick={() => deleteNode(node.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="space-y-1">
            {node.children.map((child: any) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }
  
  const handleAIResponse = (response: AIResponse) => {
    setLastAIResponse(response)
    if (response.content && !response.error) {
      setMarkdownContent(response.content)
    }
  }

  const handleExport = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mapTitle}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdownContent(content)
        setMapTitle(file.name.replace('.md', ''))
        // Also convert to tree structure for immediate editing
        setTreeData(markdownToTree(content))
      }
      reader.readAsText(file)
    }
  }

  // Enhanced function to render markdown as a tree
  const renderTreeView = () => {
    const lines = markdownContent.split('\n').filter(line => line.trim())
    
    return (
      <div className="h-full p-4 overflow-y-auto space-y-2">
        {lines.map((line, index) => {
          const trimmedLine = line.trim()
          if (!trimmedLine) return null
          
          // Check for different markdown elements
          const headerMatch = trimmedLine.match(/^(#+)\s+(.+)/)
          const listMatch = trimmedLine.match(/^([-*+])\s+(.+)/)
          const numberedListMatch = trimmedLine.match(/^(\d+\.)\s+(.+)/)
          const frontmatterMatch = trimmedLine.match(/^---$/)
          const codeBlockMatch = trimmedLine.match(/^```(\w+)?$/)
          const tableHeaderMatch = trimmedLine.match(/^\|(.+)\|$/)
          const tableSeparatorMatch = trimmedLine.match(/^\|[\s\-:|]+\|$/)
          const imageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
          const linkMatch = trimmedLine.match(/^\[([^\]]+)\]\(([^)]+)\)/)
          
          if (frontmatterMatch) {
            // Frontmatter delimiter - treat as metadata section
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Frontmatter Metadata
                </span>
              </div>
            )
          } else if (codeBlockMatch) {
            // Code block delimiter
            const language = codeBlockMatch[1] || 'code'
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Code Block ({language})
                </span>
              </div>
            )
          } else if (tableHeaderMatch) {
            // Table header
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Table Header
                </span>
              </div>
            )
          } else if (tableSeparatorMatch) {
            // Table separator row
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span className="text-sm text-muted-foreground">
                  Table Separator
                </span>
              </div>
            )
          } else if (imageMatch) {
            // Image
            const altText = imageMatch[1] || 'Image'
            const src = imageMatch[2]
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  🖼️ {altText}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({src})
                </span>
              </div>
            )
          } else if (linkMatch) {
            // Link
            const linkText = linkMatch[1]
            const url = linkMatch[2]
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  🔗 {linkText}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({url})
                </span>
              </div>
            )
          } else if (headerMatch) {
            // Header line - count # to determine level
            const level = headerMatch[1].length
            const text = headerMatch[2].trim()
            const marginLeft = (level - 1) * 20
            
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border transition-colors"
                style={{ marginLeft: `${marginLeft}px` }}
              >
                <div className={`w-2 h-2 rounded-full ${level === 1 ? 'bg-primary' : level === 2 ? 'bg-secondary' : 'bg-muted-foreground'}`}></div>
                <span className={`font-medium ${level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'}`}>
                  {text}
                </span>
              </div>
            )
          } else if (listMatch) {
            // Unordered list item - treat as level 4 or next level after parent
            const bullet = listMatch[1]
            const text = listMatch[2].trim()
            
            // Find the previous header level to determine this list item's level
            let listLevel = 4 // Default to level 4
            for (let i = index - 1; i >= 0; i--) {
              const prevLine = lines[i].trim()
              const prevHeaderMatch = prevLine.match(/^(#+)\s+(.+)/)
              if (prevHeaderMatch) {
                listLevel = prevHeaderMatch[1].length + 1
                break
              }
            }
            
            const marginLeft = (listLevel - 1) * 20
            
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                style={{ marginLeft: `${marginLeft}px` }}
              >
                <div className="w-2 h-2 rounded-full bg-accent-foreground"></div>
                <span className="text-sm">{bullet} {text}</span>
              </div>
            )
          } else if (numberedListMatch) {
            // Numbered list item - treat as level 4 or next level after parent
            const number = numberedListMatch[1]
            const text = numberedListMatch[2].trim()
            
            // Find the previous header level to determine this list item's level
            let listLevel = 4 // Default to level 4
            for (let i = index - 1; i >= 0; i--) {
              const prevLine = lines[i].trim()
              const prevHeaderMatch = prevLine.match(/^(#+)\s+(.+)/)
              if (prevHeaderMatch) {
                listLevel = prevHeaderMatch[1].length + 1
                break
              }
            }
            
            const marginLeft = (listLevel - 1) * 20
            
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                style={{ marginLeft: `${marginLeft}px` }}
              >
                <div className="w-2 h-2 rounded-full bg-accent-foreground"></div>
                <span className="text-sm">{number} {text}</span>
              </div>
            )
          } else if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            // Table row (not header or separator)
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                <span className="text-sm text-muted-foreground">
                  Table Row
                </span>
              </div>
            )
          } else if (trimmedLine.startsWith('```') && trimmedLine.length > 3) {
            // Inline code block content
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-sm text-muted-foreground font-mono">
                  Code Content
                </span>
              </div>
            )
          } else if (trimmedLine.includes(':') && !trimmedLine.includes('|') && !trimmedLine.includes('```') && !trimmedLine.includes('![') && !trimmedLine.includes('[') && !trimmedLine.startsWith('#')) {
            // Frontmatter content line (key: value format)
            return (
              <div 
                key={index} 
                className="ml-8 p-2 text-sm text-muted-foreground border-l-2 border-blue-200 pl-4"
              >
                {trimmedLine}
              </div>
            )
          } else {
            // Regular text line - treat as content of the previous node
            return (
              <div 
                key={index} 
                className="ml-12 p-2 text-sm text-muted-foreground border-l-2 border-muted pl-4"
              >
                {trimmedLine}
              </div>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div className="flex bg-background h-full">
      {/* Left Sidebar - Markdown Editor */}
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Markdown Editor</h2>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Map Title</Label>
            <Input
              id="title"
              value={mapTitle}
              onChange={(e) => setMapTitle(e.target.value)}
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
        
        <div className="flex-1 p-4 min-h-0">
          <Textarea
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            placeholder="Enter your markdown content here..."
            className="h-full resize-none font-mono text-sm overflow-y-auto"
          />
        </div>
        
        <div className="p-4 border-t space-y-2">
          <Button className="w-full" size="sm" disabled aria-label="Save mindmap (coming soon)">
            <Save className="h-4 w-4 mr-2" />
            Save (Coming Soon)
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <label className="cursor-pointer" aria-label="Import markdown file">
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".md,.markdown"
                  onChange={handleImport}
                  className="hidden"
                  aria-describedby="import-description"
                />
              </label>
            </Button>
            <p id="import-description" className="sr-only">
              Import a markdown file to load existing mindmap content
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={handleExport}
              aria-label="Export mindmap as markdown file"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Center Canvas - Tree View */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="h-12 border-b bg-muted/20 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Mindmap Workspace</h2>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "tree" | "markmap")} className="h-full">
              <TabsList className="h-full">
                <TabsTrigger value="tree" className="h-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Tree Editor
                </TabsTrigger>
                <TabsTrigger value="markmap" className="h-full">
                  <Map className="h-4 w-4 mr-2" />
                  Markmap View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {activeView === "tree" ? "Interactive tree editing" : "Visual mindmap view"}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "tree" | "markmap")} className="h-full m-0">
            <TabsContent value="tree" className="h-full m-0">
              <div className="h-full p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">Interactive Tree Editor</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => addNode(null, 1)}
                        className="flex items-center gap-2"
                        aria-label="Add new root item to tree"
                      >
                        <Plus className="h-4 w-4" />
                        Add Root Item
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (markdownContent.trim()) {
                            setShowOverwriteDialog(true)
                          } else {
                            setMarkdownContent(treeToMarkdown(treeData))
                          }
                        }}
                        className="flex items-center gap-2"
                        aria-label="Convert tree structure to markdown format"
                      >
                        <FileText className="h-4 w-4" />
                        Convert Tree to Markdown
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {treeData.map((node) => renderTreeNode(node))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="markmap" className="h-full m-0">
              <MarkmapViewer 
                markdown={markdownContent}
                className="w-full h-full"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Sidebar - AI Assistant */}
      <div className="w-96 border-l bg-muted/30 flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
        </div>
        
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <AIAssistant
            onAIResponse={handleAIResponse}
            currentMarkdown={markdownContent}
            lastResponse={lastAIResponse}
          />
        </div>
      </div>

      {/* Overwrite Warning Dialog */}
      <Dialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>⚠️ Overwrite Markdown Content?</DialogTitle>
            <DialogDescription>
              This action will replace your current markdown content with the tree structure. 
              This cannot be undone. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowOverwriteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setMarkdownContent(treeToMarkdown(treeData))
                setShowOverwriteDialog(false)
              }}
            >
              Overwrite Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
