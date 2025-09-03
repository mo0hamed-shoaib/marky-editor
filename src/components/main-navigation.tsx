"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Settings } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
            <Button size="sm" asChild>
              <Link href="/">
                <Plus className="h-4 w-4 mr-2" />
                New Mindmap
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Visual Theme</DropdownMenuLabel>
                <DropdownMenuItem>Light Theme</DropdownMenuItem>
                <DropdownMenuItem>Dark Theme</DropdownMenuItem>
                <DropdownMenuItem>Minimal Theme</DropdownMenuItem>
                <DropdownMenuItem>Colorful Theme</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Layout Options</DropdownMenuLabel>
                <DropdownMenuItem>Radial Layout</DropdownMenuItem>
                <DropdownMenuItem>Hierarchical Layout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
