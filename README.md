<div align="center">
  <img src="public/marky-logo.png" alt="Marky Logo" width="120" height="120" />
  <h1>Marky</h1>
  <p><strong>AI-Powered Mindmap Creator</strong></p>
  <p>A modern, intuitive mindmap creation and editing application that transforms your ideas into beautiful visual mindmaps.</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-0.8-000000?style=flat-square)](https://ui.shadcn.com/)
  [![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
</div>

## 🎥 Demo

<p align="center">
  <a href="https://marky-editor.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20Marky-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
</p>

## 📚 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Quick Start](#-quick-start)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **🧠 AI-Powered Creation** - Generate mindmaps from text using advanced AI
- **✏️ Rich Markdown Editor** - Create and edit content with syntax highlighting
- **🎨 Interactive Visualizations** - Beautiful mindmap rendering with markmap.js
- **📱 Fully Responsive** - Seamless experience across all devices
- **🌙 Dark/Light Mode** - Beautiful themes with system preference detection

### 💾 Data Management
- **📁 File Import/Export** - Support for `.md`, `.markdown`, `.html`, and `.htm` files
- **💾 Local Storage** - Automatic saving and restoration of your work
- **🔄 Auto-save** - Never lose your progress with intelligent auto-saving
- **📤 HTML Export** - Export mindmaps as standalone HTML files

### 🎨 User Experience
- **⚡ Real-time Preview** - See your mindmap update instantly as you type
- **🎯 Smart Auto-fit** - Automatic window sizing for optimal viewing
- **📚 Learning Center** - Built-in tutorials and markdown guides
- **🔍 Error Handling** - Graceful error boundaries and user-friendly messages
- **♿ Accessibility** - WCAG compliant with keyboard navigation support

## 🚀 Quick Start

### Option 1: Try Online
Visit **[marky-app.vercel.app](https://marky-app.vercel.app)** to start creating mindmaps immediately!

### Option 2: Local Development

#### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

#### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mo0hamed-shoaib/marky-app.git
   cd marky-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

#### Environment Setup (Optional)
Create a `.env.local` file for custom configuration:
```env
# Optional: Custom branding links
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-username
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/your-profile

# Optional: AI service configuration
NEXT_PUBLIC_AI_ENDPOINT=your-ai-endpoint
```

## 🛠️ Tech Stack

### Frontend
- **⚡ Next.js 15** - React framework with App Router
- **🎨 shadcn/ui** - Modern, accessible UI components
- **💅 Tailwind CSS** - Utility-first CSS framework
- **📘 TypeScript** - Type-safe JavaScript development

### Libraries & Tools
- **🗺️ markmap** - Interactive mindmap visualization
- **✏️ Lexical** - Extensible rich text editor
- **🎯 Lucide React** - Beautiful icon library
- **🤖 Custom AI Service** - Intelligent content generation
- **📦 React Error Boundary** - Graceful error handling

### Development
- **🔧 ESLint** - Code linting and formatting
- **📱 Responsive Design** - Mobile-first approach
- **♿ Accessibility** - WCAG 2.1 compliance
- **🚀 Performance** - Optimized for speed and efficiency

## 📁 Project Structure

```
marky-app/
├── public/                    # Static assets
│   ├── marky-logo.png        # Project logo
│   └── screenshot.png        # App screenshot
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout with SEO
│   │   ├── page.tsx          # Main mindmap editor page
│   │   ├── learn/            # Learning center
│   │   ├── globals.css       # Global styles & themes
│   │   ├── sitemap.ts        # SEO sitemap
│   │   ├── robots.ts         # SEO robots.txt
│   │   └── not-found.tsx     # Custom 404 page
│   ├── components/           # React components
│   │   ├── editor/          # Rich text editor
│   │   ├── blocks/          # Editor blocks & plugins
│   │   ├── ui/              # shadcn/ui components
│   │   ├── markmap-viewer.tsx
│   │   ├── main-navigation.tsx
│   │   ├── theme-provider.tsx
│   │   └── ...              # Other components
│   ├── lib/                 # Utilities & services
│   │   ├── markmap.ts       # Markmap core utilities
│   │   ├── markmap-utils.ts # HTML/MD parsing & conversion
│   │   ├── html-export.ts   # Export functionality
│   │   ├── ai-service.ts    # AI integration
│   │   └── utils.ts         # General utilities
│   └── hooks/               # Custom React hooks
├── .env.local               # Environment variables
├── components.json          # shadcn/ui configuration
├── tailwind.config.js       # Tailwind CSS config
└── package.json            # Dependencies & scripts
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on [localhost:3000](http://localhost:3000) |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run type-check` | Run TypeScript type checking |

## 🎯 Usage Guide

### Creating Your First Mindmap
1. **Start with the starter template** - The app provides a helpful starter mindmap
2. **Edit the markdown** - Use the left panel to modify your content
3. **Watch it update** - See your changes reflected in real-time on the right
4. **Export when ready** - Save as HTML or import existing files

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save current mindmap |
| `Ctrl/Cmd + O` | Open file dialog |
| `Ctrl/Cmd + E` | Export as HTML |
| `Ctrl/Cmd + /` | Toggle help panel |
| `F11` | Toggle fullscreen |

### Supported File Formats
- **Import**: `.md`, `.markdown`, `.html`, `.htm`
- **Export**: `.html` (standalone files with embedded styles)

### Markdown Features
- **Headers** (`#`, `##`, `###`) - Create mindmap nodes and hierarchies
- **Lists** (`-`, `*`, `+`) - Add sub-nodes and branches
- **Code blocks** (` ``` `) - Syntax highlighted code snippets
- **Tables** - Structured data visualization
- **Links** (`[text](url)`) - Interactive connections
- **Emojis** (`:emoji:`) - Visual enhancement and categorization
- **Bold/Italic** (`**bold**`, `*italic*`) - Text emphasis

### AI-Powered Generation
Generate mindmaps from text descriptions:
```markdown
Create a mindmap about "Project Management Methodologies"
```

The AI will automatically structure your content into a hierarchical mindmap format.

## 🔧 API Reference

### Core Functions

#### `generateMindmap(content: string): Promise<string>`
Transforms text content into structured markdown suitable for mindmap visualization.

#### `exportHTML(content: string, options?: ExportOptions): string`
Exports the current mindmap as a standalone HTML file.

```typescript
interface ExportOptions {
  title?: string;
  includeStyles?: boolean;
  includeScripts?: boolean;
}
```

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] **Collaboration** - Real-time collaborative editing
- [ ] **Cloud Sync** - Save and sync across devices
- [ ] **Templates** - Pre-built mindmap templates
- [ ] **Advanced Export** - PDF, PNG, SVG export options
- [ ] **Plugin System** - Custom node types and behaviors

### Version 1.5 (In Progress)
- [ ] **Enhanced AI** - More intelligent content suggestions
- [ ] **Mobile App** - Native iOS and Android apps
- [ ] **Import Improvements** - Support for more file formats
- [ ] **Performance** - Faster rendering for large mindmaps

### Completed ✅
- [x] Basic mindmap creation and editing
- [x] File import/export functionality
- [x] Dark/light theme support
- [x] Responsive design
- [x] Auto-save functionality

## 🤝 Contributing

We love contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Ways to Contribute
- 🐛 **Report Bugs** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new features or improvements
- 🔧 **Code Contributions** - Submit pull requests for bug fixes or features
- 📚 **Documentation** - Improve our docs and guides
- 🎨 **Design** - Help with UI/UX improvements

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style
We use ESLint and Prettier for code formatting. Run `npm run lint` before submitting.

## ❓ FAQ

**Q: Is Marky free to use?**
A: Yes! Marky is completely free and open-source under the MIT license.

**Q: Can I use Marky offline?**
A: Yes, once loaded, Marky works offline. Your data is stored locally in your browser.

**Q: How do I report a bug?**
A: Please create an issue on our [GitHub Issues page](https://github.com/mo0hamed-shoaib/marky-app/issues) with detailed information.

**Q: Can I contribute translations?**
A: We're planning to add internationalization in a future release. Stay tuned!

**Q: Is my data secure?**
A: Yes, all data is processed locally in your browser. We don't send your mindmaps to any external servers.

## 📊 Performance

- **Bundle Size**: ~800KB-1.2MB gzipped
- **First Load**: ~3-5 seconds on 3G
- **Interactive**: ~1-2 seconds
- **Accessibility Score**: ~85-90/100
- **Performance Score**: ~70-80/100

## 🌟 Show Your Support

If you find Marky helpful, please consider:
- ⭐ Starring the repository
- 🐦 Sharing on social media
- 📝 Writing a blog post or review
- 💰 [Sponsoring the project](https://github.com/sponsors/mo0hamed-shoaib)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to the amazing open-source community:

- [markmap](https://github.com/gera2ld/markmap) - The fantastic mindmap visualization library that powers our visuals
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible UI components that make our interface shine
- [Next.js](https://nextjs.org/) - The React framework that makes our app fast and SEO-friendly
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development
- [Lexical](https://lexical.dev/) - Meta's extensible text editor framework

## 📞 Support & Contact

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/mo0hamed-shoaib/marky-app/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/mo0hamed-shoaib/marky-app/discussions)
- **📧 Email**: mohamed.g.shoaib@gmail.com

---

<div align="center">
  <p>Made with ❤️ by <strong>Jimmy</strong></p>
  <p>
    <a href="https://github.com/mo0hamed-shoaib">GitHub</a> •
    <a href="https://www.linkedin.com/in/mohamed-g-shoaib/">LinkedIn</a> •
    <a href="https://marky-app.vercel.app">Live Demo</a>
  </p>
  
  <br>
  
  <p>
    <strong>Star ⭐ this repo if you find it helpful!</strong>
  </p>
</div>