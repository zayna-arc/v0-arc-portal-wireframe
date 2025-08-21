import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { activateUserMembership } from "@/lib/membership"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const buf = Buffer.from(await req.arrayBuffer())
    event = stripe.webhooks.constructEvent(buf, sig, secret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err?.message}` }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = (session.metadata?.userId as string) || ""
      const subscriptionId = (session.subscription as string) || undefined
      if (userId) {
        await activateUserMembership(userId, { subscriptionId })
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = (invoice.subscription as string) || undefined
      if (subscriptionId) {
        // Retrieve subscription to read metadata.userId
        const sub = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = (sub.metadata?.userId as string) || ""
        if (userId) {
          await activateUserMembership(userId, { subscriptionId })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Webhook handler error" }, { status: 500 })
  }
}
