"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors={true}
      closeButton={true}
      position="top-right"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--toast-success-background": "var(--toast-success-background)",
          "--toast-success-border": "var(--toast-success-border)",
          "--toast-success-foreground": "var(--toast-success-foreground)",
          "--toast-error-background": "var(--toast-error-background)",
          "--toast-error-border": "var(--toast-error-border)",
          "--toast-error-foreground": "var(--toast-error-foreground)",
          "--toast-warning-background": "var(--toast-warning-background)",
          "--toast-warning-border": "var(--toast-warning-border)",
          "--toast-warning-foreground": "var(--toast-warning-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
