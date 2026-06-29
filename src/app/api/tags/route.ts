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
    const tags = await db.tag.findMany({
      where: { userId },
      include: { _count: { select: { bookmarks: true } } },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(tags)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId()
    const { name } = await req.json()
    const tag = await db.tag.create({
      data: { name, userId },
    })
    return NextResponse.json(tag, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
