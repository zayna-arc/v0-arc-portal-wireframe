import { type NextRequest, NextResponse } from "next/server"
import { messagesStore } from "@/lib/messages/store"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    messagesStore.markRead(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to mark as read:", error)
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
  }
}
