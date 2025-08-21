import { type NextRequest, NextResponse } from "next/server"
import { settingsStore } from "@/lib/settings/store"

export async function GET() {
  try {
    const settings = settingsStore.getState()
    return NextResponse.json({ apiKeys: settings.integrations.apiKeys })
  } catch (error) {
    console.error("Failed to get API keys:", error)
    return NextResponse.json({ error: "Failed to get API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, permissions } = await request.json()

    if (!name || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json({ error: "Name and permissions are required" }, { status: 400 })
    }

    const apiKey = await settingsStore.createApiKey(name, permissions)
    return NextResponse.json({ apiKey })
  } catch (error) {
    console.error("Failed to create API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get("id")

    if (!keyId) {
      return NextResponse.json({ error: "API key ID is required" }, { status: 400 })
    }

    await settingsStore.revokeApiKey(keyId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to revoke API key:", error)
    return NextResponse.json({ error: "Failed to revoke API key" }, { status: 500 })
  }
}
