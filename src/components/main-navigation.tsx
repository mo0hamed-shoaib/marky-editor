"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Image from "next/image"

export function MainNavigation() {
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
            <Button size="sm" variant="outline" asChild>
              <Link href="/learn">
                <BookOpen className="h-4 w-4 mr-2" />
                Learn Markmaps
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
