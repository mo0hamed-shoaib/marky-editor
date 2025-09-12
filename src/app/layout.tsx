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
  title: "Marky - AI-Powered Mindmap Creator | Free Online Tool",
  description: "Create beautiful mindmaps with AI assistance. Free online tool for visual knowledge mapping, brainstorming, and project planning. Import/export markdown and HTML files.",
  keywords: [
    "mindmap",
    "mind map",
    "AI mindmap",
    "visual thinking",
    "brainstorming",
    "knowledge mapping",
    "project planning",
    "free mindmap tool",
    "online mindmap",
    "markdown mindmap",
    "AI assistant",
    "visual learning",
    "idea mapping",
    "concept mapping"
  ],
  authors: [{ name: "Mohamed Gamal", url: "https://github.com/mo0hamed-shoaib" }],
  creator: "Mohamed Gamal",
  publisher: "Marky",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://marky-app.vercel.app",
    title: "Marky - AI-Powered Mindmap Creator",
    description: "Create beautiful mindmaps with AI assistance. Free online tool for visual knowledge mapping and brainstorming.",
    siteName: "Marky",
    images: [
      {
        url: "/marky-logo.png",
        width: 1200,
        height: 630,
        alt: "Marky - AI-Powered Mindmap Creator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marky - AI-Powered Mindmap Creator",
    description: "Create beautiful mindmaps with AI assistance. Free online tool for visual knowledge mapping.",
    images: ["/marky-logo.png"],
    creator: "@mo0hamed-shoaib",
  },
  alternates: {
    canonical: "https://marky-app.vercel.app",
  },
  category: "productivity",
  classification: "Mindmap Creation Tool",
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
