import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function getUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId()
    const bookmarks = await db.bookmark.findMany({
      where: { userId, isArchived: false },
      include: { tags: true, collection: true },
      orderBy: { createdAt: "desc" },
    })

    const collections = await db.collection.findMany({ where: { userId } })
    const collectionMap = new Map(collections.map((c) => [c.id, c.name]))

    let html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Recap Bookmarks Export</title></head><body>
<h1>Recap Bookmarks Export</h1><p>Exported: ${new Date().toISOString()}</p><dl>`

    for (const b of bookmarks) {
      const tags = b.tags.map((t) => t.name).join(",")
      const colName = b.collectionId ? collectionMap.get(b.collectionId) || "Unsorted" : "Unsorted"
      html += `
<dt><a href="${escapeHtml(b.url)}">${escapeHtml(b.title || b.url)}</a></dt>
<dd><p>${escapeHtml(b.description || "")}</p>
<p>Collection: ${escapeHtml(colName)} | Tags: ${escapeHtml(tags)} | Saved: ${b.createdAt.toISOString()}</p>
${b.note ? `<p>Note: ${escapeHtml(b.note)}</p>` : ""}</dd>`
    }

    html += `</dl></body></html>`

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": 'attachment; filename="recap-bookmarks.html"',
      },
    })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}
