import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 })
    }

    // Simulate webhook test
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would make an actual HTTP request to the webhook URL
    const testPayload = {
      event: "webhook.test",
      timestamp: new Date().toISOString(),
      data: {
        message: "This is a test webhook from Al Magharabia Trading Co.",
      },
    }

    // Simulate success/failure randomly for demo
    const success = Math.random() > 0.2 // 80% success rate

    if (success) {
      return NextResponse.json({
        success: true,
        status: 200,
        response: "OK",
        payload: testPayload,
      })
    } else {
      return NextResponse.json({
        success: false,
        status: 500,
        response: "Internal Server Error",
        payload: testPayload,
      })
    }
  } catch (error) {
    console.error("Failed to test webhook:", error)
    return NextResponse.json({ error: "Failed to test webhook" }, { status: 500 })
  }
}
