import type {
  SettingsState,
  UserSettings,
  NotificationSettings,
  SecuritySettings,
  OrganizationSettings,
  IntegrationSettings,
  DataSettings,
  LegalSettings,
  ExportRequest,
  ApiKey,
  WebhookConfig,
} from "./types"

// Mock data for development
const mockUserSettings: UserSettings = {
  id: "user-1",
  name: "Ahmed Al-Rashid",
  email: "ahmed@almagharabia.com",
  avatar: "/images/avatar.jpg",
  title: "Procurement Manager",
  department: "Supply Chain",
  phone: "+966 50 123 4567",
  timezone: "Asia/Riyadh",
  language: "en",
  dateFormat: "DD/MM/YYYY",
  currency: "SAR",
}

const mockNotificationSettings: NotificationSettings = {
  email: {
    quotes: true,
    shipments: true,
    invoices: true,
    system: true,
    marketing: false,
  },
  push: {
    quotes: true,
    shipments: true,
    invoices: false,
    system: true,
  },
  sms: {
    urgent: true,
    shipments: false,
  },
}

const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  backupCodes: [],
  trustedDevices: [
    {
      id: "device-1",
      name: "MacBook Pro",
      type: "Desktop",
      lastUsed: "2024-01-15T10:30:00Z",
      location: "Riyadh, SA",
    },
    {
      id: "device-2",
      name: "iPhone 15",
      type: "Mobile",
      lastUsed: "2024-01-15T08:15:00Z",
      location: "Riyadh, SA",
    },
  ],
  sessions: [
    {
      id: "session-1",
      device: "MacBook Pro - Chrome",
      location: "Riyadh, SA",
      ip: "192.168.1.100",
      lastActive: "2024-01-15T10:30:00Z",
      current: true,
    },
    {
      id: "session-2",
      device: "iPhone 15 - Safari",
      location: "Riyadh, SA",
      ip: "192.168.1.101",
      lastActive: "2024-01-15T08:15:00Z",
      current: false,
    },
  ],
  loginAlerts: true,
  passwordLastChanged: "2024-01-01T00:00:00Z",
}

const mockOrganizationSettings: OrganizationSettings = {
  id: "org-1",
  name: "Al Magharabia Trading Co.",
  logo: "/images/almagharabia-brand.jpg",
  website: "https://almagharabia.com",
  industry: "Import/Export",
  size: "50-200",
  address: {
    street: "King Fahd Road, Al Olaya District",
    city: "Riyadh",
    state: "Riyadh Province",
    country: "Saudi Arabia",
    postalCode: "12213",
  },
  contact: {
    phone: "+966 11 123 4567",
    email: "info@almagharabia.com",
  },
  branding: {
    primaryColor: "#1a365d",
    secondaryColor: "#2d3748",
    letterhead: "/images/letterhead.pdf",
  },
  defaults: {
    currency: "SAR",
    paymentTerms: "Net 30",
    incoterms: "FOB",
    approvalWorkflow: true,
    requirePONumbers: true,
  },
}

const mockIntegrationSettings: IntegrationSettings = {
  stripe: {
    connected: true,
    accountId: "acct_1234567890",
    lastSync: "2024-01-15T10:00:00Z",
  },
  whatsapp: {
    connected: false,
    phoneNumber: undefined,
    verified: false,
  },
  webhooks: [
    {
      id: "webhook-1",
      name: "Order Updates",
      url: "https://api.almagharabia.com/webhooks/orders",
      events: ["order.created", "order.updated", "order.completed"],
      active: true,
      secret: "whsec_1234567890abcdef",
      lastDelivery: "2024-01-15T09:30:00Z",
      failures: 0,
    },
  ],
  apiKeys: [
    {
      id: "key-1",
      name: "Production API",
      key: "ak_live_1234567890abcdef",
      permissions: ["read", "write"],
      lastUsed: "2024-01-15T10:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      expiresAt: "2024-12-31T23:59:59Z",
    },
  ],
}

const mockDataSettings: DataSettings = {
  retention: {
    messages: 365,
    documents: 2555, // 7 years
    analytics: 1095, // 3 years
  },
  exports: [
    {
      id: "export-1",
      type: "full",
      status: "completed",
      requestedAt: "2024-01-10T00:00:00Z",
      completedAt: "2024-01-10T02:30:00Z",
      downloadUrl: "https://exports.almagharabia.com/export-1.zip",
      expiresAt: "2024-01-17T02:30:00Z",
    },
  ],
  gdprCompliant: true,
  dataProcessingConsent: true,
}

