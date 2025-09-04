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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { 
  FileText, 
  Map, 
  Sparkles, 
  Download,
  Upload,
  Plus,
  X
} from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"
import { AIResponse } from "@/lib/ai-service"
import { MarkmapViewer } from "@/components/markmap-viewer"
import { toast } from "sonner"

// Define proper types for tree nodes
interface TreeNode {
  id: string
  text: string
  level: number
  children: TreeNode[]
}

export default function MarkyPage() {
  const [markdownContent, setMarkdownContent] = useState(`# Marky
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
  const [treeData, setTreeData] = useState<TreeNode[]>([
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
    try {
      const newNode = {
        id: Date.now().toString(),
        text: 'New Item',
        level: level,
        children: []
      }

      if (!parentId) {
        setTreeData([...treeData, newNode])
        toast.success("Item Added!", {
          description: "New root item added to tree",
          duration: 3000,
        })
      } else {
        const updateChildren = (nodes: TreeNode[]): TreeNode[] => {
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
        toast.success("Item Added!", {
          description: "New child item added to tree",
          duration: 3000,
        })
      }
    } catch (error) {
      toast.error("Failed to add item. Please try again.")
      console.error("Add node error:", error)
    }
  }

  const updateNodeText = (id: string, newText: string) => {
    const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
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
    try {
      const removeNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter(node => {
          if (node.id === id) return false
          if (node.children) {
            node.children = removeNode(node.children)
          }
          return true
        })
      }
      setTreeData(removeNode(treeData))
      toast.success("Item Deleted!", {
        description: "Item removed from tree successfully",
        duration: 3000,
      })
    } catch (error) {
      toast.error("Failed to delete item. Please try again.")
      console.error("Delete node error:", error)
    }
  }

  // Convert tree to markdown
  const treeToMarkdown = (nodes: TreeNode[], depth: number = 0, isRoot: boolean = true): string => {
    let markdown = ''
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
        const headingLevel = depth + 1
        const headingMark = '#'.repeat(headingLevel)
        markdown += `${headingMark} ${node.text}\n\n`
      } else {
        const indent = '  '.repeat(depth - 3)
        markdown += `${indent}- ${node.text}\n`
      }
      if (node.children && node.children.length > 0) {
        markdown += treeToMarkdown(node.children, depth + 1, false)
      }
    })
    return markdown
  }

  // Convert markdown to tree data structure
  const markdownToTree = (markdown: string) => {
    const lines = markdown.split('\n').filter(line => line.trim())
    const tree: TreeNode[] = []
    const stack: { node: TreeNode; level: number }[] = []
    
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
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
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
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 focus-within:opacity-100 transition-opacity tree-node-buttons">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addNode(node.id, node.level + 1)}
              className="h-6 w-6 p-0"
              aria-label="Add child node"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteNode(node.id)}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              aria-label="Delete node"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="space-y-1">
            {node.children.map((child: TreeNode) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // Handle AI response
  const handleAIResponse = (response: AIResponse) => {
    setLastAIResponse(response)
    
    // Don't show error toasts here - AI Assistant already handles them
    if (response.error) {
      return
    }
    
    // Don't automatically apply AI content - let user decide
    // The AI response will be shown in the UI for review
  }

  // Manually apply AI response when user confirms
  const applyAIResponse = () => {
    if (lastAIResponse && lastAIResponse.content && !lastAIResponse.error) {
      try {
        setMarkdownContent(lastAIResponse.content)
        toast.success("Content Applied!", {
          description: "AI content successfully applied to mindmap",
          duration: 6000,
        })
      } catch (error) {
        toast.error("Failed to apply AI response. Please try again.")
        console.error("Apply AI response error:", error)
      }
    }
  }

  // Handle file import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      toast.error("Invalid file type. Please select a markdown (.md) file.")
      return
    }
    
    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast.error("File too large. Please select a file smaller than 1MB.")
      return
    }
    
      const reader = new FileReader()
    
      reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (!content.trim()) {
          toast.error("File is empty. Please select a file with content.")
          return
        }
        
        setMarkdownContent(content)
        
        // Extract title from first heading if available
        const lines = content.split('\n')
        for (const line of lines) {
          if (line.startsWith('# ')) {
            setMapTitle(line.substring(2).trim())
            break
          }
        }
        
        toast.success("File Imported!", {
          description: `Successfully imported "${file.name}"`,
          duration: 6000,
        })
      } catch (error) {
        toast.error("Failed to read file. Please try again.")
        console.error("Import error:", error)
      }
    }
    
    reader.onerror = () => {
      toast.error("Failed to read file. Please try again.")
    }
    
      reader.readAsText(file)
    
    // Reset input value to allow re-importing the same file
    event.target.value = ""
  }

  // Generate static HTML representation of the mindmap
  const generateStaticHTML = (nodes: TreeNode[]): string => {
    if (!Array.isArray(nodes) || nodes.length === 0) {
      return '<div style="text-align: center; color: #666; padding: 40px;">No mindmap data to display</div>';
    }
    
    const renderNode = (node: TreeNode, depth: number = 0): string => {
      const indent = depth * 30;
      const isRoot = depth === 0;
      
      let html = '';
      
      if (isRoot) {
        html += `<div class="mindmap-node" style="margin-left: ${indent}px;">${node.text}</div>`;
      } else {
        html += `<div class="mindmap-child" style="margin-left: ${indent}px;">${node.text}</div>`;
      }
      
      if (node.children && node.children.length > 0) {
        html += `<div class="mindmap-children">`;
        node.children.forEach(child => {
          html += renderNode(child, depth + 1);
        });
        html += `</div>`;
      }
      
      return html;
    };
    
    return nodes.map(node => renderNode(node)).join('');
  };

  // Handle file export as interactive HTML
  const handleExport = () => {
    try {
      if (!markdownContent.trim()) {
        toast.error("No Content", {
          description: "Please add some content before exporting",
          duration: 3000,
        })
        return
      }
      
      // Debug: Log the tree data
      console.log('Exporting tree data:', treeData);
      console.log('Markdown content:', markdownContent);
      
      // Create complete interactive HTML with full markmap functionality
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mapTitle || 'Mindmap'}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
        }
        
        #markmap {
            width: 100%;
            height: 100vh;
            border: none;
        }
        
        #static-fallback {
            display: none;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
        }
        
        .mindmap-node {
            margin: 10px 0;
            padding: 12px 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 8px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .mindmap-children {
            margin-left: 30px;
            border-left: 3px solid #e2e8f0;
            padding-left: 20px;
        }
        
        .mindmap-child {
            background: #f8f9fa;
            color: #333;
            margin: 8px 0;
            padding: 10px 14px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 18px;
            color: #666;
        }
        
        .fallback-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            color: #856404;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="loading" class="loading">Loading Interactive Mindmap...</div>
    <svg id="markmap" style="display: none;"></svg>
    <div id="static-fallback" style="display: none;">
        <div class="fallback-notice">
            <strong>📱 Static View Mode</strong><br>
            Interactive features unavailable, but your mindmap is fully visible below.
        </div>
        ${generateStaticHTML(treeData)}
    </div>
    
    <!-- Load all dependencies as scripts for maximum compatibility -->
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
    <script src="https://cdn.jsdelivr.net/npm/markmap-lib@0.16.3/dist/browser/index.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/markmap-view@0.15.4/dist/browser/index.min.js"></script>
    
    <!-- Debug script to check library loading -->
    <script>
        console.log('=== LIBRARY LOADING DEBUG ===');
        console.log('D3 loaded:', typeof d3 !== 'undefined');
        console.log('Markmap lib loaded:', typeof window.markmap !== 'undefined');
        console.log('Markmap view loaded:', typeof window.markmap !== 'undefined');
        
        if (typeof window.markmap !== 'undefined') {
            console.log('Markmap object:', window.markmap);
            console.log('Markmap methods:', Object.keys(window.markmap));
        }
    </script>
    
    <script>
        // Wait for all libraries to load
        window.addEventListener('load', function() {
            console.log('Page loaded, checking libraries...');
            
            // Check if libraries are available
            if (typeof window.markmap === 'undefined') {
                console.error('markmap-view not loaded');
                showFallback();
                return;
            }
            
            if (typeof window.markmap.transform === 'undefined') {
                console.error('markmap-lib not loaded');
                showFallback();
                return;
            }
            
            console.log('Libraries loaded successfully');
            initializeMarkmap();
        });
        
        function showFallback() {
            console.log('Showing static fallback');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('markmap').style.display = 'none';
            document.getElementById('static-fallback').style.display = 'block';
        }
        
        function initializeMarkmap() {
            try {
                console.log('Initializing markmap...');
                
                // Access the global objects
                const { markmap } = window;
                const { Markmap, loadCSS, loadJS } = markmap;
                const { transform } = window.markmap;
                
                console.log('Markmap objects:', { markmap, Markmap, loadCSS, loadJS, transform });
                
                // Transform tree data to markdown first, then to markmap format
                const treeData = ${JSON.stringify(treeData)};
                console.log('Tree data:', treeData);
                
                // Convert tree to markdown format
                const treeToMarkdown = (nodes) => {
                    if (!Array.isArray(nodes) || nodes.length === 0) return '';
                    
                    let markdown = '';
                    nodes.forEach(node => {
                        const level = node.level || 1;
                        const prefix = '#'.repeat(level);
                        markdown += \`\${prefix} \${node.text}\\n\`;
                        
                        if (node.children && node.children.length > 0) {
                            node.children.forEach(child => {
                                const childLevel = child.level || level + 1;
                                const childPrefix = '#'.repeat(childLevel);
                                markdown += \`\${childPrefix} \${child.text}\\n\`;
                                
                                if (child.children && child.children.length > 0) {
                                    child.children.forEach(grandChild => {
                                        const grandChildLevel = grandChild.level || childLevel + 1;
                                        const grandChildPrefix = '#'.repeat(grandChildLevel);
                                        markdown += \`\${grandChildPrefix} \${grandChild.text}\\n\`;
                                        
                                        if (grandChild.children && grandChild.children.length > 0) {
                                            grandChild.children.forEach(item => {
                                                markdown += \`- \${item.text}\\n\`;
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                    return markdown;
                };
                
                const markdown = treeToMarkdown(treeData);
                console.log('Generated markdown:', markdown);
                
                // Transform markdown to markmap data
                const { root, features } = transform(markdown);
                console.log('Transformed data:', root);
                
                // Load required CSS and JS assets
                const { styles, scripts } = markmap.getAssets();
                console.log('Assets:', { styles, scripts });
                
                if (styles) loadCSS(styles);
                if (scripts) {
                    loadJS(scripts, {
                        getMarkmap: () => markmap,
                    });
                }
                
                // Hide loading, show markmap
                document.getElementById('loading').style.display = 'none';
                document.getElementById('markmap').style.display = 'block';
                
                // Create the markmap with full functionality
                Markmap.create('#markmap', {
                    // Custom styling options
                    color: (d) => {
                        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
                        return colors[d.depth % colors.length];
                    },
                    duration: 500,
                    maxWidth: 300,
                    initialExpandLevel: 2,
                    zoom: true,
                    pan: true
                }, root);
                
                console.log('Interactive markmap loaded successfully!');
                
            } catch (error) {
                console.error('Error initializing markmap:', error);
                showFallback();
            }
        }
    </script>
</body>
</html>`
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${mapTitle || 'mindmap'}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success("HTML Exported!", {
        description: `Successfully exported "${mapTitle || 'mindmap'}.html"`,
        duration: 6000,
      })
    } catch (error) {
      toast.error("Failed to export HTML file. Please try again.")
      console.error("Export error:", error)
    }
  }
            
            return (
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
                        <label className="cursor-pointer" aria-label="Import markdown file">
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                          <input
                            type="file"
                            accept=".md,.markdown"
                            onChange={handleImport}
                            className="hidden"
                            aria-describedby="mobile-import-description"
                          />
                        </label>
                      </Button>
                      <p id="mobile-import-description" className="sr-only">
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
                        Export as HTML
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
                    onApplyAIResponse={applyAIResponse}
                    currentMarkdown={markdownContent}
                    lastResponse={lastAIResponse}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="border-b bg-muted/20 flex items-center justify-center px-4 py-2">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "tree" | "markmap")} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="tree" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Tree Editor
                </TabsTrigger>
                <TabsTrigger value="markmap" className="flex-1">
                  <Map className="h-4 w-4 mr-2" />
                  Markmap View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "tree" | "markmap")} className="flex-1 min-h-0">
            <TabsContent value="tree" className="h-full m-0 min-h-0">
              <div className="h-full p-4 overflow-y-auto min-h-0">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-base font-medium">Interactive Tree Editor</h3>
                    <div className="flex flex-col gap-2">
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
                          try {
                            if (markdownContent.trim()) {
                              setShowOverwriteDialog(true)
                            } else {
                              const markdown = treeToMarkdown(treeData)
                              if (markdown.trim()) {
                                setMarkdownContent(markdown)
                                toast.success("Tree converted to markdown successfully")
          } else {
                                toast.error("No tree data to convert")
                              }
                            }
                          } catch (error) {
                            toast.error("Failed to convert tree to markdown. Please try again.")
                            console.error("Conversion error:", error)
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
            <TabsContent value="markmap" className="h-full m-0 min-h-0">
              <MarkmapViewer 
                markdown={markdownContent}
                className="w-full h-full"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Desktop Layout: Side-by-side (3 columns) */}
      <div className="hidden lg:flex bg-background h-full w-full">
      {/* Left Sidebar - Markdown Editor */}
      <div className="w-100 border-r bg-muted/30 flex flex-col">
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
          
          <div className="flex-1 p-4 min-h-0">
            <Textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              placeholder="Enter your markdown content here..."
              className="h-full resize-none font-mono text-sm overflow-y-auto"
            />
            </div>
        
        <div className="p-4 border-t space-y-2">
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
        </div>
        
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
                          try {
                            if (markdownContent.trim()) {
                              setShowOverwriteDialog(true)
                            } else {
                              const markdown = treeToMarkdown(treeData)
                              if (markdown.trim()) {
                                setMarkdownContent(markdown)
                                toast.success("Tree converted to markdown successfully")
                              } else {
                                toast.error("No tree data to convert")
                              }
                            }
                          } catch (error) {
                            toast.error("Failed to convert tree to markdown. Please try again.")
                            console.error("Conversion error:", error)
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

      {/* Right Sidebar - AI Assistant */}
      <div className="w-100 border-l bg-muted/30 flex flex-col">
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            </div>
          </div>
          
          <div className="flex-1 px-4 pb-4 overflow-y-auto">
            <AIAssistant
              onAIResponse={handleAIResponse}
              onApplyAIResponse={applyAIResponse}
              currentMarkdown={markdownContent}
              lastResponse={lastAIResponse}
            />
          </div>
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
                try {
                  const markdown = treeToMarkdown(treeData)
                  if (markdown.trim()) {
                    setMarkdownContent(markdown)
                    setShowOverwriteDialog(false)
                    toast.success("Markdown content updated successfully")
                  } else {
                    toast.error("No tree data to convert")
                  }
                } catch (error) {
                  toast.error("Failed to update markdown content. Please try again.")
                  console.error("Overwrite error:", error)
                }
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
