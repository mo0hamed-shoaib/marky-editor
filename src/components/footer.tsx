import { Github, Linkedin } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/mo0hamed-shoaib"
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/mo0hamed-shoaib/nextjs-shadcn-starter/tree/starter"
  
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Image
                src="/jimmy-logo.svg"
                alt="Jimmy logo"
                width={16}
                height={16}
                className="text-muted-foreground fill-current"
              />
              <span>Jimmy</span>
            </div>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span>Source Code</span>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              <span>My LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
