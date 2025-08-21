import { type NextRequest, NextResponse } from "next/server"
import { settingsStore } from "@/lib/settings/store"

export async function GET() {
  try {
    const settings = settingsStore.getState()
    return NextResponse.json({ user: settings.user })
  } catch (error) {
    console.error("Failed to get user settings:", error)
    return NextResponse.json({ error: "Failed to get user settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    await settingsStore.updateUserSettings(updates)

    const settings = settingsStore.getState()
    return NextResponse.json({ user: settings.user })
  } catch (error) {
    console.error("Failed to update user settings:", error)
    return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
  }
}
