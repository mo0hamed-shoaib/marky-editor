"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react"

interface TreeNode {
  id: string
  text: string
  level: number
  children: TreeNode[]
  expanded?: boolean
}

interface TreeViewProps {
  markdown: string
  className?: string
  onAddNode?: (parentId: string) => void
  onEditNode?: (nodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
}

export function TreeView({ 
  markdown, 
  className = "",
  onAddNode,
  onEditNode,
  onDeleteNode
}: TreeViewProps) {
  
  const treeData = useMemo(() => {
    if (!markdown.trim()) return []
    
    const lines = markdown.split('\n').filter(line => line.trim())
    const nodes: TreeNode[] = []
    let nodeCounter = 0
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return
      
      // Count leading # to determine level
      const level = (trimmedLine.match(/^#+/) || [''])[0].length
      
      if (level === 0) {
        // Regular text line - treat as content of current node
        if (nodes.length > 0) {
          const lastNode = nodes[nodes.length - 1]
          lastNode.text += '\n' + trimmedLine
        }
        return
      }
      
      const text = trimmedLine.replace(/^#+\s*/, '').trim()
      const nodeId = `node-${nodeCounter++}`
      
      const newNode: TreeNode = {
        id: nodeId,
        text,
        level,
        children: [],
        expanded: true
      }
      
      // Find parent and add as child
      if (level === 1) {
        nodes.push(newNode)
      } else {
        // Find the appropriate parent
        for (let i = nodes.length - 1; i >= 0; i--) {
          if (nodes[i].level < level) {
            nodes[i].children.push(newNode)
            break
          }
        }
      }
    })
    
    return nodes
  }, [markdown])

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = node.expanded !== false

    return (
      <div key={node.id} className="relative">
        <div 
          className={`
            flex items-center gap-2 p-2 rounded-lg border transition-all
            ${depth === 0 ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'}
          `}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20"
              onClick={() => {
                node.expanded = !node.expanded
                // Force re-render
                window.dispatchEvent(new Event('resize'))
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <span className="flex-1 text-sm font-medium truncate">
            {node.text}
          </span>
          
          {onAddNode && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20"
              onClick={() => onAddNode(node.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
          
          {onEditNode && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20"
              onClick={() => onEditNode(node.id)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          
          {onDeleteNode && node.id !== 'root' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20 text-destructive"
              onClick={() => onDeleteNode(node.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (treeData.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Card className="w-96 border-2 border-dashed border-muted-foreground/30 bg-background/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Start Building</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-sm text-muted-foreground mb-4">
              Add markdown content to see your tree structure here
            </p>
            <p className="text-xs text-muted-foreground">
              Use # for headers, - for lists, or paste existing content
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`w-full h-full p-4 overflow-auto ${className}`}>
      <div className="space-y-2">
        {treeData.map(node => renderNode(node))}
      </div>
    </div>
  )
}
