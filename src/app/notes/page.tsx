"use client"

import { useState, useEffect } from "react"
import { NotesService } from "@/lib/notes-service"
import { Note, Workspace, NotesState } from "@/lib/notes-types"
import { NotesSidebar } from "@/components/notes/notes-sidebar"
import { NotesEditor } from "@/components/notes/notes-editor"
import { NotesDashboard } from "@/components/notes/notes-dashboard"
import { NotesTrash } from "@/components/notes/notes-trash"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function NotesPage() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [state, setState] = useState<NotesState>({
    notes: [],
    workspaces: [],
    currentNoteId: null,
    currentWorkspaceId: null,
    sidebarCollapsed: false,
    currentView: 'dashboard'
  })

  // Load initial data
  useEffect(() => {
    const savedState = NotesService.getState()
    const notes = NotesService.getActiveNotes()
    const currentNoteId = savedState.currentNoteId || null
    const currentNote = currentNoteId ? notes.find(note => note.id === currentNoteId) : null
    
    setState({
      notes,
      workspaces: NotesService.getWorkspaces(),
      currentNoteId,
      currentWorkspaceId: savedState.currentWorkspaceId || null,
      sidebarCollapsed: savedState.sidebarCollapsed || false,
      // If there's a current note, show editor; otherwise use saved view or default to dashboard
      currentView: currentNote ? 'editor' : (savedState.currentView || 'dashboard')
    })
    setIsInitialized(true)
  }, [])

  // Save state changes
  useEffect(() => {
    NotesService.saveState({
      currentNoteId: state.currentNoteId,
      currentWorkspaceId: state.currentWorkspaceId,
      sidebarCollapsed: state.sidebarCollapsed,
      currentView: state.currentView
    })
  }, [state.currentNoteId, state.currentWorkspaceId, state.sidebarCollapsed, state.currentView])

  const currentNote = state.currentNoteId 
    ? state.notes.find(note => note.id === state.currentNoteId) 
    : null

  const handleCreateNote = (workspaceId: string) => {
    const newNote = NotesService.createNote({
      title: 'Untitled Note',
      content: '',
      workspace: workspaceId,
      isFavorite: false
    })
    
    setState(prev => ({
      ...prev,
      notes: [...prev.notes, newNote],
      currentNoteId: newNote.id,
      currentWorkspaceId: workspaceId,
      currentView: 'editor'
    }))
  }

  const handleSelectNote = (noteId: string) => {
    const note = state.notes.find(n => n.id === noteId)
    if (note) {
      setState(prev => ({
        ...prev,
        currentNoteId: noteId,
        currentWorkspaceId: note.workspace,
        currentView: 'editor'
      }))
    }
  }

  const handleUpdateNote = (noteId: string, updates: Partial<Note>) => {
    const updatedNote = NotesService.updateNote(noteId, updates)
    if (updatedNote) {
      setState(prev => ({
        ...prev,
        notes: prev.notes.map(note => 
          note.id === noteId ? updatedNote : note
        )
      }))
    }
  }

  const handleDeleteNote = (noteId: string) => {
    if (NotesService.deleteNote(noteId)) {
      setState(prev => ({
        ...prev,
        notes: prev.notes.filter(note => note.id !== noteId),
        currentNoteId: prev.currentNoteId === noteId ? null : prev.currentNoteId
      }))
      if (state.currentNoteId === noteId) {
        setState(prev => ({
          ...prev,
          currentView: 'dashboard'
        }))
      }
    }
  }

  const handleToggleFavorite = (noteId: string) => {
    const note = state.notes.find(n => n.id === noteId)
    if (note) {
      handleUpdateNote(noteId, { isFavorite: !note.isFavorite })
    }
  }

  const handleCreateWorkspace = (name: string, color?: string) => {
    const newWorkspace = NotesService.createWorkspace({
      name,
      color,
      isExpanded: true
    })
    
    setState(prev => ({
      ...prev,
      workspaces: [...prev.workspaces, newWorkspace]
    }))
  }

  const handleUpdateWorkspace = (workspaceId: string, updates: Partial<Workspace>) => {
    const updatedWorkspace = NotesService.updateWorkspace(workspaceId, updates)
    if (updatedWorkspace) {
      setState(prev => ({
        ...prev,
        workspaces: prev.workspaces.map(workspace => 
          workspace.id === workspaceId ? updatedWorkspace : workspace
        )
      }))
    }
  }

  const handleDeleteWorkspace = (workspaceId: string) => {
    if (NotesService.deleteWorkspace(workspaceId)) {
      setState(prev => ({
        ...prev,
        workspaces: prev.workspaces.filter(workspace => workspace.id !== workspaceId),
        currentWorkspaceId: prev.currentWorkspaceId === workspaceId ? null : prev.currentWorkspaceId
      }))
    }
  }

  const handleToggleSidebar = () => {
    setState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }))
  }

  const handleNavigateToDashboard = () => {
    setState(prev => ({
      ...prev,
      currentNoteId: null,
      currentView: 'dashboard'
    }))
  }

  const handleNavigateToTrash = () => {
    setState(prev => ({
      ...prev,
      currentNoteId: null,
      currentView: 'trash'
    }))
  }

  const handleRestoreNote = (noteId: string) => {
    if (NotesService.restoreNote(noteId)) {
      setState(prev => ({
        ...prev,
        notes: NotesService.getActiveNotes()
      }))
    }
  }

  const handlePermanentlyDeleteNote = (noteId: string) => {
    if (NotesService.permanentlyDeleteNote(noteId)) {
      setState(prev => ({
        ...prev,
        notes: NotesService.getActiveNotes(),
        currentNoteId: prev.currentNoteId === noteId ? null : prev.currentNoteId
      }))
    }
  }

  const handleEmptyTrash = () => {
    const deletedNotes = NotesService.getDeletedNotes()
    deletedNotes.forEach(note => NotesService.permanentlyDeleteNote(note.id))
    // Stay on trash page to show empty state
    setState(prev => ({
      ...prev,
      currentNoteId: null
      // Don't change currentView - stay on 'trash'
    }))
  }


  // Show loading state until initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar - Full height, independent column */}
      <NotesSidebar
        notes={state.notes}
        workspaces={state.workspaces}
        currentNoteId={state.currentNoteId}
        collapsed={state.sidebarCollapsed}
        onCreateNote={handleCreateNote}
        onSelectNote={handleSelectNote}
        onCreateWorkspace={handleCreateWorkspace}
        onUpdateWorkspace={handleUpdateWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToTrash={handleNavigateToTrash}
      />

      {/* Main Content Area - Takes remaining space */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Collapse/Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleSidebar}
          className="absolute top-4 left-4 z-10 h-8 w-8 p-0 hover:bg-accent bg-background border shadow-sm"
        >
          {state.sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {state.currentView === 'dashboard' ? (
            <NotesDashboard
              notes={state.notes}
              workspaces={state.workspaces}
              onCreateNote={handleCreateNote}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleDeleteNote}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : state.currentView === 'trash' ? (
            <NotesTrash
              deletedNotes={NotesService.getDeletedNotes() || []}
              onRestoreNote={handleRestoreNote}
              onPermanentlyDeleteNote={handlePermanentlyDeleteNote}
              onEmptyTrash={handleEmptyTrash}
            />
          ) : (
            <NotesEditor
              note={currentNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>

        {/* Custom Footer for Notes */}
        <footer className="border-t bg-background px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>Notes App</div>
            <div>© 2025 Marky</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
