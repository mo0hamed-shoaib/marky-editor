"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileText, Network } from "lucide-react"
import Image from "next/image"

export function MainNavigation() {
  const pathname = usePathname()
  
  // Determine which page we're on and what button to show
  const isNotesPage = pathname === '/notes'
  const isMarkmapPage = pathname === '/' || pathname.startsWith('/editor') || pathname.startsWith('/tree-editor')
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Marky Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/marky-logo.png"
                  alt="Marky logo"
                  width={32}
                  height={32}
                  priority
                />
              </div>
              <span className="text-lg font-bold lg:text-xl">Marky</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Dynamic navigation button */}
            {isNotesPage ? (
              <Button size="sm" variant="outline" asChild>
                <Link href="/">
                  <Network className="h-4 w-4 mr-2" />
                  Markmap
                </Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" asChild>
                <Link href="/notes">
                  <FileText className="h-4 w-4 mr-2" />
                  Notes
                </Link>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
