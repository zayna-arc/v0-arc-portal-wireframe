export type Region = "Morocco" | "Algeria" | "Libya" | "Tunisia" | "Mauritania" | "Turkey" | "U.S"
export type UserRole = "Owner" | "Admin" | "Manager" | "Member" | "Viewer" | "Billing" | "Guest"
export type Language = "EN" | "FR" | "AR"

export interface Organization {
  id: string
  legalName: string
  dba?: string
  entityType: "LLC" | "Corporation" | "Partnership" | "Sole Proprietorship" | "Other"
  countryOfRegistration: string
  registrationNumber: string
  website?: string
  hqAddress: string
  operatingRegions: Region[]

  // Branding
  logoUrl?: string
  stampUrl?: string
  letterheadEnabled: boolean

  // Trade Defaults
  currency: string
  units: "kg/cm" | "lb/in"
  preferredIncoterm: string
  paymentTerms: string
  defaultShipmentMode: string
  favoriteOriginPorts: string[]
  favoriteDestinationPorts: string[]

  // Compliance
  taxVatEin?: string
  dunsEori?: string
  importerExporterIds: string[]
  authorizedSigners: string[]
  kycUploads: string[]

  // Primary Contacts
  primaryContacts: {
    admin?: string
    billing?: string
    logistics?: string
    compliance?: string
  }

  // Metadata
  createdAt: string
  updatedAt: string
  updatedBy: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: UserRole
  regions: Region[]
  language: Language
  status: "Active" | "Pending" | "Inactive"
  lastActive: string
  timezone: string

  // Permissions
  isDefaultAssignee: {
    sourcing: boolean
    logistics: boolean
    compliance: boolean
  }

  // Notification Preferences
  notificationPrefs: {
    sourcing: {
      newQuote: boolean
      statusChange: boolean
    }
    logistics: {
      inspectionBooked: boolean
      docApproved: boolean
    }
    billing: {
      invoiceIssued: boolean
      paymentFailed: boolean
      paymentSucceeded: boolean
    }
    channels: ("email" | "in-app" | "whatsapp")[]
  }

  // Guest-specific
  requestId?: string // For guest users

  createdAt: string
  invitedBy?: string
}

export interface SecuritySession {
  id: string
  device: string
  location: string
  ipAddress: string
  userAgent: string
  current: boolean
  lastActive: string
  createdAt: string
}

export interface AuditLogEntry {
  id: string
  action: string
  details: string
  user: string
  timestamp: string
  ipAddress: string
  category: "organization" | "team" | "security" | "billing"
}
