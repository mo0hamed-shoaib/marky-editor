
# Project: Markflow - Visual Markmap Builder

## 🌟 Overview
Markflow is a **visual mind-mapping tool** focused on **Markmap syntax**.  
It allows users to create, edit, and customize mindmaps in a **GUI** (drag-and-drop, nodes, edges) while also generating the underlying **Markdown** representation.  

The project will follow a **progressive login model**, meaning users can explore and build maps without logging in, but can save/share by signing up.

---

## 🎯 Core Features

### 1. Mindmap Creation
- Drag-and-drop GUI for creating nodes and edges.  
- Live preview of Markmap (Markdown → Visualization).  
- Import/export Markdown files.  

### 2. Customization
- Multiple visual themes (light, dark, pastel, minimal).  
- Node-level styling (colors, icons, labels).  
- Layout options (radial, hierarchical).  

### 3. AI Features (Free APIs)
- AI-powered **summarization** of text into Markmap structure.  
- AI-powered **expansion** of nodes (auto-generate subtopics).  
- Use **open/free APIs** like Hugging Face or Groq for inference.  

### 4. User Accounts (Progressive)
- **Anonymous mode**: Users can create and export maps without login.  
- **Login options**: Google login + Magic link (Supabase Auth).  
- Save maps to cloud when logged in.  

### 5. Collaboration (Future Phase)
- Real-time editing with Supabase Realtime (like Figma/Excalidraw).  
- Shareable links with view/edit permissions.  

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (TypeScript), TailwindCSS, Shadcn/ui.  
- **Backend**: Supabase (Database + Auth + RLS).  
- **AI**: Hugging Face Inference API (free-tier models), Groq (for LLM inference).  
- **Visualization**: `markmap-lib` for rendering mindmaps.  
- **Storage**: Supabase Postgres (JSONB for maps).  

---

## 🔑 Database Schema (Supabase)

### `users`
- `id` (uuid, pk)  
- `email` (text, unique)  
- `created_at` (timestamp)  

### `maps`
- `id` (uuid, pk)  
- `user_id` (uuid, fk → users.id, nullable for anonymous)  
- `title` (text)  
- `content` (jsonb → Markmap tree)  
- `created_at` (timestamp)  
- `updated_at` (timestamp)  

### RLS (Row-Level Security)
- Users can only read/write their own maps.  
- Anonymous maps stored locally, only sync after login.  

---

## 🚀 Implementation Plan

### Phase 1 – Core MVP
- [ ] GUI mindmap editor with drag/drop.  
- [ ] Export/import Markmap markdown.  
- [ ] Local storage for anonymous users.  

### Phase 2 – Accounts & Cloud Sync
- [ ] Add Supabase auth (Google + Magic Link).  
- [ ] Sync maps to Supabase DB.  
- [ ] RLS setup for user-owned maps.  

### Phase 3 – AI Integration
- [ ] Hugging Face summarization → Markmap structure.  
- [ ] AI node expansion.  
- [ ] UI for triggering AI actions.  

### Phase 4 – Customization & Themes
- [ ] Prebuilt themes (light, dark, minimal, colorful).  
- [ ] Node-level customization (icons, colors).  

### Phase 5 – Collaboration (Stretch Goal)
- [ ] Realtime editing (Supabase Realtime or WebRTC).  
- [ ] Shareable public/private maps.  

---

## ❌ What NOT To Do
- Don’t force login upfront → kills UX.  
- Don’t rely on paid AI APIs initially → stay within free Hugging Face/Groq tiers.  
- Don’t over-engineer editor (keep it **simple and intuitive**).  
- Don’t block users with too many customization options early → progressive enhancement.  

---

## 📌 Key Considerations
- **Performance**: Large maps should render smoothly.  
- **Offline-first**: Store maps locally in IndexedDB until sync.  
- **Accessibility**: Keyboard navigation, screen reader support.  
- **Future-proof**: Design schema flexible enough for future collab features.  

---

## ✅ Deliverables
1. Functional **Markmap GUI editor**.  
2. **Markdown/Markmap export** feature.  
3. **Progressive login with Supabase**.  
4. **AI-powered summarization/expansion** (free APIs).  
5. **Cloud sync with RLS security**.  

---

## 🔮 Vision
Markflow will become the **Excalidraw of mindmaps**, combining **ease of use (GUI)**, **power (Markdown/AI)**, and **freedom (progressive login, free-first approach)**.  
