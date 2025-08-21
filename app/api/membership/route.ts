import { NextResponse } from "next/server"
import { getUserMembership } from "@/lib/membership"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }
  const rec = await getUserMembership(userId)
  return NextResponse.json(rec)
}
