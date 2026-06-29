import { Bookmark, Collection, Tag, Highlight } from "@prisma/client"

export type BookmarkWithTags = Bookmark & {
  tags: Tag[]
  collection?: Collection | null
  highlights?: Highlight[]
}

export type CollectionWithChildren = Collection & {
  children: CollectionWithChildren[]
  _count?: { bookmarks: number }
}

export type BookmarkFormData = {
  url: string
  title?: string
  description?: string
  collectionId?: string | null
  tags?: string[]
  note?: string
  isFavorite?: boolean
  isRead?: boolean
}

export type ViewMode = "grid" | "list" | "masonry" | "compact"

export type SortOption = "createdAt" | "title" | "domain" | "lastVisitedAt"
export type SortOrder = "asc" | "desc"
