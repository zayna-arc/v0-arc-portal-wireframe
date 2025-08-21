import { NextResponse } from "next/server"
import { activateUserMembership } from "@/lib/membership"

export async function POST(req: Request) {
  try {
    const { userId, name, email, phone, message } = (await req.json()) as {
      userId?: string
      name?: string
      email?: string
      phone?: string
      message?: string
    }
    if (!userId || !name || !email) {
      return NextResponse.json({ error: "userId, name and email are required" }, { status: 400 })
    }

    // In a real app, persist the lead to your DB or CRM.
    console.log("Elite lead:", { userId, name, email, phone, message })

    // For gating, we mark membership active after lead submission (no subscriptionId).
    await activateUserMembership(userId, {})

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("/api/lead error:", err?.message || err)
    return NextResponse.json({ error: "Lead submission failed" }, { status: 500 })
  }
}
