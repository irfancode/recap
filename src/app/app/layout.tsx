"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Toaster } from "sonner"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    redirect("/login")
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  )
}
