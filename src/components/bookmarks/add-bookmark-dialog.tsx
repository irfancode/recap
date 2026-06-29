"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookmarkPlus, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface AddBookmarkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBookmarkDialog({ open, onOpenChange }: AddBookmarkDialogProps) {
  const queryClient = useQueryClient()
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [collectionId, setCollectionId] = useState("")
  const [tags, setTags] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  async function fetchMetadata(url: string) {
    try {
      const res = await fetch(`/api/bookmarks/metadata?url=${encodeURIComponent(url)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.title) setTitle(data.title)
        if (data.description) setDescription(data.description)
      }
    } catch {
      // silent fail for metadata
    }
  }

  async function handleAiSuggest() {
    if (!url && !title) {
      toast.error("Please add a URL or title first")
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.tags) setTags(data.tags.join(", "))
        if (data.description) setDescription(data.description)
        toast.success("AI suggestions applied")
      }
    } catch {
      toast.error("AI suggestion failed")
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url) {
      toast.error("URL is required")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          title: title || undefined,
          description: description || undefined,
          collectionId: collectionId || undefined,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          note: note || undefined,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")

      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      toast.success("Bookmark saved!")
      setUrl("")
      setTitle("")
      setDescription("")
      setCollectionId("")
      setTags("")
      setNote("")
      onOpenChange(false)
    } catch {
      toast.error("Failed to save bookmark")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
          <DialogDescription>Save a link to your collection</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (e.target.value.startsWith("http")) {
                    fetchMetadata(e.target.value)
                  }
                }}
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAiSuggest}
                disabled={aiLoading}
                title="AI suggest tags & description"
              >
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <select
                id="collection"
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
              >
                <option value="">Unsorted</option>
                {collections?.map((c: { id: string; name: string }) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="tech, article, tutorial"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              placeholder="Why you saved this..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</>
              ) : (
                <><BookmarkPlus className="h-4 w-4 mr-1" /> Save Bookmark</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
