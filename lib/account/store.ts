import type { Organization, TeamMember, SecuritySession, AuditLogEntry } from "./types"

// Mock data for Al Maghrabia Trading Company
const mockOrganization: Organization = {
  id: "org_almaghrabia_001",
  legalName: "Al Maghrabia Trading Company LLC",
  dba: "Al Maghrabia Trading",
  entityType: "LLC",
  countryOfRegistration: "Morocco",
  registrationNumber: "RC-123456-2020",
  website: "https://almaghrabia-trading.com",
  hqAddress: "123 Hassan II Boulevard\nCasablanca 20000\nMorocco",
  operatingRegions: ["Morocco", "Algeria", "Tunisia", "U.S"],

  // Branding
  logoUrl: "/images/almagharabia-brand.jpg",
  letterheadEnabled: true,

  // Trade Defaults
  currency: "USD",
  units: "kg/cm",
  preferredIncoterm: "CIF",
  paymentTerms: "Net 30",
  defaultShipmentMode: "Sea",
  favoriteOriginPorts: ["Port of Casablanca", "Port of Tangier", "Port of Agadir"],
  favoriteDestinationPorts: ["Port of New York", "Port of Los Angeles", "Port of Miami"],

  // Compliance
  taxVatEin: "MA-123456789",
  dunsEori: "DUNS-987654321",
  importerExporterIds: ["IMP-MA-001", "EXP-US-002"],
  authorizedSigners: ["Ahmed Ben Ali - CEO", "Fatima El Mansouri - CFO"],
  kycUploads: ["certificate-of-incorporation.pdf", "tax-certificate.pdf", "power-of-attorney.pdf"],

  // Primary Contacts
  primaryContacts: {
    admin: "user_001",
    billing: "user_002",
    logistics: "user_003",
    compliance: "user_001",
  },

  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-12-08T14:30:00Z",
  updatedBy: "Ahmed Ben Ali",
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "user_001",
    name: "Ahmed Ben Ali",
    email: "ahmed@almaghrabia-trading.com",
    role: "Owner",
    regions: ["Morocco", "Algeria", "Tunisia", "U.S"],
    language: "EN",
    status: "Active",
    lastActive: "2024-12-08T16:45:00Z",
    timezone: "Africa/Casablanca",
    isDefaultAssignee: {
      sourcing: true,
      logistics: false,
      compliance: true,
    },
    notificationPrefs: {
      sourcing: { newQuote: true, statusChange: true },
      logistics: { inspectionBooked: true, docApproved: true },
      billing: { invoiceIssued: true, paymentFailed: true, paymentSucceeded: false },
      channels: ["email", "in-app"],
    },
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "user_002",
    name: "Fatima El Mansouri",
    email: "fatima@almaghrabia-trading.com",
    role: "Admin",
    regions: ["Morocco", "U.S"],
    language: "FR",
    status: "Active",
    lastActive: "2024-12-08T15:20:00Z",
    timezone: "Africa/Casablanca",
    isDefaultAssignee: {
      sourcing: false,
      logistics: false,
      compliance: false,
    },
    notificationPrefs: {
      sourcing: { newQuote: true, statusChange: false },
      logistics: { inspectionBooked: false, docApproved: true },
      billing: { invoiceIssued: true, paymentFailed: true, paymentSucceeded: true },
      channels: ["email", "in-app", "whatsapp"],
    },
    createdAt: "2024-01-20T09:15:00Z",
    invitedBy: "user_001",
  },
  {
    id: "user_003",
    name: "Youssef Alami",
    email: "youssef@almaghrabia-trading.com",
    role: "Manager",
    regions: ["Morocco", "Algeria"],
    language: "AR",
    status: "Active",
    lastActive: "2024-12-08T12:10:00Z",
    timezone: "Africa/Casablanca",
    isDefaultAssignee: {
      sourcing: false,
      logistics: true,
      compliance: false,
    },
    notificationPrefs: {
      sourcing: { newQuote: false, statusChange: true },
      logistics: { inspectionBooked: true, docApproved: true },
      billing: { invoiceIssued: false, paymentFailed: false, paymentSucceeded: false },
      channels: ["email", "in-app"],
    },
    createdAt: "2024-02-01T11:30:00Z",
    invitedBy: "user_001",
  },
  {
    id: "user_004",
    name: "Sarah Johnson",
    email: "sarah@americanbuyer.com",
    role: "Member",
    regions: ["U.S"],
    language: "EN",
    status: "Active",
    lastActive: "2024-12-07T18:45:00Z",
    timezone: "America/New_York",
    isDefaultAssignee: {
      sourcing: true,
      logistics: false,
      compliance: false,
    },
    notificationPrefs: {
      sourcing: { newQuote: true, statusChange: true },
      logistics: { inspectionBooked: true, docApproved: false },
      billing: { invoiceIssued: false, paymentFailed: false, paymentSucceeded: false },
      channels: ["email", "in-app"],
    },
    createdAt: "2024-03-15T14:20:00Z",
    invitedBy: "user_002",
  },
  {
    id: "user_005",
    name: "Omar Benali",
    email: "omar@supplier-dz.com",
    role: "Guest",
    regions: ["Algeria"],
    language: "FR",
    status: "Pending",
    lastActive: "2024-12-05T09:30:00Z",
    timezone: "Africa/Algiers",
    requestId: "SR-1023",
    isDefaultAssignee: {
      sourcing: false,
      logistics: false,
      compliance: false,
    },
    notificationPrefs: {
      sourcing: { newQuote: true, statusChange: true },
      logistics: { inspectionBooked: false, docApproved: false },
      billing: { invoiceIssued: false, paymentFailed: false, paymentSucceeded: false },
      channels: ["email"],
    },
    createdAt: "2024-12-05T08:00:00Z",
    invitedBy: "user_003",
  },
]

