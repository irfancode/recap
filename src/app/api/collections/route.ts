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
    const collections = await db.collection.findMany({
      where: { userId },
      include: {
        _count: { select: { bookmarks: true } },
        children: { include: { _count: { select: { bookmarks: true } } } },
      },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(collections)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId()
    const data = await req.json()
    const collection = await db.collection.create({
      data: {
        name: data.name,
        icon: data.icon || "folder",
        color: data.color || "#6366f1",
        parentId: data.parentId || null,
        description: data.description || "",
        userId,
      },
    })
    return NextResponse.json(collection, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
