import { type NextRequest, NextResponse } from "next/server"
import { AccountStore } from "@/lib/account/store"

export async function GET() {
  try {
    const teamMembers = AccountStore.getTeamMembers()
    return NextResponse.json(teamMembers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const memberData = await request.json()
    const updatedTeam = AccountStore.addTeamMember(memberData)
    return NextResponse.json(updatedTeam)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add team member" }, { status: 500 })
  }
}
