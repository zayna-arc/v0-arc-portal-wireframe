import { NextResponse } from "next/server"
import { AccountStore } from "@/lib/account/store"

export async function GET() {
  try {
    const sessions = AccountStore.getSessions()
    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const updatedSessions = AccountStore.signOutAllSessions()
    return NextResponse.json(updatedSessions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign out sessions" }, { status: 500 })
  }
}
