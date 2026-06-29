"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search as SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BookmarkGrid } from "@/components/bookmarks/bookmark-grid"
import type { BookmarkWithTags } from "@/types"
import { toast } from "sonner"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      const res = await fetch(`/api/bookmarks?search=${encodeURIComponent(debouncedQuery)}&limit=100`)
      if (!res.ok) throw new Error("Failed to search")
      return res.json()
    },
    enabled: debouncedQuery.length > 0,
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
        <SearchIcon className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Search</h1>
      </div>

      <div className="mb-6">
        <div className="relative max-w-xl">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search across all bookmarks, notes, and tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      {!debouncedQuery ? (
        <div className="text-center py-20 text-muted-foreground">
          <SearchIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Start typing to search your bookmarks</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-xl h-40" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-sm">No results found for &quot;{debouncedQuery}&quot;</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-4">{data.total} results</p>
          <BookmarkGrid
            bookmarks={bookmarks}
            view="grid"
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      )}
    </div>
  )
}
