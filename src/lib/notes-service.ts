import { Note, Workspace, TodoItem, NotesState } from './notes-types'

const STORAGE_KEYS = {
  NOTES: 'marky-notes',
  WORKSPACES: 'marky-workspaces',
  TODOS: 'marky-todos',
  STATE: 'marky-notes-state'
}

// Default data
const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'personal',
    name: 'Personal',
    color: '#3b82f6',
    isExpanded: true,
    createdAt: new Date()
  },
  {
    id: 'work',
    name: 'Work',
    color: '#10b981',
    isExpanded: true,
    createdAt: new Date()
  }
]

const DEFAULT_TODOS: TodoItem[] = [
  {
    id: '1',
    title: 'Welcome to Marky Notes!',
    description: 'This is your first todo item. You can edit, delete, or mark it as complete.',
    priority: 'medium',
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Notes Service
export class NotesService {
  // Notes
  static getNotes(): Note[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES)
    if (!stored) return []
    
    const notes = JSON.parse(stored)
    // Convert date strings back to Date objects
    return notes.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
      deletedAt: note.deletedAt ? new Date(note.deletedAt) : undefined
    }))
  }

  static saveNotes(notes: Note[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
  }

  static createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const notes = this.getNotes()
    notes.push(newNote)
    this.saveNotes(notes)
    return newNote
  }

  static updateNote(id: string, updates: Partial<Note>): Note | null {
    const notes = this.getNotes()
    const index = notes.findIndex(note => note.id === id)
    if (index === -1) return null
    
    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: new Date()
    }
    this.saveNotes(notes)
    return notes[index]
  }

  static deleteNote(id: string): boolean {
    const notes = this.getNotes()
    const index = notes.findIndex(note => note.id === id)
    if (index === -1) return false
    
    // Soft delete - mark as deleted instead of removing
    notes[index] = {
      ...notes[index],
      deletedAt: new Date(),
      updatedAt: new Date()
    }
    this.saveNotes(notes)
    return true
  }

  static permanentlyDeleteNote(id: string): boolean {
    const notes = this.getNotes()
    const filtered = notes.filter(note => note.id !== id)
    this.saveNotes(filtered)
    return filtered.length < notes.length
  }

  static restoreNote(id: string): boolean {
    const notes = this.getNotes()
    const index = notes.findIndex(note => note.id === id)
    if (index === -1) return false
    
    // Remove deletedAt to restore the note
    const { deletedAt, ...restNote } = notes[index]
    notes[index] = {
      ...restNote,
      updatedAt: new Date()
    }
    this.saveNotes(notes)
    return true
  }

  static getNote(id: string): Note | null {
    const notes = this.getNotes()
    return notes.find(note => note.id === id) || null
  }

  // Workspaces
  static getWorkspaces(): Workspace[] {
    if (typeof window === 'undefined') return DEFAULT_WORKSPACES
    const stored = localStorage.getItem(STORAGE_KEYS.WORKSPACES)
    if (!stored) return DEFAULT_WORKSPACES
    
    const workspaces = JSON.parse(stored)
    // Convert date strings back to Date objects
    return workspaces.map((workspace: any) => ({
      ...workspace,
      createdAt: new Date(workspace.createdAt)
    }))
  }

  static saveWorkspaces(workspaces: Workspace[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces))
  }

  static createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt'>): Workspace {
    const newWorkspace: Workspace = {
      ...workspace,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    const workspaces = this.getWorkspaces()
    workspaces.push(newWorkspace)
    this.saveWorkspaces(workspaces)
    return newWorkspace
  }

  static updateWorkspace(id: string, updates: Partial<Workspace>): Workspace | null {
    const workspaces = this.getWorkspaces()
    const index = workspaces.findIndex(workspace => workspace.id === id)
    if (index === -1) return null
    
    workspaces[index] = { ...workspaces[index], ...updates }
    this.saveWorkspaces(workspaces)
    return workspaces[index]
  }

  static deleteWorkspace(id: string): boolean {
    const workspaces = this.getWorkspaces()
    const filtered = workspaces.filter(workspace => workspace.id !== id)
    this.saveWorkspaces(filtered)
    return filtered.length < workspaces.length
  }

  // Todos
  static getTodos(): TodoItem[] {
    if (typeof window === 'undefined') return DEFAULT_TODOS
    const stored = localStorage.getItem(STORAGE_KEYS.TODOS)
    if (!stored) return DEFAULT_TODOS
    
    const todos = JSON.parse(stored)
    // Convert date strings back to Date objects
    return todos.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
    }))
  }

  static saveTodos(todos: TodoItem[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos))
  }

  static createTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): TodoItem {
    const newTodo: TodoItem = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const todos = this.getTodos()
    todos.push(newTodo)
    this.saveTodos(todos)
    return newTodo
  }

  static updateTodo(id: string, updates: Partial<TodoItem>): TodoItem | null {
    const todos = this.getTodos()
    const index = todos.findIndex(todo => todo.id === id)
    if (index === -1) return null
    
    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: new Date()
    }
    this.saveTodos(todos)
    return todos[index]
  }

  static deleteTodo(id: string): boolean {
    const todos = this.getTodos()
    const filtered = todos.filter(todo => todo.id !== id)
    this.saveTodos(filtered)
    return filtered.length < todos.length
  }

  // State
  static getState(): Partial<NotesState> {
    if (typeof window === 'undefined') return {}
    const stored = localStorage.getItem(STORAGE_KEYS.STATE)
    return stored ? JSON.parse(stored) : {}
  }

  static saveState(state: Partial<NotesState>): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(state))
  }

  // Utility functions
  static getActiveNotes(): Note[] {
    const notes = this.getNotes()
    return notes.filter(note => !note.deletedAt)
  }

  static getDeletedNotes(): Note[] {
    const notes = this.getNotes()
    return notes.filter(note => note.deletedAt)
  }

  static getNotesByWorkspace(workspaceId: string): Note[] {
    const notes = this.getActiveNotes()
    return notes.filter(note => note.workspace === workspaceId)
  }

  static getFavoriteNotes(): Note[] {
    const notes = this.getActiveNotes()
    return notes.filter(note => note.isFavorite)
  }

  static searchNotes(query: string): Note[] {
    const notes = this.getActiveNotes()
    const lowercaseQuery = query.toLowerCase()
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Export/Import
  static exportNotes(): string {
    const data = {
      notes: this.getNotes(),
      workspaces: this.getWorkspaces(),
      todos: this.getTodos(),
      exportedAt: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  }

  static importNotes(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.notes) this.saveNotes(data.notes)
      if (data.workspaces) this.saveWorkspaces(data.workspaces)
      if (data.todos) this.saveTodos(data.todos)
      return true
    } catch {
      return false
    }
  }
}
