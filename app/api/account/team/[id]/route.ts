import { type NextRequest, NextResponse } from "next/server"
import { AccountStore } from "@/lib/account/store"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const updatedMember = AccountStore.updateTeamMember(params.id, updates)

    if (!updatedMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(updatedMember)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedTeam = AccountStore.removeTeamMember(params.id)
    return NextResponse.json(updatedTeam)
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove team member" }, { status: 500 })
  }
}
