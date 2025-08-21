import { type NextRequest, NextResponse } from "next/server"
import { settingsStore } from "@/lib/settings/store"

export async function GET() {
  try {
    const settings = settingsStore.getState()
    return NextResponse.json({ sessions: settings.security.sessions })
  } catch (error) {
    console.error("Failed to get sessions:", error)
    return NextResponse.json({ error: "Failed to get sessions" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    await settingsStore.revokeSession(sessionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to revoke session:", error)
    return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 })
  }
}
