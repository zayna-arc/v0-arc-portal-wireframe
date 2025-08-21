import type { ResourceItem, SavedResource, ResourceFilters } from "./types"

// Seed data for Day 1 launch
export const seedResources: ResourceItem[] = [
  // Pinned by ARC
  {
    id: "commercial-invoice",
    title: "Commercial Invoice Template",
    description: "Multi-language commercial invoice template with all required fields for Maghreb trade",
    type: "template",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR", "AR"],
    tags: ["invoice", "documentation", "customs"],
    access: "all",
    format: "DOCX",
    fileSize: "45 KB",
    updatedAt: "2024-01-15T10:00:00Z",
    isPinned: true,
  },
  {
    id: "packing-list",
    title: "Packing List Template",
    description: "Standardized packing list format for international shipments",
    type: "template",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "Libya", "U.S."],
    languages: ["EN", "FR"],
    tags: ["packing", "shipping", "documentation"],
    access: "all",
    format: "XLSX",
    fileSize: "32 KB",
    updatedAt: "2024-01-12T14:30:00Z",
    isPinned: true,
  },
  {
    id: "incoterms-cheat-sheet",
    title: "Incoterms 2020 Cheat Sheet",
    description: "Quick reference guide for all Incoterms with responsibilities breakdown",
    type: "guide",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "Libya", "Turkey", "U.S."],
    languages: ["EN", "FR"],
    tags: ["incoterms", "shipping", "responsibilities"],
    access: "all",
    format: "PDF",
    fileSize: "1.2 MB",
    updatedAt: "2024-01-10T09:15:00Z",
    isPinned: true,
  },
  {
    id: "sanctions-rps-guide",
    title: "Sanctions & RPS Quick Guide",
    description: "Step-by-step guide for restricted party screening and sanctions compliance",
    type: "guide",
    regions: ["U.S."],
    languages: ["EN"],
    tags: ["sanctions", "compliance", "screening"],
    access: "builder+",
    format: "PDF",
    fileSize: "890 KB",
    updatedAt: "2024-01-08T16:45:00Z",
    isPinned: true,
  },
  {
    id: "hs-code-checklist",
    title: "HS Code & Licensing Checklist",
    description: "Comprehensive checklist for proper HS classification and licensing requirements",
    type: "regulatory",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR"],
    tags: ["hs-code", "licensing", "classification"],
    access: "all",
    format: "PDF",
    fileSize: "650 KB",
    updatedAt: "2024-01-05T11:20:00Z",
    isPinned: true,
  },
  {
    id: "freight-rfq-template",
    title: "Freight RFQ Template",
    description: "Request for quotation template for freight forwarders and carriers",
    type: "template",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "Libya", "Turkey", "U.S."],
    languages: ["EN", "FR"],
    tags: ["freight", "rfq", "logistics"],
    access: "all",
    format: "DOCX",
    fileSize: "38 KB",
    updatedAt: "2024-01-03T13:10:00Z",
    isPinned: true,
  },

  // Templates
  {
    id: "bill-of-lading-guide",
    title: "Bill of Lading/AWB Data Guide",
    description: "Complete guide for filling out bills of lading and airway bills correctly",
    type: "template",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR"],
    tags: ["bill-of-lading", "awb", "shipping"],
    access: "all",
    format: "PDF",
    fileSize: "1.1 MB",
    updatedAt: "2024-01-02T08:30:00Z",
  },
  {
    id: "certificate-origin",
    title: "Certificate of Origin (Sample & Guide)",
    description: "Sample certificate of origin with completion guide for various trade agreements",
    type: "template",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR", "AR"],
    tags: ["certificate", "origin", "trade-agreement"],
    access: "builder+",
    format: "PDF",
    fileSize: "780 KB",
    updatedAt: "2023-12-28T15:45:00Z",
  },
  {
    id: "vendor-due-diligence",
    title: "Vendor Due Diligence Form",
    description: "Comprehensive vendor vetting form for international suppliers",
    type: "template",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "Libya", "Turkey"],
    languages: ["EN", "FR"],
    tags: ["vendor", "due-diligence", "vetting"],
    access: "advantage+",
    format: "DOCX",
    fileSize: "52 KB",
    updatedAt: "2023-12-25T10:15:00Z",
    isPremium: true,
  },
  {
    id: "importer-kyc-checklist",
    title: "Importer/KYC Pack Checklist",
    description: "Complete KYC documentation checklist for US-Maghreb trade lanes",
    type: "template",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR"],
    tags: ["kyc", "importer", "documentation"],
    access: "builder+",
    format: "PDF",
    fileSize: "420 KB",
    updatedAt: "2023-12-20T14:20:00Z",
  },

  // Guides
  {
    id: "hs-classification-primer",
    title: "HS Classification Primer",
    description: "Practical examples and methodology for proper HS code classification",
    type: "guide",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "Libya", "Turkey", "U.S."],
    languages: ["EN", "FR"],
    tags: ["hs-code", "classification", "examples"],
    access: "all",
    format: "PDF",
    fileSize: "2.1 MB",
    updatedAt: "2023-12-18T09:30:00Z",
  },
  {
    id: "licensing-touchpoints",
    title: "Licensing & Agency Touchpoints",
    description: "Overview of licensing requirements and agency contacts by trade lane",
    type: "guide",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR"],
    tags: ["licensing", "agencies", "requirements"],
    access: "builder+",
    format: "PDF",
    fileSize: "1.5 MB",
    updatedAt: "2023-12-15T16:00:00Z",
  },
  {
    id: "landed-cost-explainer",
    title: "Landed Cost Components Explainer",
    description: "Detailed breakdown of all components that make up landed cost calculations",
    type: "guide",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "Libya", "Turkey", "U.S."],
    languages: ["EN", "FR"],
    tags: ["landed-cost", "duties", "fees"],
    access: "advantage+",
    format: "PDF",
    fileSize: "980 KB",
    updatedAt: "2023-12-12T11:45:00Z",
    isPremium: true,
  },

  // Regulatory
  {
    id: "customs-portals",
    title: "Customs/Tariff Portals Directory",
    description: "Direct links to official customs and tariff portals for all covered regions",
    type: "regulatory",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "Libya", "U.S."],
    languages: ["EN", "FR", "AR"],
    tags: ["customs", "tariff", "portals"],
    access: "all",
    format: "LINK",
    updatedAt: "2024-01-01T12:00:00Z",
  },
  {
    id: "cbp-bis-guidance",
    title: "U.S. CBP + BIS Export Guidance",
    description: "Official U.S. Customs and Border Protection and Bureau of Industry guidance",
    type: "regulatory",
    regions: ["U.S."],
    languages: ["EN"],
    tags: ["cbp", "bis", "export", "guidance"],
    access: "all",
    format: "LINK",
    updatedAt: "2023-12-30T08:00:00Z",
  },
  {
    id: "port-schedules",
    title: "Major Port Authority Schedules",
    description: "Current schedules and contact information for major Maghreb and U.S. gateway ports",
    type: "regulatory",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR"],
    tags: ["ports", "schedules", "contacts"],
    access: "builder+",
    format: "LINK",
    updatedAt: "2024-01-14T07:30:00Z",
  },

  // Tools
  {
    id: "hs-lookup-tool",
    title: "HS Code & Licensing Lookup",
    description: "Interactive tool for HS code classification and licensing requirement lookup",
    type: "tool",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR"],
    tags: ["hs-code", "lookup", "interactive"],
    access: "builder+",
    format: "TOOL",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "landed-cost-calculator",
    title: "Landed Cost Mini-Estimator",
    description: "Quick calculator for indicative duties, fees, and total landed costs",
    type: "tool",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR"],
    tags: ["landed-cost", "calculator", "duties"],
    access: "advantage+",
    format: "TOOL",
    updatedAt: "2024-01-08T14:15:00Z",
    isPremium: true,
  },
  {
    id: "rps-quick-screen",
    title: "Sanctions/RPS Quick Screen",
    description: "Quick screening tool for restricted party and sanctions list checking",
    type: "tool",
    regions: ["U.S."],
    languages: ["EN"],
    tags: ["sanctions", "rps", "screening"],
    access: "executive+",
    format: "TOOL",
    updatedAt: "2024-01-05T16:30:00Z",
    isPremium: true,
  },
  {
    id: "volumetric-calculator",
    title: "Volumetric/Chargeable Weight Calculator",
    description: "Calculate volumetric weight and determine chargeable weight for shipping",
    type: "tool",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "Libya", "Turkey", "U.S."],
    languages: ["EN", "FR"],
    tags: ["volumetric", "weight", "shipping"],
    access: "all",
    format: "TOOL",
    updatedAt: "2024-01-03T09:45:00Z",
  },

  // Market Briefs
  {
    id: "machinery-sector-brief",
    title: "Machinery Sector Snapshot",
    description: "Import requirements, lead times, and common pitfalls for machinery trade",
    type: "market_brief",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S."],
    languages: ["EN", "FR"],
    tags: ["machinery", "sector", "requirements"],
    access: "advantage+",
    format: "PDF",
    fileSize: "1.8 MB",
    updatedAt: "2023-12-20T13:00:00Z",
    isPremium: true,
  },
  {
    id: "agri-commodities-brief",
    title: "Agricultural Commodities Brief",
    description: "Trade requirements and market insights for agricultural commodity imports",
    type: "market_brief",
    regions: ["Morocco", "Algeria", "Tunisia", "Mauritania", "U.S."],
    languages: ["EN", "FR"],
    tags: ["agriculture", "commodities", "market"],
    access: "executive+",
    format: "PDF",
    fileSize: "2.2 MB",
    updatedAt: "2023-12-15T10:30:00Z",
    isPremium: true,
  },
  {
    id: "auto-parts-brief",
    title: "Auto Parts Market Brief",
    description: "Comprehensive guide to automotive parts import requirements and market dynamics",
    type: "market_brief",
    regions: ["Morocco", "Algeria", "Tunisia", "Turkey", "U.S."],
    languages: ["EN", "FR"],
    tags: ["automotive", "parts", "market"],
    access: "advantage+",
    format: "PDF",
    fileSize: "1.6 MB",
    updatedAt: "2023-12-10T15:20:00Z",
    isPremium: true,
  },
]

