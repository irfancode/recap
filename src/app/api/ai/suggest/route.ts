import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

async function getUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function POST(req: Request) {
  try {
    await getUserId()
    const { url, title } = await req.json()

    const prompt = `Given URL: "${url}" with title: "${title}", suggest 3-5 relevant tags (single words, lowercase) and a one-sentence description. Respond ONLY with valid JSON: { "tags": ["tag1","tag2"], "description": "..." }`

    let aiResponse
    try {
      const aiRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: false,
          format: "json",
        }),
      })

      if (!aiRes.ok) throw new Error("AI not available")
      const data = await aiRes.json()
      aiResponse = JSON.parse(data.response)
    } catch {
      return NextResponse.json({
        tags: [],
        description: "",
        error: "AI not available. Start Ollama: ollama run llama3",
      })
    }

    return NextResponse.json(aiResponse)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
