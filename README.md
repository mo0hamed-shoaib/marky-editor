# Marky - AI-Powered Mindmap Creator

A modern, AI-powered mindmap creation and editing application built with Next.js 15, shadcn/ui, and TypeScript.

## Features

- 🧠 **AI-Powered Creation** - Generate mindmaps from text using AI
- ✏️ **Rich Text Editor** - Create and edit markdown content with a powerful editor
- 🎨 **Beautiful Visualizations** - Interactive mindmap rendering with markmap
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌙 **Dark Mode** - Beautiful dark and light themes
- 💾 **Export/Import** - Export mindmaps as HTML or import markdown files
- 🎯 **Real-time Preview** - See your mindmap update as you type
- 🔧 **Customizable** - Multiple themes and customization options

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Mindmap Library**: markmap
- **Rich Text Editor**: Lexical
- **Icons**: Lucide React
- **AI Integration**: Custom AI service

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main mindmap page
│   ├── editor-x/       # Advanced editor
│   ├── dashboard/      # Dashboard page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── editor/        # Rich text editor components
│   ├── blocks/        # Editor blocks and plugins
│   ├── ui/            # shadcn/ui components
│   └── ...            # Other components
├── lib/               # Utilities and services
│   ├── markmap.ts         # Markmap utilities
│   ├── markmap-utils.ts   # Markmap helper functions
│   ├── html-export.ts     # Export functionality
│   └── ai-service.ts      # AI integration
└── hooks/             # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Related Projects

- [Marky Notes](https://github.com/mo0hamed-shoaib/marky-notes) - AI-powered note-taking application

## License

MIT License - see LICENSE file for details.