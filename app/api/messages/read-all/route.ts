import { type NextRequest, NextResponse } from "next/server"
import { messagesStore } from "@/lib/messages/store"

export async function POST(request: NextRequest) {
  try {
    messagesStore.markAllRead()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to mark all as read:", error)
    return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 })
  }
}
