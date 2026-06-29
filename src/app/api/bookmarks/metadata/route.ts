import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Recap/1.0" },
      signal: AbortSignal.timeout(5000),
    })
    const html = await res.text()

    const extractMeta = (pattern: RegExp) => {
      const match = html.match(pattern)
      return match?.[1]?.trim() || ""
    }

    const title =
      extractMeta(/<title>([^<]*)<\/title>/) ||
      extractMeta(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
      extractMeta(/<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"/)

    const description =
      extractMeta(/<meta[^>]*name="description"[^>]*content="([^"]*)"/) ||
      extractMeta(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
      extractMeta(/<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"/)

    const ogImage =
      extractMeta(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/) ||
      extractMeta(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"/)

    const favicon =
      extractMeta(/<link[^>]*rel="icon"[^>]*href="([^"]*)"/) ||
      extractMeta(/<link[^>]*rel="shortcut icon"[^>]*href="([^"]*)"/)

    return NextResponse.json({ title, description, ogImage, favicon })
  } catch {
    return NextResponse.json({ title: "", description: "", ogImage: "", favicon: "" })
  }
}
