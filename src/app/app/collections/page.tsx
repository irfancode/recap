"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { FolderPlus, Folder, ChevronRight, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function CollectionsPage() {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [newName, setNewName] = useState("")
  const [newParent, setNewParent] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; parentId?: string }) => {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      toast.success("Collection created")
      setNewName("")
      setNewParent("")
      setDialogOpen(false)
    },
  })

  const toggleExpand = (id: string) => {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpanded(next)
  }

  const rootCollections = collections?.filter((c: any) => !c.parentId) || []

  const renderCollection = (collection: any, depth = 0) => {
    const hasChildren = collection.children?.length > 0

    return (
      <div key={collection.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent group cursor-pointer",
          )}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(collection.id)} className="h-4 w-4 shrink-0">
              {expanded.has(collection.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}
          <Folder className="h-4 w-4 text-primary shrink-0" />
          <Link href={`/app/collections/${collection.id}`} className="flex-1 text-sm font-medium truncate">
            {collection.name}
          </Link>
          <span className="text-xs text-muted-foreground">{collection._count?.bookmarks || 0}</span>
        </div>
        {hasChildren && expanded.has(collection.id) && (
          <div className="ml-4">
            {collection.children.map((child: any) => renderCollection(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><FolderPlus className="h-4 w-4" /> New Collection</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Collection name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Collection (optional)</Label>
                <select
                  id="parent"
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                  value={newParent}
                  onChange={(e) => setNewParent(e.target.value)}
                >
                  <option value="">None (root level)</option>
                  {collections?.filter((c: any) => !c.parentId).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => createMutation.mutate({ name: newName, parentId: newParent || undefined })}
                disabled={!newName}
                className="w-full"
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card p-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-9 rounded-lg" />
            ))}
          </div>
        ) : rootCollections.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Folder className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No collections yet</p>
          </div>
        ) : (
          rootCollections.map((c: any) => renderCollection(c))
        )}
      </div>
    </div>
  )
}
