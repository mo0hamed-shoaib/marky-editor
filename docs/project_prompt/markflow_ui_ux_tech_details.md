# Markflow - UI/UX & Technical Implementation Details

This document complements the main project plan and focuses on **design guidelines, theming, and smaller technical details**.

---

## 🎨 UI/UX Guidelines

### Layout
- **Top Navigation Bar**
  - Logo & project name.
  - Quick actions: New Markmap, Open Recent, Save, Export.
  - User profile dropdown (login/logout, settings).
- **Left Sidebar**
  - Markdown Editor (with tabs: "Markdown" | "Outline").
  - Search/filter in long notes.
  - Collapsible sections for focus.
- **Center Canvas**
  - Markmap visualization.
  - Live sync with editor.
  - Zoom, pan, fit-to-screen controls.
- **Right Sidebar**
  - Settings panel (themes, fonts, layout).
  - AI assistant panel (generate/rewrite ideas).
- **Footer (optional)**
  - Shortcuts, app version, and status indicators.

### Interaction
- **Drag & Drop:** nodes can be rearranged visually.
- **Inline Editing:** double-click node to edit text directly.
- **Keyboard Shortcuts:**
  - `Enter`: new sibling node.
  - `Tab`: new child node.
  - `Ctrl/Cmd + Z`: undo.
  - `Ctrl/Cmd + Y`: redo.
- **Smooth Animations:** minimal motion with Framer Motion.

---

## 🎨 Theming Instructions

### Color Themes
- **Light Theme**: white canvas, dark text, subtle gray accents.
- **Dark Theme**: dark gray canvas, white text, soft colored nodes.
- **Accent Colors:** blue, green, purple, yellow (applied to root node or active branch).
- Users can switch between themes via a dropdown in settings.

### Typography
- Use **Inter** for UI and **Fira Code** for code blocks.
- Font sizes:
  - Root node: `xl`
  - Child nodes: `lg`
  - Sub-nodes: `sm`
- Line height: comfortable (1.5).
- Ensure good contrast (WCAG AA at minimum).

### Tailwind & shadcn/ui Setup
- Use design tokens:
  - `bg-background`, `text-foreground`, `border-border`.
- Implement with `next-themes` for light/dark toggle.
- Components to use:
  - DropdownMenu (language/theme switcher).
  - Dialog (AI prompts, settings).
  - Card (export, recent projects).
  - Tabs (Markdown vs Outline view).

---

## ⚙️ Technical Details

### API Keys
- **Where to store:**
  - In `.env` (never in client code).
  - Accessed via Supabase Edge Functions or server routes.
- **Never expose keys in the browser.**
- For free-tier AI APIs (like Groq or Hugging Face):
  - Proxy requests through a Supabase Function.
  - Implement request throttling (per user/session).

### Supabase Setup
- **Tables:**
  - `users` → basic profile (id, email, provider, created_at).
  - `markmaps` → title, content (Markdown), settings, user_id (FK).
  - `themes` → user_id, selected_theme, custom_colors (JSON).
- **Auth:**
  - Magic link + Google login.
- **Row Level Security (RLS):**
  - Each user can only access their own markmaps and themes.

### Caching
- AI responses cached in Supabase (per prompt hash).
- Reduce unnecessary API calls.
- Undo/redo history stored locally in browser memory.

### Undo/Redo
- Use a stack-based approach.
- Store history of Markdown edits.
- Keep last 50 states for performance.

---

## 🚫 What Not To Do
- ❌ Don’t hardcode API keys in client-side code.
- ❌ Don’t rely only on AI; always allow manual editing.
- ❌ Don’t overload UI with too many options at once (progressive disclosure).
- ❌ Don’t skip accessibility checks (contrast, keyboard navigation).

---

## ✅ Summary
This guide ensures:
- **Smooth, intuitive UI/UX.**
- **Flexible theming.**
- **Secure API handling.**
- **Maintainable, scalable Supabase setup.**

Together with the main project plan, this forms the foundation of **Markflow**.
