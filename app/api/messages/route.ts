import { type NextRequest, NextResponse } from "next/server"
import { messagesStore } from "@/lib/messages/store"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") || undefined
  const filter = searchParams.get("filter") || undefined

  try {
    const conversations = messagesStore.listConversations({ q, filter })
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Failed to fetch conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
