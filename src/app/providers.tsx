"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { useState } from "react"
import { AccentProvider } from "@/lib/accent-theme"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AccentProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </AccentProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
