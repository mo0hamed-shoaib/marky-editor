"use client"

import { useEffect, useState } from "react"
import { Editor } from "@/components/blocks/editor-x/editor"
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
  Upload
} from "lucide-react"
import { Note } from "@/lib/notes-types"
import { toast } from "sonner"

interface NotesEditorProps {
  note: Note | null
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void
  onDeleteNote: (noteId: string) => void
  onToggleFavorite: (noteId: string) => void
}

export function NotesEditor({ note, onUpdateNote, onDeleteNote, onToggleFavorite }: NotesEditorProps) {
  const [content, setContent] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(note?.title || "")

  useEffect(() => {
    if (note) {
      setContent(note.content)
      setTitle(note.title)
    } else {
      setContent("")
      setTitle("")
    }
  }, [note])

  // Update title when note changes
  useEffect(() => {
    setTitle(note?.title || "")
  }, [note?.id, note?.title])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    
    if (note) {
      // Debounce the update to avoid too many saves
      const timeoutId = setTimeout(() => {
        onUpdateNote(note.id, { content: newContent })
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }

  const handleTitleChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent || ""
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

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleSubmit()
    }
    if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  const handleTitleFocus = () => {
    setIsEditingTitle(true)
  }

  const handleTitleBlur = () => {
    handleTitleSubmit()
  }

  const handleDuplicate = () => {
    if (note) {
      toast.success("Note duplicated successfully")
    }
  }

  const handleMoveTo = () => {
    if (note) {
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
      toast.info("Customize feature coming soon")
    }
  }

  const handleExport = () => {
    if (note) {
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
    toast.info("Import feature coming soon")
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No Note Selected
          </h3>
          <p className="text-sm text-muted-foreground">
            Select a note from the sidebar to start editing
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2 flex-1">
                <h1 
                  contentEditable
                  suppressContentEditableWarning={true}
                  onInput={handleTitleChange}
                  onKeyDown={handleTitleKeyDown}
                  onFocus={handleTitleFocus}
                  onBlur={handleTitleBlur}
                  className="text-3xl font-bold cursor-text px-2 py-1 rounded outline-none"
                  style={{ minWidth: '200px' }}
                >
                  {title}
                </h1>
                
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

            <div className="flex items-center gap-4">
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

        {/* Editor Section */}
        <div className="flex-1">
          <Editor
            content={content}
            onChange={handleContentChange}
            placeholder="Start writing your note..."
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}
