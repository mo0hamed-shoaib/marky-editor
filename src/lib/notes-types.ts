export interface Note {
  id: string
  title: string
  content: string
  workspace: string
  isFavorite: boolean
  color?: string
  style?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface Workspace {
  id: string
  name: string
  color?: string
  icon?: string
  isExpanded: boolean
  createdAt: Date
  deletedAt?: Date
}

export interface TodoItem {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  startDate?: Date
  isCompleted: boolean
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface NotesState {
  notes: Note[]
  workspaces: Workspace[]
  currentNoteId: string | null
  currentWorkspaceId: string | null
  sidebarCollapsed: boolean
  currentView: 'dashboard' | 'editor' | 'trash'
}
