import { type NextRequest, NextResponse } from "next/server"
import { settingsStore } from "@/lib/settings/store"

export async function GET() {
  try {
    const settings = settingsStore.getState()
    return NextResponse.json({ organization: settings.organization })
  } catch (error) {
    console.error("Failed to get organization settings:", error)
    return NextResponse.json({ error: "Failed to get organization settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    await settingsStore.updateOrganizationSettings(updates)

    const settings = settingsStore.getState()
    return NextResponse.json({ organization: settings.organization })
  } catch (error) {
    console.error("Failed to update organization settings:", error)
    return NextResponse.json({ error: "Failed to update organization settings" }, { status: 500 })
  }
}
