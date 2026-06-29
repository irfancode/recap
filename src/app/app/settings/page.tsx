"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Settings, Database, Sparkles, Download, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [aiProvider, setAiProvider] = useState("ollama")
  const [aiModel, setAiModel] = useState("llama3")
  const [aiUrl, setAiUrl] = useState("http://localhost:11434")
  const [aiKey, setAiKey] = useState("")
  const [autoTag, setAutoTag] = useState(false)
  const [summarize, setSummarize] = useState(false)

  const saveAiSettings = async () => {
    try {
      const res = await fetch("/api/ai/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: aiProvider,
          model: aiModel,
          apiUrl: aiUrl,
          apiKey: aiKey,
          autoTag,
          summarize,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("AI settings saved")
    } catch {
      toast.error("Failed to save settings")
    }
  }

  const handleExport = async () => {
    try {
      const res = await fetch("/api/export")
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "recap-bookmarks.html"
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Bookmarks exported")
    } catch {
      toast.error("Export failed")
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      toast.success(`Imported ${data.count} bookmarks`)
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    } catch {
      toast.error("Import failed")
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Features
            </CardTitle>
            <CardDescription>Configure AI auto-tagging and summarization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <select
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                >
                  <option value="ollama">Ollama (Local)</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input
                  placeholder="llama3, gpt-4, claude-3..."
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                />
              </div>
            </div>
            {aiProvider !== "ollama" && (
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                />
              </div>
            )}
            {aiProvider === "ollama" && (
              <div className="space-y-2">
                <Label>Ollama URL</Label>
                <Input
                  placeholder="http://localhost:11434"
                  value={aiUrl}
                  onChange={(e) => setAiUrl(e.target.value)}
                />
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoTag}
                  onChange={(e) => setAutoTag(e.target.checked)}
                  className="rounded"
                />
                Auto-tag new bookmarks
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={summarize}
                  onChange={(e) => setSummarize(e.target.checked)}
                  className="rounded"
                />
                Auto-summarize
              </label>
            </div>
            <Button onClick={saveAiSettings}>Save AI Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Import & Export
            </CardTitle>
            <CardDescription>Move your data in and out of Recap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export Bookmarks
              </Button>
              <label className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground gap-2 cursor-pointer">
                <Upload className="h-4 w-4" /> Import (HTML)
                <input
                  type="file"
                  accept=".html,.htm"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
