"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { MainNavigation } from "./main-navigation"
import { Footer } from "./footer"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Pages that need full scrolling (not restricted height)
  const scrollablePages = ['/learn', '/not-found']
  const isScrollablePage = scrollablePages.includes(pathname)
  
  // Add/remove scrollable-page class to body and html
  useEffect(() => {
    if (isScrollablePage) {
      document.body.classList.add('scrollable-page')
      document.documentElement.classList.add('scrollable-page')
    } else {
      document.body.classList.remove('scrollable-page')
      document.documentElement.classList.remove('scrollable-page')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('scrollable-page')
      document.documentElement.classList.remove('scrollable-page')
    }
  }, [isScrollablePage])
  
  if (isScrollablePage) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNavigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="h-screen flex flex-col">
      <MainNavigation />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  )
}
