import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Recap - Intelligent Bookmark Manager",
  description: "Save, organize, and rediscover your bookmarks with AI-powered search, auto-tagging, and smart recall.",
  keywords: ["bookmark manager", "bookmarks", "save links", "read later", "AI bookmarks", "open source"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
