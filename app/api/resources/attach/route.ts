import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resourceId, requestId } = await request.json()

    if (!resourceId || !requestId) {
      return NextResponse.json({ error: "Resource ID and request ID are required" }, { status: 400 })
    }

    // In a real app, this would save to database
    // For now, we'll just simulate success
    console.log(`Attaching resource ${resourceId} to request ${requestId}`)

    return NextResponse.json({
      success: true,
      message: "Resource attached to request successfully",
    })
  } catch (error) {
    console.error("Failed to attach resource:", error)
    return NextResponse.json({ error: "Failed to attach resource" }, { status: 500 })
  }
}
