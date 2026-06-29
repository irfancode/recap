"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export const accentThemes = [
  { id: "indigo", label: "Indigo", color: "#6366f1" },
  { id: "rose", label: "Rose", color: "#f43f5e" },
  { id: "emerald", label: "Emerald", color: "#10b981" },
  { id: "amber", label: "Amber", color: "#f59e0b" },
  { id: "sky", label: "Sky", color: "#0ea5e9" },
  { id: "violet", label: "Violet", color: "#8b5cf6" },
  { id: "cyan", label: "Cyan", color: "#06b6d4" },
  { id: "orange", label: "Orange", color: "#f97316" },
  { id: "neutral", label: "Neutral", color: "#333333" },
] as const

type AccentId = (typeof accentThemes)[number]["id"]

interface AccentContextType {
  accent: AccentId
  setAccent: (accent: AccentId) => void
}

const AccentContext = createContext<AccentContextType>({
  accent: "indigo",
  setAccent: () => {},
})

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<AccentId>("indigo")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("recap-accent") as AccentId | null
    if (saved && accentThemes.some((t) => t.id === saved)) {
      setAccentState(saved)
      document.documentElement.setAttribute("data-accent", saved)
    } else {
      document.documentElement.setAttribute("data-accent", "indigo")
    }
  }, [])

  const setAccent = (id: AccentId) => {
    setAccentState(id)
    localStorage.setItem("recap-accent", id)
    document.documentElement.setAttribute("data-accent", id)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  )
}

export function useAccent() {
  return useContext(AccentContext)
}
