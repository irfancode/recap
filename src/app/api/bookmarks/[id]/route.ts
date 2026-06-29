import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function getUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId()
    const { id } = await params
    const bookmark = await db.bookmark.findFirst({
      where: { id, userId },
      include: { tags: true, collection: true, highlights: true },
    })
    if (!bookmark) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(bookmark)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId()
    const { id } = await params
    const data = await req.json()
    const existing = await db.bookmark.findFirst({ where: { id, userId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const updateData: Record<string, unknown> = { ...data }
    delete updateData.tags

    if (data.tags) {
      updateData.tags = {
        set: [],
        connectOrCreate: data.tags.map((name: string) => ({
          where: { name_userId: { name, userId } },
          create: { name, userId },
        })),
      }
    }

    const updated = await db.bookmark.update({
      where: { id },
      data: updateData,
      include: { tags: true, collection: true },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId()
    const { id } = await params
    const existing = await db.bookmark.findFirst({ where: { id, userId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await db.bookmark.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
