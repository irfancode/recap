"use client"

import { useQuery } from "@tanstack/react-query"
import { Archive } from "lucide-react"
import { BookmarkGrid } from "@/components/bookmarks/bookmark-grid"
import type { BookmarkWithTags } from "@/types"
import { toast } from "sonner"

export default function ArchivePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks", "archive"],
    queryFn: async () => {
      const res = await fetch("/api/bookmarks?archived=true&limit=100")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/bookmarks/${id}`, { method: "DELETE" })
      toast.success("Deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await fetch(`/api/bookmarks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      })
    } catch {
      toast.error("Failed to update")
    }
  }

  const bookmarks: BookmarkWithTags[] = data?.bookmarks || []

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Archive className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Archive</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-xl h-40" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Archive className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Archive is empty.</p>
        </div>
      ) : (
        <BookmarkGrid
          bookmarks={bookmarks}
          view="grid"
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  )
}
