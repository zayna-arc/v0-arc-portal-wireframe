export interface UserSettings {
  id: string
  name: string
  email: string
  avatar?: string
  title?: string
  department?: string
  phone?: string
  timezone: string
  language: string
  dateFormat: string
  currency: string
}

export interface NotificationSettings {
  email: {
    quotes: boolean
    shipments: boolean
    invoices: boolean
    system: boolean
    marketing: boolean
  }
  push: {
    quotes: boolean
    shipments: boolean
    invoices: boolean
    system: boolean
  }
  sms: {
    urgent: boolean
    shipments: boolean
  }
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  backupCodes: string[]
  trustedDevices: TrustedDevice[]
  sessions: UserSession[]
  loginAlerts: boolean
  passwordLastChanged: string
}

export interface TrustedDevice {
  id: string
  name: string
  type: string
  lastUsed: string
  location: string
}

export interface UserSession {
  id: string
  device: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

export interface OrganizationSettings {
  id: string
  name: string
  logo?: string
  website?: string
  industry: string
  size: string
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  contact: {
    phone: string
    email: string
  }
  branding: {
    primaryColor: string
    secondaryColor: string
    letterhead?: string
  }
  defaults: {
    currency: string
    paymentTerms: string
    incoterms: string
    approvalWorkflow: boolean
    requirePONumbers: boolean
  }
}

export interface IntegrationSettings {
  stripe: {
    connected: boolean
    accountId?: string
    lastSync?: string
  }
  whatsapp: {
    connected: boolean
    phoneNumber?: string
    verified: boolean
  }
  webhooks: WebhookConfig[]
  apiKeys: ApiKey[]
}

export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
  secret: string
  lastDelivery?: string
  failures: number
}

export interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed?: string
  createdAt: string
  expiresAt?: string
}

export interface DataSettings {
  retention: {
    messages: number // days
    documents: number // days
    analytics: number // days
  }
  exports: ExportRequest[]
  gdprCompliant: boolean
  dataProcessingConsent: boolean
}

export interface ExportRequest {
  id: string
  type: "full" | "messages" | "documents" | "analytics"
  status: "pending" | "processing" | "completed" | "failed"
  requestedAt: string
  completedAt?: string
  downloadUrl?: string
  expiresAt?: string
}

export interface LegalSettings {
  termsAccepted: boolean
  termsAcceptedAt?: string
  privacyPolicyAccepted: boolean
  privacyPolicyAcceptedAt?: string
  marketingConsent: boolean
  marketingConsentAt?: string
  cookiePreferences: {
    necessary: boolean
    analytics: boolean
    marketing: boolean
    functional: boolean
  }
}

export interface SettingsState {
  user: UserSettings
  notifications: NotificationSettings
  security: SecuritySettings
  organization: OrganizationSettings
  integrations: IntegrationSettings
  data: DataSettings
  legal: LegalSettings
  loading: boolean
  saving: boolean
  error?: string
}

export type SettingsSection =
  | "profile"
  | "notifications"
  | "security"
  | "organization"
  | "integrations"
  | "data"
  | "legal"
