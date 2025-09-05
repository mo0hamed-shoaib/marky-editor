"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { 
  Star, 
  Home, 
  Settings, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Edit,
  Sparkles,
  Folder,
  Briefcase,
  BookOpen,
  Lightbulb,
  Heart,
  Music,
  Camera,
  Gamepad2,
  Code,
  Paintbrush,
  Plus,
  Zap,
  Target,
  Globe,
  Shield,
  Rocket,
  Coffee,
  Sun,
  Moon,
  Palette
} from "lucide-react"
import { Note, Workspace } from "@/lib/notes-types"
import { toast } from "sonner"

interface NotesSidebarProps {
  notes: Note[]
  workspaces: Workspace[]
  currentNoteId: string | null
  collapsed: boolean
  onCreateNote: (workspaceId: string) => void
  onSelectNote: (noteId: string) => void
  onCreateWorkspace: (name: string, color?: string) => void
  onUpdateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => void
  onDeleteWorkspace: (workspaceId: string) => void
  onNavigateToDashboard: () => void
  onNavigateToTrash: () => void
}

export function NotesSidebar({
  notes,
  workspaces,
  currentNoteId,
  collapsed,
  onCreateNote,
  onSelectNote,
  onCreateWorkspace,
  onUpdateWorkspace,
  onDeleteWorkspace,
  onNavigateToDashboard,
  onNavigateToTrash
}: NotesSidebarProps) {
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false)
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null)
  const [showEditWorkspace, setShowEditWorkspace] = useState(false)

  const favoriteNotes = notes.filter(note => note.isFavorite)

  // Icon options for workspaces
  const iconOptions = [
    { name: 'Folder', icon: Folder },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Lightbulb', icon: Lightbulb },
    { name: 'Heart', icon: Heart },
    { name: 'Music', icon: Music },
    { name: 'Camera', icon: Camera },
    { name: 'Gamepad2', icon: Gamepad2 },
    { name: 'Code', icon: Code },
    { name: 'Paintbrush', icon: Paintbrush },
    { name: 'Zap', icon: Zap },
    { name: 'Target', icon: Target },
    { name: 'Globe', icon: Globe },
    { name: 'Shield', icon: Shield },
    { name: 'Rocket', icon: Rocket },
    { name: 'Coffee', icon: Coffee },
    { name: 'Sun', icon: Sun },
    { name: 'Moon', icon: Moon },
    { name: 'Palette', icon: Palette },
  ]

  // Color options for workspaces
  const colorOptions = [
    { name: 'Blue', value: 'blue', class: 'text-blue-600' },
    { name: 'Green', value: 'green', class: 'text-green-600' },
    { name: 'Red', value: 'red', class: 'text-red-600' },
    { name: 'Yellow', value: 'yellow', class: 'text-yellow-600' },
    { name: 'Purple', value: 'purple', class: 'text-purple-600' },
    { name: 'Pink', value: 'pink', class: 'text-pink-600' },
    { name: 'Orange', value: 'orange', class: 'text-orange-600' },
    { name: 'Gray', value: 'gray', class: 'text-gray-600' },
  ]

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      onCreateWorkspace(newWorkspaceName.trim())
      setNewWorkspaceName("")
      setShowCreateWorkspace(false)
      toast.success("Workspace created successfully")
    }
  }

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace)
    setShowEditWorkspace(true)
  }

  const handleDeleteWorkspace = (workspaceId: string) => {
    onDeleteWorkspace(workspaceId)
    toast.success("Workspace moved to trash")
  }

  const handleToggleWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId)
    if (workspace) {
      onUpdateWorkspace(workspaceId, { isExpanded: !workspace.isExpanded })
    }
  }

  const getWorkspaceNotes = (workspaceId: string) => {
    return notes.filter(note => note.workspace === workspaceId)
  }

  const getWorkspaceIcon = (workspace: Workspace) => {
    const iconName = workspace.icon || 'Folder'
    const color = workspace.color || 'gray'
    
    // Find the icon component
    const iconOption = iconOptions.find(option => option.name === iconName)
    const IconComponent = iconOption?.icon || Folder
    
    // Apply color class
    const colorClass = colorOptions.find(option => option.value === color)?.class || 'text-gray-600'
    
    return <IconComponent className={`h-4 w-4 ${colorClass}`} />
  }

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} border-r bg-background flex flex-col transition-all duration-300 h-screen`}>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {collapsed ? (
            /* Collapsed View - All Icons */
            <div className="space-y-2">
              {/* Quick Navigation Icons */}
              <div className="space-y-1">
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateToDashboard}
                    className="h-10 w-10 p-0 hover:bg-accent"
                    title="All Notes"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-accent"
                    title="Ask AI"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-accent"
                    title="Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateToTrash}
                    className="h-10 w-10 p-0 hover:bg-accent"
                    title="Trash"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Favorites Icons */}
              {favoriteNotes.length > 0 && (
                <div className="space-y-1">
                  {favoriteNotes.slice(0, 3).map((note) => (
                    <div key={note.id} className="flex justify-center">
                      <Button
                        variant={currentNoteId === note.id ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => onSelectNote(note.id)}
                        className="h-10 w-10 p-0 hover:bg-accent"
                        title={note.title}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Workspace Icons */}
              <div className="space-y-1">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCreateNote(workspace.id)}
                      className="h-10 w-10 p-0 hover:bg-accent"
                      title={workspace.name}
                    >
                      <div className="flex items-center justify-center">
                        {getWorkspaceIcon(workspace)}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Expanded View - Full Sidebar */
            <>
              {/* Quick Navigation */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateToDashboard}
                    className="w-full justify-start"
                  >
                    <Home className="h-4 w-4" />
                    <span className="ml-2">All Notes</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="ml-2">Ask AI</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="ml-2">Settings</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateToTrash}
                    className="w-full justify-start"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-2">Trash</span>
                  </Button>
                </div>
              </div>

              {/* Favorites */}
              {favoriteNotes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Favorites
                  </h3>
                  <div className="space-y-1">
                    {favoriteNotes.map((note) => (
                      <div key={note.id} className="group">
                        <Button
                          variant={currentNoteId === note.id ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => onSelectNote(note.id)}
                          className="w-full justify-start"
                        >
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-2 truncate">{note.title}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workspaces */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Workspaces
                  </h3>
                  <Dialog open={showCreateWorkspace} onOpenChange={setShowCreateWorkspace}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Workspace</DialogTitle>
                        <DialogDescription>
                          Create a new workspace to organize your notes.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Workspace name"
                          value={newWorkspaceName}
                          onChange={(e) => setNewWorkspaceName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateWorkspace(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateWorkspace}>
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Edit Workspace Dialog */}
                  <Dialog open={showEditWorkspace} onOpenChange={setShowEditWorkspace}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Workspace</DialogTitle>
                        <DialogDescription>
                          Update your workspace details.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="workspace-name">Workspace Name</Label>
                          <Input
                            id="workspace-name"
                            placeholder="Workspace name"
                            value={editingWorkspace?.name || ""}
                            onChange={(e) => {
                              if (editingWorkspace) {
                                setEditingWorkspace({ ...editingWorkspace, name: e.target.value })
                              }
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <div className="grid grid-cols-5 gap-2">
                            {iconOptions.map((option) => {
                              const IconComponent = option.icon
                              return (
                                <Button
                                  key={option.name}
                                  variant={editingWorkspace?.icon === option.name ? "default" : "outline"}
                                  size="sm"
                                  className="h-10 w-10 p-0"
                                  onClick={() => {
                                    if (editingWorkspace) {
                                      setEditingWorkspace({ ...editingWorkspace, icon: option.name })
                                    }
                                  }}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </Button>
                              )
                            })}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Color</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {colorOptions.map((option) => (
                              <Button
                                key={option.value}
                                variant={editingWorkspace?.color === option.value ? "default" : "outline"}
                                size="sm"
                                className="h-10"
                                onClick={() => {
                                  if (editingWorkspace) {
                                    setEditingWorkspace({ ...editingWorkspace, color: option.value })
                                  }
                                }}
                              >
                                <div className={`w-3 h-3 rounded-full bg-${option.value}-600 mr-2`}></div>
                                {option.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditWorkspace(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => {
                          if (editingWorkspace) {
                            onUpdateWorkspace(editingWorkspace.id, { 
                              name: editingWorkspace.name,
                              icon: editingWorkspace.icon,
                              color: editingWorkspace.color
                            })
                            setShowEditWorkspace(false)
                            setEditingWorkspace(null)
                            toast.success("Workspace updated successfully")
                          }
                        }}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-1">
                  {workspaces.map((workspace) => {
                    const workspaceNotes = getWorkspaceNotes(workspace.id)
                    return (
                      <div key={workspace.id}>
                        <div className="flex items-center w-full">
                          <ContextMenu>
                            <ContextMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 justify-start group"
                                onClick={() => handleToggleWorkspace(workspace.id)}
                              >
                                <div className="flex items-center mr-2">
                                  <div className="group-hover:hidden">
                                    {getWorkspaceIcon(workspace)}
                                  </div>
                                  <div className="hidden group-hover:block">
                                    {workspace.isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </div>
                                </div>
                                <span className="truncate">{workspace.name}</span>
                              </Button>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <ContextMenuItem onClick={() => handleEditWorkspace(workspace)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Workspace
                              </ContextMenuItem>
                              <ContextMenuItem 
                                onClick={() => handleDeleteWorkspace(workspace.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Move to Trash
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCreateNote(workspace.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {workspace.isExpanded && workspaceNotes.map((note) => (
                          <div key={note.id} className="ml-4 group">
                            <Button
                              variant={currentNoteId === note.id ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => onSelectNote(note.id)}
                              className="w-full justify-start"
                            >
                              <span className="truncate">{note.title}</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

    </div>
  )
}
