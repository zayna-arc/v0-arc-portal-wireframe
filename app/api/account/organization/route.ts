import { type NextRequest, NextResponse } from "next/server"
import { AccountStore } from "@/lib/account/store"

export async function GET() {
  try {
    const organization = AccountStore.getOrganization()
    return NextResponse.json(organization)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    const organization = AccountStore.updateOrganization(updates)
    return NextResponse.json(organization)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 })
  }
}

export async function POST() {
  // Simulate audit log entry creation
  try {
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create audit entry" }, { status: 500 })
  }
}
