"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  FileText,
  Star,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Folder,
  MoreHorizontal,
  Trash2,
  Heart
} from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Note, Workspace } from "@/lib/notes-types"
import { toast } from "sonner"
import { format } from "date-fns"

interface NotesDashboardProps {
  notes: Note[]
  workspaces: Workspace[]
  onCreateNote: (workspaceId: string) => void
  onSelectNote: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
  onToggleFavorite: (noteId: string) => void
}

export function NotesDashboard({
  notes,
  workspaces,
  onCreateNote,
  onSelectNote,
  onDeleteNote,
  onToggleFavorite
}: NotesDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all")
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'workspace'>('recent')

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesWorkspace = selectedWorkspace === "all" || note.workspace === selectedWorkspace
      return matchesSearch && matchesWorkspace
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'workspace':
          return a.workspace.localeCompare(b.workspace)
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

  const getWorkspaceIcon = (workspaceName: string) => {
    const name = workspaceName.toLowerCase()
    if (name.includes('work') || name.includes('business')) return <Folder className="h-4 w-4 text-green-600" />
    if (name.includes('personal') || name.includes('life')) return <Heart className="h-4 w-4 text-red-500" />
    if (name.includes('study') || name.includes('learn')) return <FileText className="h-4 w-4 text-blue-600" />
    return <Folder className="h-4 w-4 text-gray-600" />
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - dateObj.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const handleCreateNote = () => {
    if (workspaces.length > 0) {
      onCreateNote(workspaces[0].id)
    } else {
      toast.error("No workspaces available. Please create a workspace first.")
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">All Notes</h1>
        <p className="text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedWorkspace !== "all" && ` in ${selectedWorkspace}`}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All workspaces" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All workspaces</SelectItem>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.name}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: 'recent' | 'title' | 'workspace') => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="workspace">Workspace</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleCreateNote} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              onClick={() => onSelectNote(note.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate mb-1">
                      {note.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getWorkspaceIcon(note.workspace)}
                      <span className="truncate">{note.workspace}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(note.id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Star className={`h-4 w-4 ${note.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite(note.id)
                          }}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteNote(note.id)
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Note Preview */}
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    {note.content && note.content.length > 0 
                      ? note.content.replace(/<[^>]*>/g, '').substring(0, 120) + (note.content.length > 120 ? '...' : '')
                      : 'No content'
                    }
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>
                    
                    {note.isFavorite && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        Favorite
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50">
            <FileText className="h-full w-full" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {searchQuery || selectedWorkspace !== "all" ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || selectedWorkspace !== "all" 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first note to get started'
            }
          </p>
          {(!searchQuery && selectedWorkspace === "all") && (
            <Button onClick={handleCreateNote}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first note
            </Button>
          )}
        </div>
      )}
    </div>
  )
}