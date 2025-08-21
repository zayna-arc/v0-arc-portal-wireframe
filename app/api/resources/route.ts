import { type NextRequest, NextResponse } from "next/server"
import { resourcesStore } from "@/lib/resources/store"
import type { ResourceFilters } from "@/lib/resources/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: ResourceFilters = {
      search: searchParams.get("search") || "",
      topic: (searchParams.get("topic") as any) || "all",
      region: (searchParams.get("region") as any) || "all",
      type: (searchParams.get("type") as any) || "all",
      language: (searchParams.get("language") as any) || "all",
      access: (searchParams.get("access") as any) || "all",
    }

    let resources = resourcesStore.getAllResources()

    // Apply filters
    resources = resourcesStore.filterResources(resources, filters)

    // Sort by updated date (newest first)
    resources.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return NextResponse.json({
      resources,
      total: resources.length,
      filters,
    })
  } catch (error) {
    console.error("Failed to fetch resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}
