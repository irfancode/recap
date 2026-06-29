"use client"

import { Heart, Trash2, ExternalLink, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate, extractDomain } from "@/lib/utils"
import type { BookmarkWithTags } from "@/types"

interface BookmarkListProps {
  bookmarks: BookmarkWithTags[]
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
}

export function BookmarkList({ bookmarks, onDelete, onToggleFavorite }: BookmarkListProps) {
  return (
    <div className="space-y-1">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
            onClick={() => onToggleFavorite(bookmark.id, !bookmark.isFavorite)}
          >
            <Heart className={cn("h-3.5 w-3.5", bookmark.isFavorite && "fill-red-500 text-red-500")} />
          </Button>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            {bookmark.favicon ? (
              <img src={bookmark.favicon} alt="" className="h-4 w-4 rounded shrink-0" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium truncate hover:text-primary transition-colors"
            >
              {bookmark.title || bookmark.url}
            </a>
          </div>

          <span className="text-xs text-muted-foreground hidden md:block w-32 truncate">
            {bookmark.domain || extractDomain(bookmark.url)}
          </span>

          {bookmark.tags.length > 0 && (
            <div className="hidden lg:flex items-center gap-1">
              {bookmark.tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <span className="text-xs text-muted-foreground hidden sm:block w-20 text-right">
            {formatDate(bookmark.createdAt)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
            onClick={() => onDelete(bookmark.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  )
}
