import { type NextRequest, NextResponse } from "next/server"
import { resourcesStore } from "@/lib/resources/store"

export async function POST(request: NextRequest) {
  try {
    const { resourceId, action } = await request.json()

    if (!resourceId || !action) {
      return NextResponse.json({ error: "Resource ID and action are required" }, { status: 400 })
    }

    if (action === "save") {
      resourcesStore.saveResource(resourceId)
    } else if (action === "unsave") {
      resourcesStore.unsaveResource(resourceId)
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'save' or 'unsave'" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      saved: resourcesStore.isSaved(resourceId),
      totalSaved: resourcesStore.getSavedCount(),
    })
  } catch (error) {
    console.error("Failed to save/unsave resource:", error)
    return NextResponse.json({ error: "Failed to save/unsave resource" }, { status: 500 })
  }
}