// Simple store for managing resources state
class ResourcesStore {
  private savedResources: SavedResource[] = []
  private lastViewed: Record<string, string> = {}

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage()
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem("arc-saved-resources")
      if (saved) {
        this.savedResources = JSON.parse(saved)
      }

      const viewed = localStorage.getItem("arc-last-viewed-resources")
      if (viewed) {
        this.lastViewed = JSON.parse(viewed)
      }
    } catch (error) {
      console.error("Failed to load resources from storage:", error)
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem("arc-saved-resources", JSON.stringify(this.savedResources))
      localStorage.setItem("arc-last-viewed-resources", JSON.stringify(this.lastViewed))
    } catch (error) {
      console.error("Failed to save resources to storage:", error)
    }
  }

  getAllResources(): ResourceItem[] {
    return seedResources
  }

  getPinnedResources(): ResourceItem[] {
    return seedResources.filter((resource) => resource.isPinned)
  }

  getResourcesByType(type: string): ResourceItem[] {
    if (type === "all") return seedResources
    return seedResources.filter((resource) => resource.type === type)
  }

  getSavedResources(): ResourceItem[] {
    const savedIds = this.savedResources.map((sr) => sr.resourceId)
    return seedResources.filter((resource) => savedIds.includes(resource.id))
  }

  isSaved(resourceId: string): boolean {
    return this.savedResources.some((sr) => sr.resourceId === resourceId)
  }

  saveResource(resourceId: string) {
    if (!this.isSaved(resourceId)) {
      this.savedResources.push({
        resourceId,
        savedAt: new Date().toISOString(),
      })
      this.saveToStorage()
    }
  }

  unsaveResource(resourceId: string) {
    this.savedResources = this.savedResources.filter((sr) => sr.resourceId !== resourceId)
    this.saveToStorage()
  }

  markAsViewed(resourceId: string) {
    this.lastViewed[resourceId] = new Date().toISOString()
    this.saveToStorage()
  }

  getLastViewed(resourceId: string): string | undefined {
    return this.lastViewed[resourceId]
  }

  filterResources(resources: ResourceItem[], filters: ResourceFilters): ResourceItem[] {
    return resources.filter((resource) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchLower))

        if (!matchesSearch) return false
      }

      // Topic filter
      if (filters.topic !== "all" && resource.type !== filters.topic) {
        return false
      }

      // Region filter
      if (filters.region !== "all" && !resource.regions.includes(filters.region)) {
        return false
      }

      // Type filter
      if (filters.type !== "all" && resource.format !== filters.type) {
        return false
      }

      // Language filter
      if (filters.language !== "all" && !resource.languages.includes(filters.language)) {
        return false
      }

      // Access filter
      if (filters.access === "saved" && !this.isSaved(resource.id)) {
        return false
      }

      return true
    })
  }

  getSavedCount(): number {
    return this.savedResources.length
  }
}

export const resourcesStore = new ResourcesStore()
