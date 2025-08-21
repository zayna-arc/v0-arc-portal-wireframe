import { NextResponse } from "next/server"
import { AccountStore } from "@/lib/account/store"

export async function GET() {
  try {
    const auditLog = AccountStore.getAuditLog()
    return NextResponse.json(auditLog)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit log" }, { status: 500 })
  }
}
