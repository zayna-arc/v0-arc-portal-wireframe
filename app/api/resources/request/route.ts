import { type NextRequest, NextResponse } from "next/server"
import type { ResourceRequest } from "@/lib/resources/types"

export async function POST(request: NextRequest) {
  try {
    const data: ResourceRequest = await request.json()

    if (!data.title || !data.need || !data.deadline) {
      return NextResponse.json({ error: "Title, need, and deadline are required" }, { status: 400 })
    }

    // In a real app, this would save to database and notify admins
    console.log("New resource request:", data)

    return NextResponse.json({
      success: true,
      message: "Resource request submitted successfully",
    })
  } catch (error) {
    console.error("Failed to submit resource request:", error)
    return NextResponse.json({ error: "Failed to submit resource request" }, { status: 500 })
  }
}
