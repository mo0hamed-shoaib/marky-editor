"use client"

import { useMemo } from "react"
import { MindmapNode, MindmapData } from "@/lib/markmap-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react"

interface MindmapCanvasProps {
  mindmap: MindmapData
  onAddNode: (parentId: string) => void
  onEditNode: (nodeId: string) => void
  onDeleteNode: (nodeId: string) => void
  onToggleNode: (nodeId: string) => void
}

export function MindmapCanvas({ 
  mindmap, 
  onAddNode, 
  onEditNode, 
  onDeleteNode, 
  onToggleNode 
}: MindmapCanvasProps) {
  const renderNode = (node: MindmapNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = node.expanded !== false

    return (
      <div key={node.id} className="relative">
        <div 
          className={`
            flex items-center gap-2 p-2 rounded-lg border transition-all
            ${depth === 0 ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'}
            ${depth === 1 ? 'ml-8' : depth > 1 ? `ml-${Math.min(depth * 8, 32)}` : ''}
          `}
          style={{ marginLeft: `${depth * 32}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20"
              onClick={() => onToggleNode(node.id)}
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
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20"
              onClick={() => onAddNode(node.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20"
              onClick={() => onEditNode(node.id)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            {node.id !== 'root' && (
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
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const isEmpty = !mindmap.root.children || mindmap.root.children.length === 0

  if (isEmpty) {
    return (
      <div className="flex-1 bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center">
        <Card className="w-96 border-2 border-dashed border-muted-foreground/30 bg-background/50">
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="text-lg font-semibold mb-2">Start Building Your Mindmap</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Add content to the markdown editor on the left to see your mindmap here
            </p>
            <Button onClick={() => onAddNode('root')}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Node
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-muted/20 to-muted/40 p-4 overflow-auto">
      <div className="min-w-full">
        {renderNode(mindmap.root)}
      </div>
    </div>
  )
}
