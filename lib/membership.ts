// lib/membership.ts
export type MembershipStatus = "inactive" | "active"

export type MembershipRecord = {
  status: MembershipStatus
  subscriptionId?: string
  activatedAt?: number
}

// In-memory store (stub). Replace with DB later.
const store = new Map<string, MembershipRecord>()

export async function getUserMembership(userId: string): Promise<MembershipRecord> {
  const rec = store.get(userId)
  if (!rec) {
    const fresh: MembershipRecord = { status: "inactive" }
    store.set(userId, fresh)
    return fresh
  }
  return rec
}

export async function activateUserMembership(
  userId: string,
  { subscriptionId }: { subscriptionId?: string } = {},
): Promise<void> {
  const existing = store.get(userId) || { status: "inactive" as MembershipStatus }
  store.set(userId, {
    ...existing,
    status: "active",
    subscriptionId: subscriptionId ?? existing.subscriptionId,
    activatedAt: Date.now(),
  })
}
