"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { BookmarkGrid } from "@/components/bookmarks/bookmark-grid"
import type { BookmarkWithTags } from "@/types"
import { toast } from "sonner"

export default function CollectionDetailPage() {
  const params = useParams<{ id: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/bookmarks?collectionId=${params.id}`)
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
      <div className="flex items-center gap-4 mb-6">
        <Link href="/app/collections">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Collection</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-xl h-40" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No bookmarks in this collection</p>
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
