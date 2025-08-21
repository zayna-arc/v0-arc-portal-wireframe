import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function GET() {
  // Health check for env configuration
  const base = process.env.NEXT_PUBLIC_BASE_URL
  const ok = Boolean(base && process.env.STRIPE_SECRET_KEY)
  return NextResponse.json({ ok })
}

export async function POST(req: Request) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL
    if (!base) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_BASE_URL" }, { status: 500 })
    }
    const body = (await req.json()) as { priceId: string; userId: string }
    if (!body?.priceId || !body?.userId) {
      return NextResponse.json({ error: "priceId and userId are required" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: body.priceId, quantity: 1 }],
      success_url: `${base}/welcome?status=paid&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/welcome?status=cancelled`,
      metadata: {
        userId: body.userId,
        priceId: body.priceId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create checkout session" }, { status: 500 })
  }
}
