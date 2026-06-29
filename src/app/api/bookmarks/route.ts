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
    const { searchParams } = new URL(req.url)
    const collectionId = searchParams.get("collectionId")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const favorite = searchParams.get("favorite")
    const archived = searchParams.get("archived")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: Record<string, unknown> = { userId }

    if (collectionId) where.collectionId = collectionId
    if (tag) where.tags = { some: { name: tag } }
    if (favorite === "true") where.isFavorite = true
    if (archived === "true") where.isArchived = true
    else if (archived !== "all") where.isArchived = false

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { url: { contains: search } },
        { note: { contains: search } },
      ]
    }

    const [bookmarks, total] = await Promise.all([
      db.bookmark.findMany({
        where,
        include: { tags: true, collection: true, highlights: true },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.bookmark.count({ where }),
    ])

    return NextResponse.json({ bookmarks, total, page, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId()
    const { url, title, description, collectionId, tags, note, isFavorite } = await req.json()

    const bookmark = await db.bookmark.create({
      data: {
        url,
        title: title || "",
        description: description || "",
        domain: extractDomain(url),
        userId,
        collectionId: collectionId || null,
        note: note || "",
        isFavorite: isFavorite || false,
        ...(tags?.length ? {
          tags: {
            connectOrCreate: tags.map((name: string) => ({
              where: { name_userId: { name, userId } },
              create: { name, userId },
            })),
          },
        } : {}),
      },
      include: { tags: true, collection: true },
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}
