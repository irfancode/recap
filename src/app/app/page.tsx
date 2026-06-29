"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BookmarkPlus, Grid3X3, List, LayoutGrid, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookmarkGrid } from "@/components/bookmarks/bookmark-grid"
import { BookmarkList } from "@/components/bookmarks/bookmark-list"
import { AddBookmarkDialog } from "@/components/bookmarks/add-bookmark-dialog"
import type { ViewMode, SortOption, SortOrder, BookmarkWithTags } from "@/types"
import { toast } from "sonner"

export default function AppPage() {
  const queryClient = useQueryClient()
  const [view, setView] = useState<ViewMode>("grid")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("createdAt")
  const [order, setOrder] = useState<SortOrder>("desc")
  const [page, setPage] = useState(1)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks", { search: debouncedSearch, sort, order, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        sort,
        order,
        page: String(page),
        limit: "50",
        ...(debouncedSearch && { search: debouncedSearch }),
      })
      const res = await fetch(`/api/bookmarks?${params}`)
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      toast.success("Bookmark deleted")
    },
  })

  const toggleFavorite = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      })
      if (!res.ok) throw new Error("Failed to update")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
  })

  const bookmarks: BookmarkWithTags[] = data?.bookmarks || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Bookmarks</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOrder(order === "desc" ? "asc" : "desc")}>
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {order === "desc" ? "Newest" : "Oldest"}
          </Button>
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setView("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "masonry" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setView("masonry")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <BookmarkPlus className="h-4 w-4" /> Add Bookmark
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search bookmarks, tags, or notes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-3">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-3 w-full rounded" />
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <BookmarkPlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No bookmarks yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Save your first bookmark to get started
          </p>
          <Button onClick={() => setShowAddDialog(true)}>Add Your First Bookmark</Button>
        </div>
      ) : view === "list" ? (
        <BookmarkList
          bookmarks={bookmarks}
          onDelete={(id) => deleteMutation.mutate(id)}
          onToggleFavorite={(id, fav) => toggleFavorite.mutate({ id, isFavorite: fav })}
        />
      ) : (
        <BookmarkGrid
          bookmarks={bookmarks}
          view={view}
          onDelete={(id) => deleteMutation.mutate(id)}
          onToggleFavorite={(id, fav) => toggleFavorite.mutate({ id, isFavorite: fav })}
        />
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <AddBookmarkDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
