import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function getUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId()
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const urlRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g
    const entries: { url: string; title: string }[] = []

    const matches = [...text.matchAll(urlRegex)]
    for (const match of matches) {
      entries.push({ url: match[1], title: match[2]?.trim() || "" })
    }

    if (entries.length === 0) {
      // Try Netscape format
      const linkMatch = [...text.matchAll(/HREF="([^"]*)"[^>]*>([^<]*)<\/A>/gi)]
      for (const match of linkMatch) {
        entries.push({ url: match[1], title: match[2]?.trim() || "" })
      }
    }

    let count = 0
    for (const entry of entries) {
      if (!entry.url) continue
      const existing = await db.bookmark.findFirst({
        where: { url: entry.url, userId },
      })
      if (!existing) {
        await db.bookmark.create({
          data: {
            url: entry.url,
            title: entry.title,
            domain: extractDomain(entry.url),
            userId,
          },
        })
        count++
      }
    }

    return NextResponse.json({ count, total: entries.length })
  } catch {
    return NextResponse.json({ error: "Import failed" }, { status: 500 })
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}
