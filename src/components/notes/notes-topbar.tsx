"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Star, 
  MoreHorizontal, 
  Palette, 
  Copy, 
  Move, 
  Trash2, 
  Undo, 
  Redo, 
  Download, 
  Upload,
  ArrowLeft
} from "lucide-react"
import { Note } from "@/lib/notes-types"
import { toast } from "sonner"

interface NotesTopBarProps {
  note: Note | null
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void
  onDeleteNote: (noteId: string) => void
  onToggleFavorite: (noteId: string) => void
  onNavigateToDashboard: () => void
}

export function NotesTopBar({
  note,
  onUpdateNote,
  onDeleteNote,
  onToggleFavorite,
  onNavigateToDashboard
}: NotesTopBarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(note?.title || "")

  // Update title when note changes
  useEffect(() => {
    setTitle(note?.title || "")
  }, [note?.id, note?.title])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
  }

  const handleTitleSubmit = () => {
    if (note && title.trim() && title !== note.title) {
      onUpdateNote(note.id, { title: title.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setTitle(note?.title || "")
    setIsEditingTitle(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    }
    if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  const handleDuplicate = () => {
    if (note) {
      // This would need to be implemented in the parent component
      toast.success("Note duplicated successfully")
    }
  }

  const handleMoveTo = () => {
    if (note) {
      // This would need to be implemented in the parent component
      toast.info("Move to workspace feature coming soon")
    }
  }

  const handleMoveToTrash = () => {
    if (note) {
      onDeleteNote(note.id)
      toast.success("Note moved to trash")
    }
  }

  const handleCustomize = () => {
    if (note) {
      // This would need to be implemented in the parent component
      toast.info("Customize feature coming soon")
    }
  }

  const handleExport = () => {
    if (note) {
      // Export as markdown
      const markdown = `# ${note.title}\n\n${note.content}`
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Note exported successfully")
    }
  }

  const handleImport = () => {
    // This would need to be implemented in the parent component
    toast.info("Import feature coming soon")
  }

  if (!note) {
    return null
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToDashboard}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2 flex-1">
            {isEditingTitle ? (
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleKeyDown}
                className="text-lg font-semibold border-none shadow-none p-0 h-auto"
                autoFocus
              />
            ) : (
              <h1 
                className="text-lg font-semibold cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
                onClick={() => setIsEditingTitle(true)}
              >
                {note.title}
              </h1>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(note.id)}
              className="h-8 w-8 p-0"
            >
              <Star 
                className={`h-4 w-4 ${
                  note.isFavorite 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground'
                }`} 
              />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Edited {new Date(note.updatedAt).toLocaleDateString()}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCustomize}>
                <Palette className="h-4 w-4 mr-2" />
                Customize Page
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMoveTo}>
                <Move className="h-4 w-4 mr-2" />
                Move to...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Undo className="h-4 w-4 mr-2" />
                Undo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Redo className="h-4 w-4 mr-2" />
                Redo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleMoveToTrash}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
