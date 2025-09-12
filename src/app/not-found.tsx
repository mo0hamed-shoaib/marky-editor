"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search, Map } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-muted-foreground/20 mb-4">
            404
          </div>
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Map className="w-full h-full text-muted-foreground/40" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Mindmap Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for seems to have wandered off the map. 
          Don't worry, let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>


        {/* Fun Fact */}
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Fun fact:</strong> The term "mindmap" was coined by Tony Buzan in the 1970s. 
            It's a visual thinking tool that helps organize information in a radial, non-linear manner.
          </p>
        </div>
      </div>
    </div>
  )
}
