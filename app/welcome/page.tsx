"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ChevronLeft, CreditCard, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getTierInfo, type TierValue, PRICES, type Tier } from "@/lib/prices"

type OnboardingState = {
  membership?: TierValue
}

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "user_dev"
  const key = "arc-user-id"
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const created = `user_${Math.random().toString(36).slice(2, 10)}`
  localStorage.setItem(key, created)
  return created
}

export default function Welcome() {
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState<string>("")
  const [tierValue, setTierValue] = useState<TierValue>("builder")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [membershipActive, setMembershipActive] = useState(false)
  const [paymentUnavailable, setPaymentUnavailable] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("arc-onboarding-v1")
      if (raw) {
        const parsed = JSON.parse(raw) as OnboardingState
        if (parsed?.membership) setTierValue(parsed.membership)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    setUserId(getOrCreateUserId())
  }, [])

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/checkout", { method: "GET", cache: "no-store" })
        const data = (await res.json()) as { ok?: boolean }
        setPaymentUnavailable(!data?.ok)
      } catch {
        setPaymentUnavailable(true)
      }
    }
    check()
  }, [])

  const status = searchParams.get("status")
  const sessionId = searchParams.get("session_id")
  const tier = useMemo(() => getTierInfo(tierValue), [tierValue])

  const fetchMembership = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/membership?userId=${encodeURIComponent(userId)}`, { cache: "no-store" })
      if (!res.ok) return
      const data = (await res.json()) as { status: "inactive" | "active" }
      setMembershipActive(data.status === "active")
    } catch {
      // ignore
    }
  }, [userId])

  useEffect(() => {
    fetchMembership()
  }, [fetchMembership])

  useEffect(() => {
    let timer: any
    if (status === "paid") {
      let attempts = 0
      timer = setInterval(async () => {
        attempts++
        await fetchMembership()
        if (attempts > 10) clearInterval(timer)
      }, 2000)
    }
    return () => timer && clearInterval(timer)
  }, [status, fetchMembership])

  async function handlePay(tier: Tier, userId: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: PRICES[tier], userId }),
    })
    const { url } = await res.json()
    // Try to leave any embedding frame
    try {
      if (window.self !== window.top) {
        // may throw if the iframe is sandboxed
        ;(window.top as Window).location.href = url
      } else {
        window.location.assign(url)
      }
    } catch {
      // fallback if top navigation is blocked by sandbox
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  async function startCheckout() {
    setError(null)
    setCreating(true)
    try {
      // Map TierValue to Tier for the PRICES object
      const tierMap: Record<TierValue, Tier> = {
        builder: "BUSINESS_BUILDER",
        advantage: "BUSINESS_ADVANTAGE",
        executive: "EXECUTIVE_ADVANTAGE",
        elite: "ALMAGHARABIA_ELITE",
      }
      await handlePay(tierMap[tierValue], userId)
    } catch (e: any) {
      setError(e?.message || "Something went wrong starting checkout.")
      setCreating(false)
    }
  }

  function changeTier() {
    try {
      const raw = localStorage.getItem("arc-onboarding-v1")
      const parsed = raw ? JSON.parse(raw) : {}
      const next = { ...(parsed || {}), step: 4 }
      localStorage.setItem("arc-onboarding-v1", JSON.stringify(next))
    } catch {
      // ignore
    }
    window.location.href = "/onboarding"
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:underline">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        <div className="text-right">
          <h1 className="text-2xl font-bold">Welcome to ARC Portal</h1>
          <p className="text-sm text-muted-foreground">Confirm your plan to activate your account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Confirm & Pay
          </CardTitle>
          <CardDescription>Review your selection and complete payment to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-lg font-semibold">{tier.name}</div>
              <div className="text-sm text-muted-foreground">
                {tier.priceLabel}
                {tier.billingNote ? <span className="ml-1">— {tier.billingNote}</span> : null}
              </div>
            </div>
            <Button variant="outline" onClick={changeTier}>
              Change tier
            </Button>
          </div>

          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {tier.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground">
            You’ll be charged immediately. Subscriptions renew on their billing cycle.
          </p>

          {paymentUnavailable && (
            <Alert variant="destructive">
              <AlertTitle>Payment unavailable</AlertTitle>
              <AlertDescription>
                Configuration is incomplete. Please contact support. Try again in a moment.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Payment error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={startCheckout} disabled={creating || paymentUnavailable}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting…
                </>
              ) : (
                "Pay & Activate Account"
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/onboarding">Back to Onboarding</Link>
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Testing: use 4242 4242 4242 4242, any future expiry, any CVC, any ZIP. Webhook events:
            checkout.session.completed, invoice.paid.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6">
        {membershipActive ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Payment confirmed</AlertTitle>
            <AlertDescription>
              Membership active{sessionId ? ` • Session ${sessionId}` : ""}. You can access your dashboard.
            </AlertDescription>
          </Alert>
        ) : status === "paid" ? (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Processing payment…</AlertTitle>
            <AlertDescription>Waiting for confirmation. This can take a few seconds after checkout.</AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-4">
          <Button asChild disabled={!membershipActive}>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
