"use client"

import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Hash, ExternalLink, Bookmark } from "lucide-react"
import Link from "next/link"

export default function TagsPage() {
  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await fetch("/api/tags")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton h-8 w-24 rounded-full" />
          ))}
        </div>
      ) : !tags?.length ? (
        <div className="text-center py-20 text-muted-foreground">
          <Hash className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No tags yet. Tags appear when you add them to bookmarks.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <Link key={tag.id} href={`/app/search?tag=${tag.name}`}>
              <Badge variant="secondary" className="px-3 py-1.5 text-sm cursor-pointer hover:bg-primary/10 transition-colors gap-2">
                <Hash className="h-3 w-3" />
                {tag.name}
                <span className="text-muted-foreground text-xs ml-1">
                  {tag._count?.bookmarks || 0}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
