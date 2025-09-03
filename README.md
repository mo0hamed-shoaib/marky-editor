# Marky Editor - Visual Mindmap Builder

A modern, AI-powered mindmap creation tool built with Next.js 15, shadcn/ui, and OpenRouter AI.

## 🌟 Features

- **Visual Mindmap Editor**: Create and edit mindmaps with an intuitive tree-based interface
- **Real-time Markdown Sync**: Edit in markdown and see changes instantly in the visual editor
- **AI-Powered Features**: 
  - Create mindmaps from text descriptions
  - Convert existing text to mindmap structure
  - Improve and refine mindmap organization
  - Suggest additional content and connections
- **Dual View System**: Switch between Tree Editor and Markmap visualization
- **Interactive Tree Editing**: Add, edit, and delete nodes with real-time updates
- **Import/Export**: Load and save mindmaps in Markdown format
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd marky-editor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your OpenRouter API key to .env.local
# IMPORTANT: Never expose this key in client-side code
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security Features

- **Server-side API calls**: All AI requests go through secure server routes
- **Protected API keys**: API keys are never exposed to the client
- **Rate limiting**: Built-in request throttling (10 requests per minute per IP)
- **Input validation**: All user inputs are validated before processing

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **AI Integration**: OpenRouter API via secure server routes
- **Mindmap Rendering**: markmap-lib, markmap-view, markmap-toolbar
- **State Management**: React hooks with local state
- **File Handling**: Browser-based import/export
- **Security**: Server-side API proxy with rate limiting

## 🎯 Core Components

### Mindmap Editor
- **Left Sidebar**: Markdown editor with title input and file operations
- **Center Canvas**: Dual view system (Tree Editor + Markmap View)
- **Right Sidebar**: AI assistant with multiple AI-powered features

### View Options
- **Tree Editor**: Interactive hierarchical tree structure with inline editing
- **Markmap View**: Visual SVG mindmap rendering using the official markmap library
- **Real-time Sync**: Changes in either view update both instantly

### AI Features
- **Create Markmap**: Generate new mindmaps from text descriptions
- **Convert Text**: Transform existing text into structured mindmaps
- **Improve Structure**: Enhance organization and logical flow
- **Suggest Content**: Generate additional ideas and connections

### File Operations
- **Import**: Load existing Markdown files
- **Export**: Save mindmaps as Markdown
- **Auto-sync**: Real-time synchronization between views

## 🎨 Customization

### Themes
- Light Theme: Clean, professional appearance
- Dark Theme: Easy on the eyes for extended use
- Minimal Theme: Focus on content
- Colorful Theme: Vibrant, engaging visuals

### Layout Options
- Tree Layout: Hierarchical top-down organization
- Markmap Layout: Radial visualization with interactive nodes

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── mindmap-canvas.tsx
│   ├── markmap-viewer.tsx
│   └── ai-assistant.tsx
├── lib/                 # Utility functions
│   ├── ai-service.ts   # AI integration
│   └── markmap-utils.ts # Mindmap operations
└── hooks/               # Custom React hooks
```

### Key Components

- **MarkmapViewer**: Renders interactive SVG mindmaps using the official markmap library
- **AIAssistant**: Handles AI-powered features with multiple operation modes
- **Tree Editor**: Interactive tree structure with real-time markdown conversion
- **Markdown Sync**: Bidirectional conversion between tree structure and markdown format

## 🚧 Current Status

### ✅ Implemented Features
- [x] Interactive tree editor with add/edit/delete operations
- [x] Real-time markdown synchronization
- [x] AI-powered mindmap creation and improvement
- [x] Dual view system (Tree + Markmap)
- [x] Import/export functionality
- [x] Responsive design with shadcn/ui components
- [x] Secure AI integration via server routes
- [x] Theme system with multiple options

### 🔄 In Progress
- [ ] Drag and drop node reordering
- [ ] Advanced node styling and customization
- [ ] Collaboration features
- [ ] Cloud sync capabilities

### 📋 Planned Features
- [ ] Custom AI prompts and templates
- [ ] Multi-language support
- [ ] Advanced analytics and insights
- [ ] Template library
- [ ] Export to various formats (PNG, SVG, PDF)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [OpenRouter](https://openrouter.ai/) for AI capabilities
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Markmap](https://markmap.js.org/) for the mindmap visualization library

---

Built with ❤️ for the mindmap community