const mockLegalSettings: LegalSettings = {
  termsAccepted: true,
  termsAcceptedAt: "2024-01-01T00:00:00Z",
  privacyPolicyAccepted: true,
  privacyPolicyAcceptedAt: "2024-01-01T00:00:00Z",
  marketingConsent: false,
  marketingConsentAt: undefined,
  cookiePreferences: {
    necessary: true,
    analytics: true,
    marketing: false,
    functional: true,
  },
}

class SettingsStore {
  private state: SettingsState = {
    user: mockUserSettings,
    notifications: mockNotificationSettings,
    security: mockSecuritySettings,
    organization: mockOrganizationSettings,
    integrations: mockIntegrationSettings,
    data: mockDataSettings,
    legal: mockLegalSettings,
    loading: false,
    saving: false,
  }

  getState(): SettingsState {
    return { ...this.state }
  }

  async updateUserSettings(updates: Partial<UserSettings>): Promise<void> {
    this.state.saving = true

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    this.state.user = { ...this.state.user, ...updates }
    this.state.saving = false
  }

  async updateNotificationSettings(updates: Partial<NotificationSettings>): Promise<void> {
    this.state.saving = true

    await new Promise((resolve) => setTimeout(resolve, 500))

    this.state.notifications = {
      ...this.state.notifications,
      ...updates,
      email: { ...this.state.notifications.email, ...updates.email },
      push: { ...this.state.notifications.push, ...updates.push },
      sms: { ...this.state.notifications.sms, ...updates.sms },
    }
    this.state.saving = false
  }

  async updateSecuritySettings(updates: Partial<SecuritySettings>): Promise<void> {
    this.state.saving = true

    await new Promise((resolve) => setTimeout(resolve, 800))

    this.state.security = { ...this.state.security, ...updates }
    this.state.saving = false
  }

  async updateOrganizationSettings(updates: Partial<OrganizationSettings>): Promise<void> {
    this.state.saving = true

    await new Promise((resolve) => setTimeout(resolve, 1200))

    this.state.organization = { ...this.state.organization, ...updates }
    this.state.saving = false
  }

  async enable2FA(): Promise<{ qrCode: string; backupCodes: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const backupCodes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 8).toUpperCase())

    this.state.security.twoFactorEnabled = true
    this.state.security.backupCodes = backupCodes

    return {
      qrCode:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      backupCodes,
    }
  }

  async disable2FA(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    this.state.security.twoFactorEnabled = false
    this.state.security.backupCodes = []
  }

  async revokeSession(sessionId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    this.state.security.sessions = this.state.security.sessions.filter((session) => session.id !== sessionId)
  }

  async createApiKey(name: string, permissions: string[]): Promise<ApiKey> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name,
      key: `ak_live_${Math.random().toString(36).substring(2, 20)}`,
      permissions,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }

    this.state.integrations.apiKeys.push(newKey)
    return newKey
  }

  async revokeApiKey(keyId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    this.state.integrations.apiKeys = this.state.integrations.apiKeys.filter((key) => key.id !== keyId)
  }

  async createWebhook(config: Omit<WebhookConfig, "id" | "secret" | "failures">): Promise<WebhookConfig> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newWebhook: WebhookConfig = {
      ...config,
      id: `webhook-${Date.now()}`,
      secret: `whsec_${Math.random().toString(36).substring(2, 20)}`,
      failures: 0,
    }

    this.state.integrations.webhooks.push(newWebhook)
    return newWebhook
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    this.state.integrations.webhooks = this.state.integrations.webhooks.filter((webhook) => webhook.id !== webhookId)
  }

  async requestDataExport(type: ExportRequest["type"]): Promise<ExportRequest> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const exportRequest: ExportRequest = {
      id: `export-${Date.now()}`,
      type,
      status: "pending",
      requestedAt: new Date().toISOString(),
    }

    this.state.data.exports.unshift(exportRequest)

    // Simulate processing
    setTimeout(() => {
      const request = this.state.data.exports.find((e) => e.id === exportRequest.id)
      if (request) {
        request.status = "processing"
      }
    }, 2000)

    setTimeout(() => {
      const request = this.state.data.exports.find((e) => e.id === exportRequest.id)
      if (request) {
        request.status = "completed"
        request.completedAt = new Date().toISOString()
        request.downloadUrl = `https://exports.almagharabia.com/${request.id}.zip`
        request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    }, 5000)

    return exportRequest
  }

  async updateLegalSettings(updates: Partial<LegalSettings>): Promise<void> {
    this.state.saving = true

    await new Promise((resolve) => setTimeout(resolve, 300))

    this.state.legal = { ...this.state.legal, ...updates }
    this.state.saving = false
  }

  async deleteAccount(): Promise<void> {
    this.state.saving = true

    // Simulate account deletion process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would redirect to a confirmation page
    console.log("Account deletion initiated")
    this.state.saving = false
  }
}

export const settingsStore = new SettingsStore()
