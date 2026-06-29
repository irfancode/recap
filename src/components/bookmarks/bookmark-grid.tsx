"use client"

import { useState } from "react"
import { ExternalLink, Heart, Trash2, MoreHorizontal, Tag, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate, extractDomain } from "@/lib/utils"
import type { BookmarkWithTags, ViewMode } from "@/types"
import Link from "next/link"

interface BookmarkGridProps {
  bookmarks: BookmarkWithTags[]
  view: ViewMode
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
}

export function BookmarkGrid({ bookmarks, view, onDelete, onToggleFavorite }: BookmarkGridProps) {
  return (
    <div
      className={cn(
        "gap-4",
        view === "grid" && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        view === "masonry" && "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
      )}
    >
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          view={view}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}

function BookmarkCard({ bookmark, view, onDelete, onToggleFavorite }: { bookmark: BookmarkWithTags; view: ViewMode; onDelete: (id: string) => void; onToggleFavorite: (id: string, isFavorite: boolean) => void }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card p-4 hover:shadow-md transition-all",
        view === "masonry" && "break-inside-avoid mb-4"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {bookmark.favicon ? (
            <img src={bookmark.favicon} alt="" className="h-4 w-4 rounded shrink-0" />
          ) : (
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <span className="text-xs text-muted-foreground truncate">{bookmark.domain || extractDomain(bookmark.url)}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onToggleFavorite(bookmark.id, !bookmark.isFavorite)}
          >
            <Heart
              className={cn("h-3.5 w-3.5", bookmark.isFavorite && "fill-red-500 text-red-500")}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDelete(bookmark.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {bookmark.ogImage && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
          <img
            src={bookmark.ogImage}
            alt=""
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}

      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block">
        <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2 hover:text-primary transition-colors">
          {bookmark.title || bookmark.url}
        </h3>
      </a>

      {bookmark.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {bookmark.description}
        </p>
      )}

      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {bookmark.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag.name}
            </Badge>
          ))}
          {bookmark.tags.length > 3 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              +{bookmark.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2 border-t text-[10px] text-muted-foreground">
        <span>{formatDate(bookmark.createdAt)}</span>
        {bookmark.collection && (
          <span className="truncate ml-2">{bookmark.collection.name}</span>
        )}
      </div>
    </div>
  )
}
