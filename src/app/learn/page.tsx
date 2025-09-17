"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, BookOpen, Code, Table, List, Link as LinkIcon, Bold, Italic, Quote } from "lucide-react"
import { toast } from "sonner"
import { MarkmapViewer } from "@/components/markmap-viewer"

export default function LearnPage() {
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const copyToClipboard = (text: string, exampleId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedExample(exampleId)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedExample(null), 2000)
  }

  // Calculate preview height based on content complexity
  const getPreviewHeight = (markdown: string) => {
    const lines = markdown.split('\n').length
    const hasCodeBlocks = markdown.includes('```')
    const hasTables = markdown.includes('|')
    const hasLongContent = markdown.length > 1000
    
    // Base height
    let height = 96 // h-96 = 384px
    
    // Adjust based on content complexity
    if (hasLongContent || lines > 20) {
      height = 128 // h-128 = 512px for very long content
    } else if (lines > 15 || hasCodeBlocks || hasTables) {
      height = 112 // h-112 = 448px for medium complexity
    }
    
    return `h-${height}`
  }

  const examples = {
    basic: {
      title: "Basic Structure",
      description: "Learn the fundamental markdown syntax for mindmaps",
      markdown: `# Main Topic
## Subtopic 1
### Category A
- Detail 1
- Detail 2
### Category B
- Detail 3
- Detail 4

## Subtopic 2
### Category C
- Detail 5
- Detail 6`
    },
    formatting: {
      title: "Text Formatting",
      description: "Add emphasis and styling to your mindmap content",
      markdown: `# Project Planning
## **Bold Text** and *Italic Text*
### Important Tasks
- **High Priority** items
- *Optional* features
- ~~Cancelled~~ tasks

## Code and Technical
### Implementation
- Use \`code blocks\` for snippets
- **API endpoints** documentation
- *Database* schemas`
    },
    links: {
      title: "Links and References",
      description: "Add clickable links to external resources",
      markdown: `# Research Project
## External Resources
### Documentation
- [Official Docs](https://example.com/docs)
- [API Reference](https://api.example.com)
- [GitHub Repository](https://github.com/example/repo)

## Internal Links
### Related Topics
- [Project Timeline](#timeline)
- [Team Members](#team)
- [Budget Planning](#budget)`
    },
    lists: {
      title: "Advanced Lists",
      description: "Create structured lists with different levels",
      markdown: `# Learning Path
## Frontend Development
### HTML & CSS
- Basic HTML structure
- CSS styling techniques
  - Flexbox layouts
  - Grid systems
  - Responsive design
- JavaScript fundamentals
  - Variables and functions
  - DOM manipulation
  - Event handling

## Backend Development
### Server Technologies
- Node.js and Express
- Database management
  - SQL databases
  - NoSQL databases
- API development
  - RESTful APIs
  - GraphQL`
    },
    code: {
      title: "Code Blocks",
      description: "Include code snippets and technical examples",
      markdown: `# Web Development Guide
## Frontend Technologies
### React Components
\`\`\`jsx
function MyComponent() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
\`\`\`

### CSS Styling
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

## Backend APIs
### Express.js Route
\`\`\`javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
\`\`\``
    },
    tables: {
      title: "Tables and Data",
      description: "Organize structured data in your mindmaps",
      markdown: `# Project Management
## Team Overview
| Name | Role | Experience |
|------|------|------------|
| John | Frontend | 5 years |
| Sarah | Backend | 3 years |
| Mike | DevOps | 7 years |

## Project Timeline
| Phase | Duration | Status |
|-------|----------|--------|
| Planning | 2 weeks | ✅ Complete |
| Development | 8 weeks | 🔄 In Progress |
| Testing | 2 weeks | ⏳ Pending |
| Deployment | 1 week | ⏳ Pending`
    },
    quotes: {
      title: "Quotes and Notes",
      description: "Add important quotes and highlighted information",
      markdown: `# Design Principles
## User Experience
> "Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs

### Key Principles
- **Simplicity**: Keep it clean and minimal
- **Consistency**: Maintain design patterns
- **Accessibility**: Design for everyone

## Development Philosophy
> "Code is like humor. When you have to explain it, it's bad." - Cory House

### Best Practices
- Write self-documenting code
- Follow naming conventions
- Keep functions small and focused`
    },
    mixed: {
      title: "Mixed Content Example",
      description: "Combine different markdown features for rich mindmaps",
      markdown: `# Complete Project Guide
## **Project Overview**
*This is a comprehensive guide for building a web application*

### Key Features
- **User Authentication** with JWT tokens
- **Real-time Updates** using WebSockets
- **Responsive Design** for all devices

## Technical Stack
### Frontend
\`\`\`javascript
// React component example
const App = () => {
  const [user, setUser] = useState(null);
  return <div>Welcome {user?.name}</div>;
};
\`\`\`

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18.x |
| Express | Framework | 4.x |
| MongoDB | Database | 6.x |

## Resources
### Documentation
- [React Docs](https://react.dev)
- [Express Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)

### Quotes
> "The best way to learn is by doing." - Unknown

## Next Steps
1. **Setup Development Environment**
2. **Create Project Structure**
3. **Implement Core Features**
4. **Testing and Deployment**`
    }
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Learn Markmaps</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master the art of creating beautiful mindmaps with markdown. Learn all the supported features and create stunning visual knowledge maps.
          </p>
        </div>

        {/* Quick Reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Quick Reference
            </CardTitle>
            <CardDescription>
              Essential markdown syntax for mindmaps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <Bold className="h-6 w-6 mx-auto mb-2 text-primary" />
                <code className="text-sm break-words">**Bold**</code>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Italic className="h-6 w-6 mx-auto mb-2 text-primary" />
                <code className="text-sm break-words">*Italic*</code>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Code className="h-6 w-6 mx-auto mb-2 text-primary" />
                <code className="text-sm break-words">`Code`</code>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <LinkIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <code className="text-sm break-words">[Link](url)</code>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <List className="h-6 w-6 mx-auto mb-2 text-primary" />
                <code className="text-sm break-words">- List item</code>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Table className="h-6 w-6 mx-auto mb-2 text-primary" />
                <code className="text-sm break-words">| Table |</code>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Quote className="h-6 w-6 mx-auto mb-2 text-primary" />
                <code className="text-sm break-words">&gt; Quote</code>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Badge variant="outline">Headers</Badge>
                <code className="text-sm block mt-1 break-words"># ## ###</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="formatting">Formatting</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="mixed">Mixed</TabsTrigger>
          </TabsList>

          {Object.entries(examples).map(([key, example]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Markdown Code */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          {example.title}
                        </CardTitle>
                        <CardDescription>{example.description}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(example.markdown, key)}
                      >
                        {copiedExample === key ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap break-words">
                      <code>{example.markdown}</code>
                    </pre>
                  </CardContent>
                </Card>

                {/* Live Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Live Preview
                      {getPreviewHeight(example.markdown) !== 'h-96' && (
                        <Badge variant="secondary" className="text-xs">
                          {getPreviewHeight(example.markdown) === 'h-128' ? 'Large' : 'Medium'}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      See how it looks as an actual mindmap
                      {getPreviewHeight(example.markdown) !== 'h-96' && ' (expanded for better visibility)'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`${getPreviewHeight(example.markdown)} border rounded-lg overflow-hidden`}>
                      <MarkmapViewer 
                        markdown={example.markdown}
                        className="w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 Pro Tips</CardTitle>
            <CardDescription>Best practices for creating effective mindmaps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Structure & Organization</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="break-words">• Start with broad topics (#) and break them down</li>
                  <li className="break-words">• Use consistent hierarchy (## for subtopics, ### for categories)</li>
                  <li className="break-words">• Keep similar content at the same level</li>
                  <li className="break-words">• Balance your branches for better visual appeal</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content & Formatting</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="break-words">• Use **bold** for important concepts</li>
                  <li className="break-words">• Add `code` snippets for technical content</li>
                  <li className="break-words">• Include [links](url) to external resources</li>
                  <li className="break-words">• Use tables for structured data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Visual Appeal</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="break-words">• Keep node text concise and clear</li>
                  <li className="break-words">• Use emojis sparingly for visual interest</li>
                  <li className="break-words">• Group related concepts together</li>
                  <li className="break-words">• Maintain consistent formatting throughout</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">AI Integration</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="break-words">• Use AI to expand on your ideas</li>
              <li className="break-words">• Ask for &quot;more details&quot; on specific topics</li>
                  <li className="break-words">• Request structure improvements</li>
                  <li className="break-words">• Generate content for empty branches</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link href="/">
              Start Creating Your Mindmap
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
