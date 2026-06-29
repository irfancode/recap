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
    const data = await req.json()
    const settings = await db.aiSettings.upsert({
      where: { userId },
      update: data,
      create: { ...data, userId },
    })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId()
    const settings = await db.aiSettings.findUnique({ where: { userId } })
    return NextResponse.json(settings || {})
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
