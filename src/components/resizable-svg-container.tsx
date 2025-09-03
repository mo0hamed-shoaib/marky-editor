"use client"

import { useLayoutEffect, useRef, useState } from "react"

interface ResizableSVGContainerProps {
  children: React.ReactNode
  className?: string
  onResize?: (width: number, height: number) => void
}

export function ResizableSVGContainer({ 
  children, 
  className = "", 
  onResize 
}: ResizableSVGContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setDimensions({ width, height })
          onResize?.(width, height)
        }
      }
    })

    resizeObserver.observe(container)

    // Initial size check
    const rect = container.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      setDimensions({ width: rect.width, height: rect.height })
      onResize?.(rect.width, rect.height)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [onResize])

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ minHeight: '400px' }}
    >
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <div className="w-full h-full">
          {children}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Initializing visualization...</p>
          </div>
        </div>
      )}
    </div>
  )
}
