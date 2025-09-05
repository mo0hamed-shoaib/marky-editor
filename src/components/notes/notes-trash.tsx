"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trash2, 
  RotateCcw, 
  Calendar, 
  FileText,
  AlertTriangle
} from "lucide-react"
import { Note } from "@/lib/notes-types"
import { toast } from "sonner"

interface NotesTrashProps {
  deletedNotes: Note[]
  onRestoreNote: (noteId: string) => void
  onPermanentlyDeleteNote: (noteId: string) => void
  onEmptyTrash: () => void
}

export function NotesTrash({
  deletedNotes,
  onRestoreNote,
  onPermanentlyDeleteNote,
  onEmptyTrash
}: NotesTrashProps) {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])

  // Safety check to ensure deletedNotes is an array
  const safeDeletedNotes = Array.isArray(deletedNotes) ? deletedNotes : []

  const handleSelectNote = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotes.length === safeDeletedNotes.length) {
      setSelectedNotes([])
    } else {
      setSelectedNotes(safeDeletedNotes.map(note => note.id))
    }
  }

  const handleRestoreSelected = () => {
    selectedNotes.forEach(noteId => onRestoreNote(noteId))
    setSelectedNotes([])
    toast.success(`${selectedNotes.length} note(s) restored`)
  }

  const handleDeleteSelected = () => {
    selectedNotes.forEach(noteId => onPermanentlyDeleteNote(noteId))
    setSelectedNotes([])
    toast.success(`${selectedNotes.length} note(s) permanently deleted`)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const extractContentPreview = (content: any): string => {
    if (typeof content === 'string') {
      return content
    }
    
    if (content && typeof content === 'object') {
      // Handle mindmap content
      if (content.root && content.root.text) {
        return content.root.text
      }
      
      // Handle other object types
      if (content.text) {
        return content.text
      }
      
      // Fallback for any other object
      return 'Complex content (mindmap or structured data)'
    }
    
    return 'No content'
  }

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Trash2 className="h-8 w-8 text-muted-foreground" />
            <h1 className="text-3xl font-bold">Trash</h1>
          </div>
          <p className="text-muted-foreground">
            Deleted notes are kept here for 30 days before being permanently removed.
          </p>
        </div>

        {safeDeletedNotes.length > 0 ? (
          <>
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedNotes.length === safeDeletedNotes.length ? 'Deselect All' : 'Select All'}
                </Button>
                {selectedNotes.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestoreSelected}
                      className="text-green-600 hover:text-green-700"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore ({selectedNotes.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteSelected}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Forever ({selectedNotes.length})
                    </Button>
                  </>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={onEmptyTrash}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Empty Trash
              </Button>
            </div>

            {/* Deleted Notes List */}
            <div className="space-y-4">
              {safeDeletedNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedNotes.includes(note.id)}
                          onChange={() => handleSelectNote(note.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <CardTitle className="text-lg">{note.title || 'Untitled Note'}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          Deleted
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRestoreNote(note.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPermanentlyDeleteNote(note.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Forever
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {note.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {extractContentPreview(note.content)}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Deleted {note.deletedAt ? formatDate(note.deletedAt) : 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>Created {note.createdAt ? formatDate(note.createdAt) : 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Trash2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Trash is Empty
            </h3>
            <p className="text-sm text-muted-foreground">
              Deleted notes will appear here. They'll be automatically removed after 30 days.
            </p>
          </div>
        )}
    </div>
  )
}