const mockSessions: SecuritySession[] = [
  {
    id: "session_001",
    device: "MacBook Pro - Chrome",
    location: "Casablanca, Morocco",
    ipAddress: "196.200.123.45",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    current: true,
    lastActive: "2024-12-08T16:45:00Z",
    createdAt: "2024-12-08T08:00:00Z",
  },
  {
    id: "session_002",
    device: "iPhone 15 - Safari",
    location: "Casablanca, Morocco",
    ipAddress: "196.200.123.46",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    current: false,
    lastActive: "2024-12-08T14:20:00Z",
    createdAt: "2024-12-07T19:30:00Z",
  },
  {
    id: "session_003",
    device: "Windows PC - Edge",
    location: "Rabat, Morocco",
    ipAddress: "196.200.124.12",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    current: false,
    lastActive: "2024-12-06T16:15:00Z",
    createdAt: "2024-12-06T09:00:00Z",
  },
]

const mockAuditLog: AuditLogEntry[] = [
  {
    id: "audit_001",
    action: "Updated organization profile",
    details: "Changed preferred Incoterm from FOB to CIF",
    user: "Ahmed Ben Ali",
    timestamp: "2024-12-08T14:30:00Z",
    ipAddress: "196.200.123.45",
    category: "organization",
  },
  {
    id: "audit_002",
    action: "Invited team member",
    details: "Sent invitation to omar@supplier-dz.com as Guest for request SR-1023",
    user: "Youssef Alami",
    timestamp: "2024-12-05T08:00:00Z",
    ipAddress: "196.200.123.47",
    category: "team",
  },
  {
    id: "audit_003",
    action: "Updated team member role",
    details: "Changed Sarah Johnson from Viewer to Member",
    user: "Fatima El Mansouri",
    timestamp: "2024-12-03T11:15:00Z",
    ipAddress: "196.200.123.45",
    category: "team",
  },
  {
    id: "audit_004",
    action: "Enabled 2FA",
    details: "Two-factor authentication enabled for account",
    user: "Ahmed Ben Ali",
    timestamp: "2024-12-01T09:45:00Z",
    ipAddress: "196.200.123.45",
    category: "security",
  },
  {
    id: "audit_005",
    action: "Updated billing contact",
    details: "Set Fatima El Mansouri as primary billing contact",
    user: "Ahmed Ben Ali",
    timestamp: "2024-11-28T16:20:00Z",
    ipAddress: "196.200.123.45",
    category: "organization",
  },
]

export class AccountStore {
  static getOrganization(): Organization {
    return mockOrganization
  }

  static getTeamMembers(): TeamMember[] {
    return mockTeamMembers
  }

  static getSessions(): SecuritySession[] {
    return mockSessions
  }

  static getAuditLog(): AuditLogEntry[] {
    return mockAuditLog
  }

  static updateOrganization(updates: Partial<Organization>): Organization {
    Object.assign(mockOrganization, updates, {
      updatedAt: new Date().toISOString(),
      updatedBy: "Ahmed Ben Ali",
    })
    return mockOrganization
  }

  static addTeamMember(member: Omit<TeamMember, "id" | "createdAt">): TeamMember[] {
    const newMember: TeamMember = {
      ...member,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    mockTeamMembers.push(newMember)
    return mockTeamMembers
  }

  static updateTeamMember(id: string, updates: Partial<TeamMember>): TeamMember | null {
    const index = mockTeamMembers.findIndex((m) => m.id === id)
    if (index === -1) return null

    Object.assign(mockTeamMembers[index], updates)
    return mockTeamMembers[index]
  }

  static removeTeamMember(id: string): TeamMember[] {
    const index = mockTeamMembers.findIndex((m) => m.id === id)
    if (index !== -1) {
      mockTeamMembers[index].status = "Inactive"
    }
    return mockTeamMembers
  }

  static signOutAllSessions(): SecuritySession[] {
    mockSessions.forEach((session) => {
      if (!session.current) {
        session.lastActive = new Date().toISOString()
      }
    })
    return mockSessions.filter((s) => s.current)
  }
}
