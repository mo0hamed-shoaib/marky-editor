import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { LayoutWrapper } from "@/components/layout-wrapper"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Marky - Mindmap Application",
  description: "AI-powered mindmap creation and editing application",
  icons: {
    icon: "/marky-logo.png",
    shortcut: "/marky-logo.png",
    apple: "/marky-logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-background font-sans antialiased ${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
                  <div className="h-screen flex flex-col">
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
