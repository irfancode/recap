"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bookmark,
  Search,
  Layers,
  Tags,
  Heart,
  Archive,
  Trash2,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useAccent, accentThemes } from "@/lib/accent-theme"

const navItems = [
  { href: "/app", label: "All Bookmarks", icon: Bookmark },
  { href: "/app/collections", label: "Collections", icon: Layers },
  { href: "/app/tags", label: "Tags", icon: Tags },
  { href: "/app/favorites", label: "Favorites", icon: Heart },
  { href: "/app/archive", label: "Archive", icon: Archive },
  { href: "/app/trash", label: "Trash", icon: Trash2 },
  { href: "/app/search", label: "Search", icon: Search },
  { href: "/app/settings", label: "Settings", icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { accent, setAccent } = useAccent()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full border-r bg-card transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex items-center gap-3 p-4 border-b h-16">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Bookmark className="h-4 w-4 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <>
              <span className="font-semibold">Recap</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-6 w-6"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-3 space-y-2">
          {sidebarOpen && (
            <>
              <Link href="/app/settings">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </div>
              </Link>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span>{mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <div className="flex items-center gap-1 px-3 py-1">
                {accentThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setAccent(t.id)}
                    className={cn(
                      "h-5 w-5 rounded-full transition-all",
                      accent === t.id ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-110" : "opacity-60 hover:opacity-100"
                    )}
                    style={{ backgroundColor: t.color }}
                    title={t.label}
                  />
                ))}
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </aside>

      <main className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-16")}>
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {session?.user?.name && (
              <span className="text-sm text-muted-foreground">{session.user.name}</span>
            )}
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
