"use client"

import { MainNavigation } from "./main-navigation"
import { Footer } from "./footer"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <>
      <MainNavigation />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <Footer />
    </>
  )
}
