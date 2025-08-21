export type ResourceType = "template" | "guide" | "regulatory" | "tool" | "market_brief"
export type Language = "EN" | "FR" | "AR"
export type Region = "Morocco" | "Algeria" | "Tunisia" | "Mauritania" | "Libya" | "Turkey" | "U.S."
export type FileFormat = "PDF" | "DOCX" | "XLSX" | "LINK" | "TOOL"
export type AccessLevel = "all" | "builder+" | "advantage+" | "executive+"

export interface ResourceItem {
  id: string
  title: string
  description: string
  type: ResourceType
  regions: Region[]
  languages: Language[]
  tags: string[]
  access: AccessLevel
  format: FileFormat
  url?: string
  fileSize?: string
  updatedAt: string
  isPinned?: boolean
  isPremium?: boolean
}

export interface ResourceFilters {
  search: string
  topic: ResourceType | "all"
  region: Region | "all"
  type: FileFormat | "all"
  language: Language | "all"
  access: "all" | "saved"
}

export interface SavedResource {
  resourceId: string
  savedAt: string
  lastViewed?: string
}

export interface ResourceRequest {
  title: string
  need: string
  deadline: string
}
