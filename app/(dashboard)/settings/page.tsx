"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Bell,
  Shield,
  Building,
  Plug,
  Database,
  FileText,
  Camera,
  Key,
  Smartphone,
  Globe,
  CreditCard,
  MessageSquare,
  Webhook,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Save,
  Upload,
} from "lucide-react"
import { settingsStore } from "@/lib/settings/store"
import type { SettingsState, ExportRequest } from "@/lib/settings/types"

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SettingsState | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set())

  // Form states
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [newApiKeyName, setNewApiKeyName] = useState("")
  const [newApiKeyPermissions, setNewApiKeyPermissions] = useState<string[]>([])
  const [newWebhookUrl, setNewWebhookUrl] = useState("")
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([])
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null)

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const state = settingsStore.getState()
        setSettings(state)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [toast])

  const markFieldDirty = (field: string) => {
    setDirtyFields((prev) => new Set([...prev, field]))
  }

  const clearDirtyFields = () => {
    setDirtyFields(new Set())
  }

  const updateUserField = (field: string, value: any) => {
    if (!settings) return

    setSettings((prev) => ({
      ...prev!,
      user: { ...prev!.user, [field]: value },
    }))
    markFieldDirty(`user.${field}`)
  }

  const updateNotificationField = (category: string, field: string, value: boolean) => {
    if (!settings) return

    setSettings((prev) => ({
      ...prev!,
      notifications: {
        ...prev!.notifications,
        [category]: { ...prev!.notifications[category as keyof typeof prev.notifications], [field]: value },
      },
    }))
    markFieldDirty(`notifications.${category}.${field}`)
  }

  const updateOrganizationField = (field: string, value: any) => {
    if (!settings) return

    setSettings((prev) => ({
      ...prev!,
      organization: { ...prev!.organization, [field]: value },
    }))
    markFieldDirty(`organization.${field}`)
  }

  const saveSettings = async () => {
    if (!settings || dirtyFields.size === 0) return

    setSaving(true)
    try {
      // Save user settings if dirty
      if (Array.from(dirtyFields).some((field) => field.startsWith("user."))) {
        await settingsStore.updateUserSettings(settings.user)
      }

      // Save notification settings if dirty
      if (Array.from(dirtyFields).some((field) => field.startsWith("notifications."))) {
        await settingsStore.updateNotificationSettings(settings.notifications)
      }

      // Save organization settings if dirty
      if (Array.from(dirtyFields).some((field) => field.startsWith("organization."))) {
        await settingsStore.updateOrganizationSettings(settings.organization)
      }

      clearDirtyFields()
      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const enable2FA = async () => {
    if (!settings) return

    try {
      const { qrCode, backupCodes } = await settingsStore.enable2FA()
      setSettings((prev) => ({
        ...prev!,
        security: { ...prev!.security, twoFactorEnabled: true, backupCodes },
      }))

      toast({
        title: "Success",
        description: "2FA has been enabled. Save your backup codes!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable 2FA",
        variant: "destructive",
      })
    }
  }

  const disable2FA = async () => {
    if (!settings) return

    try {
      await settingsStore.disable2FA()
      setSettings((prev) => ({
        ...prev!,
        security: { ...prev!.security, twoFactorEnabled: false, backupCodes: [] },
      }))

      toast({
        title: "Success",
        description: "2FA has been disabled",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable 2FA",
        variant: "destructive",
      })
    }
  }

  const createApiKey = async () => {
    if (!newApiKeyName || newApiKeyPermissions.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a name and select permissions",
        variant: "destructive",
      })
      return
    }

    try {
      const apiKey = await settingsStore.createApiKey(newApiKeyName, newApiKeyPermissions)
      setSettings((prev) => ({
        ...prev!,
        integrations: {
          ...prev!.integrations,
          apiKeys: [...prev!.integrations.apiKeys, apiKey],
        },
      }))

      setNewApiKeyName("")
      setNewApiKeyPermissions([])

      toast({
        title: "Success",
        description: "API key created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      await settingsStore.revokeApiKey(keyId)
      setSettings((prev) => ({
        ...prev!,
        integrations: {
          ...prev!.integrations,
          apiKeys: prev!.integrations.apiKeys.filter((key) => key.id !== keyId),
        },
      }))

      toast({
        title: "Success",
        description: "API key revoked successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      })
    }
  }

  const testWebhook = async (webhookId: string, url: string) => {
    setTestingWebhook(webhookId)

    try {
      const response = await fetch("/api/settings/webhooks/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Webhook test successful",
        })
      } else {
        toast({
          title: "Warning",
          description: `Webhook test failed: ${result.response}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test webhook",
        variant: "destructive",
      })
    } finally {
      setTestingWebhook(null)
    }
  }

  const requestDataExport = async (type: ExportRequest["type"]) => {
    try {
      const exportRequest = await settingsStore.requestDataExport(type)
      setSettings((prev) => ({
        ...prev!,
        data: {
          ...prev!.data,
          exports: [exportRequest, ...prev!.data.exports],
        },
      }))

      toast({
        title: "Success",
        description: "Data export requested. You will be notified when ready.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request data export",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    })
  }

  if (loading || !settings) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  // Mock user role for demo - in real app this would come from auth
  const userRole = "admin" // or 'member'

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account and organization preferences</p>
        </div>
        {dirtyFields.size > 0 && (
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          {userRole === "admin" && (
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Organization
            </TabsTrigger>
          )}
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data & Privacy
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Legal
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {settings.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.user.name}
                    onChange={(e) => updateUserField("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.user.email}
                    onChange={(e) => updateUserField("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={settings.user.title || ""}
                    onChange={(e) => updateUserField("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={settings.user.department || ""}
                    onChange={(e) => updateUserField("department", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.user.phone || ""}
                    onChange={(e) => updateUserField("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.user.timezone} onValueChange={(value) => updateUserField("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.user.language} onValueChange={(value) => updateUserField("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Preferred Currency</Label>
                  <Select value={settings.user.currency} onValueChange={(value) => updateUserField("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what email notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Quote Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified when quotes are received or updated</p>
                </div>
                <Switch
                  checked={settings.notifications.email.quotes}
                  onCheckedChange={(checked) => updateNotificationField("email", "quotes", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Shipment Updates</Label>
                  <p className="text-sm text-muted-foreground">Track your shipments and logistics updates</p>
                </div>
                <Switch
                  checked={settings.notifications.email.shipments}
                  onCheckedChange={(checked) => updateNotificationField("email", "shipments", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Invoice & Payment</Label>
                  <p className="text-sm text-muted-foreground">Payment confirmations and invoice updates</p>
                </div>
                <Switch
                  checked={settings.notifications.email.invoices}
                  onCheckedChange={(checked) => updateNotificationField("email", "invoices", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">Important system announcements and updates</p>
                </div>
                <Switch
                  checked={settings.notifications.email.system}
                  onCheckedChange={(checked) => updateNotificationField("email", "system", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing</Label>
                  <p className="text-sm text-muted-foreground">Product updates and promotional content</p>
                </div>
                <Switch
                  checked={settings.notifications.email.marketing}
                  onCheckedChange={(checked) => updateNotificationField("email", "marketing", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Manage browser and mobile push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Quote Updates</Label>
                  <p className="text-sm text-muted-foreground">Instant notifications for new quotes</p>
                </div>
                <Switch
                  checked={settings.notifications.push.quotes}
                  onCheckedChange={(checked) => updateNotificationField("push", "quotes", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Shipment Updates</Label>
                  <p className="text-sm text-muted-foreground">Real-time shipment status changes</p>
                </div>
                <Switch
                  checked={settings.notifications.push.shipments}
                  onCheckedChange={(checked) => updateNotificationField("push", "shipments", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical system notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.push.system}
                  onCheckedChange={(checked) => updateNotificationField("push", "system", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>2FA Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.security.twoFactorEnabled ? "default" : "secondary"}>
                    {settings.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  {settings.security.twoFactorEnabled ? (
                    <Button variant="outline" size="sm" onClick={disable2FA}>
                      Disable 2FA
                    </Button>
                  ) : (
                    <Button size="sm" onClick={enable2FA}>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Enable 2FA
                    </Button>
                  )}
                </div>
              </div>

              {settings.security.backupCodes.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-sm font-medium">Backup Codes</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Save these codes in a safe place. You can use them to access your account if you lose your device.
                  </p>
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {settings.security.backupCodes.map((code, index) => (
                      <div key={index} className="flex items-center justify-between bg-background p-2 rounded">
                        <span>{code}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code)} className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.security.sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.location} • {session.ip}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last active: {new Date(session.lastActive).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current && <Badge variant="default">Current</Badge>}
                      {!session.current && (
                        <Button variant="outline" size="sm" onClick={() => settingsStore.revokeSession(session.id)}>
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab - Admin Only */}
        {userRole === "admin" && (
          <TabsContent value="organization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>Manage your organization information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      value={settings.organization.name}
                      onChange={(e) => updateOrganizationField("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-website">Website</Label>
                    <Input
                      id="org-website"
                      value={settings.organization.website || ""}
                      onChange={(e) => updateOrganizationField("website", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-industry">Industry</Label>
                    <Select
                      value={settings.organization.industry}
                      onValueChange={(value) => updateOrganizationField("industry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Import/Export">Import/Export</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-size">Company Size</Label>
                    <Select
                      value={settings.organization.size}
                      onValueChange={(value) => updateOrganizationField("size", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Branding</Label>
                  <p className="text-sm text-muted-foreground mb-4">Customize your organization's appearance</p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 rounded-lg">
                          <AvatarImage src={settings.organization.logo || "/placeholder.svg"} />
                          <AvatarFallback className="rounded-lg">
                            {settings.organization.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Letterhead</Label>
                      <div className="flex items-center gap-4">
                        <div className="p-4 border rounded-lg">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Letterhead
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Trade Defaults</Label>
                  <p className="text-sm text-muted-foreground mb-4">Set default values for new trade requests</p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Default Currency</Label>
                      <Select
                        value={settings.organization.defaults.currency}
                        onValueChange={(value) =>
                          updateOrganizationField("defaults", {
                            ...settings.organization.defaults,
                            currency: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Terms</Label>
                      <Select
                        value={settings.organization.defaults.paymentTerms}
                        onValueChange={(value) =>
                          updateOrganizationField("defaults", {
                            ...settings.organization.defaults,
                            paymentTerms: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Net 30">Net 30</SelectItem>
                          <SelectItem value="Net 60">Net 60</SelectItem>
                          <SelectItem value="Net 90">Net 90</SelectItem>
                          <SelectItem value="COD">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Approval Workflow</Label>
                        <p className="text-sm text-muted-foreground">Require approval for new requests</p>
                      </div>
                      <Switch
                        checked={settings.organization.defaults.approvalWorkflow}
                        onCheckedChange={(checked) =>
                          updateOrganizationField("defaults", {
                            ...settings.organization.defaults,
                            approvalWorkflow: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require PO Numbers</Label>
                        <p className="text-sm text-muted-foreground">Mandate purchase order numbers</p>
                      </div>
                      <Switch
                        checked={settings.organization.defaults.requirePONumbers}
                        onCheckedChange={(checked) =>
                          updateOrganizationField("defaults", {
                            ...settings.organization.defaults,
                            requirePONumbers: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Integration</CardTitle>
              <CardDescription>Manage your Stripe payment integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.integrations.stripe.connected ? "Connected" : "Not connected"}
                    </p>
                    {settings.integrations.stripe.lastSync && (
                      <p className="text-xs text-muted-foreground">
                        Last sync: {new Date(settings.integrations.stripe.lastSync).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.integrations.stripe.connected ? "default" : "secondary"}>
                    {settings.integrations.stripe.connected ? "Connected" : "Disconnected"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {settings.integrations.stripe.connected ? "Manage" : "Connect"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Business</CardTitle>
              <CardDescription>Connect WhatsApp for customer communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp Business</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.integrations.whatsapp.connected ? "Connected" : "Not connected"}
                    </p>
                    {settings.integrations.whatsapp.phoneNumber && (
                      <p className="text-xs text-muted-foreground">
                        Phone: {settings.integrations.whatsapp.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.integrations.whatsapp.connected ? "default" : "secondary"}>
                    {settings.integrations.whatsapp.connected ? "Connected" : "Disconnected"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {settings.integrations.whatsapp.connected ? "Manage" : "Connect"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Create New API Key</Label>
                  <p className="text-sm text-muted-foreground">Generate a new API key for external access</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Key className="mr-2 h-4 w-4" />
                      Create Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create API Key</DialogTitle>
                      <DialogDescription>Create a new API key with specific permissions</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key-name">Name</Label>
                        <Input
                          id="api-key-name"
                          placeholder="e.g., Production API"
                          value={newApiKeyName}
                          onChange={(e) => setNewApiKeyName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="space-y-2">
                          {["read", "write", "admin"].map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={permission}
                                checked={newApiKeyPermissions.includes(permission)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewApiKeyPermissions([...newApiKeyPermissions, permission])
                                  } else {
                                    setNewApiKeyPermissions(newApiKeyPermissions.filter((p) => p !== permission))
                                  }
                                }}
                              />
                              <Label htmlFor={permission} className="capitalize">
                                {permission}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewApiKeyName("")
                          setNewApiKeyPermissions([])
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={createApiKey}>Create Key</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {settings.integrations.apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{apiKey.name}</p>
                        <div className="flex gap-1">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono">{showApiKey[apiKey.id] ? apiKey.key : "••••••••••••••••••••"}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowApiKey((prev) => ({
                              ...prev,
                              [apiKey.id]: !prev[apiKey.id],
                            }))
                          }
                          className="h-6 w-6 p-0"
                        >
                          {showApiKey[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                        {apiKey.lastUsed && ` • Last used: ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently revoke the API key "{apiKey.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => revokeApiKey(apiKey.id)}>Revoke Key</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Configure webhooks for real-time event notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Add Webhook</Label>
                  <p className="text-sm text-muted-foreground">Receive real-time notifications for events</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Webhook className="mr-2 h-4 w-4" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Webhook</DialogTitle>
                      <DialogDescription>Configure a webhook endpoint to receive event notifications</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="webhook-url">Endpoint URL</Label>
                        <Input
                          id="webhook-url"
                          placeholder="https://api.example.com/webhooks"
                          value={newWebhookUrl}
                          onChange={(e) => setNewWebhookUrl(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Events</Label>
                        <div className="space-y-2">
                          {["order.created", "order.updated", "payment.succeeded", "shipment.updated"].map((event) => (
                            <div key={event} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={event}
                                checked={newWebhookEvents.includes(event)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewWebhookEvents([...newWebhookEvents, event])
                                  } else {
                                    setNewWebhookEvents(newWebhookEvents.filter((e) => e !== event))
                                  }
                                }}
                              />
                              <Label htmlFor={event} className="font-mono text-sm">
                                {event}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewWebhookUrl("")
                          setNewWebhookEvents([])
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Create webhook logic would go here
                          setNewWebhookUrl("")
                          setNewWebhookEvents([])
                        }}
                      >
                        Add Webhook
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {settings.integrations.webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{webhook.name}</p>
                        <Badge variant={webhook.active ? "default" : "secondary"}>
                          {webhook.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testWebhook(webhook.id, webhook.url)}
                          disabled={testingWebhook === webhook.id}
                        >
                          {testingWebhook === webhook.id ? (
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ExternalLink className="mr-2 h-4 w-4" />
                          )}
                          Test
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the webhook "{webhook.name}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => settingsStore.deleteWebhook(webhook.id)}>
                                Delete Webhook
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{webhook.url}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs font-mono">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {webhook.lastDelivery && (
                        <span>Last delivery: {new Date(webhook.lastDelivery).toLocaleString()}</span>
                      )}
                      <span className={webhook.failures > 0 ? "text-red-600" : "text-green-600"}>
                        {webhook.failures} failures
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
              <CardDescription>Configure how long your data is stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Messages</Label>
                  <Select
                    value={settings.data.retention.messages.toString()}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev!,
                        data: {
                          ...prev!.data,
                          retention: { ...prev!.data.retention, messages: Number.parseInt(value) },
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="1095">3 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Documents</Label>
                  <Select
                    value={settings.data.retention.documents.toString()}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev!,
                        data: {
                          ...prev!.data,
                          retention: { ...prev!.data.retention, documents: Number.parseInt(value) },
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="1095">3 years</SelectItem>
                      <SelectItem value="2555">7 years</SelectItem>
                      <SelectItem value="3650">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Analytics</Label>
                  <Select
                    value={settings.data.retention.analytics.toString()}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev!,
                        data: {
                          ...prev!.data,
                          retention: { ...prev!.data.retention, analytics: Number.parseInt(value) },
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="1095">3 years</SelectItem>
                      <SelectItem value="1825">5 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Download your data in portable formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={() => requestDataExport("full")}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="h-4 w-4" />
                    <span className="font-medium">Full Export</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Download all your data including messages, documents, and settings
                  </p>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => requestDataExport("messages")}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">Messages Only</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Export your conversation history and messages
                  </p>
                </Button>
              </div>

              {settings.data.exports.length > 0 && (
                <div className="space-y-3">
                  <Label>Recent Exports</Label>
                  {settings.data.exports.map((exportRequest) => (
                    <div key={exportRequest.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{exportRequest.type} Export</p>
                        <p className="text-sm text-muted-foreground">
                          Requested: {new Date(exportRequest.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            exportRequest.status === "completed"
                              ? "default"
                              : exportRequest.status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {exportRequest.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {exportRequest.status === "processing" && <Clock className="mr-1 h-3 w-3" />}
                          {exportRequest.status === "failed" && <AlertTriangle className="mr-1 h-3 w-3" />}
                          {exportRequest.status}
                        </Badge>
                        {exportRequest.status === "completed" && exportRequest.downloadUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={exportRequest.downloadUrl} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Controls</CardTitle>
              <CardDescription>Manage your privacy and data processing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>GDPR Compliance</Label>
                  <p className="text-sm text-muted-foreground">Enable GDPR-compliant data processing</p>
                </div>
                <Switch
                  checked={settings.data.gdprCompliant}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev!,
                      data: { ...prev!.data, gdprCompliant: checked },
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Processing Consent</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow processing of personal data for service delivery
                  </p>
                </div>
                <Switch
                  checked={settings.data.dataProcessingConsent}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev!,
                      data: { ...prev!.data, dataProcessingConsent: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions that will permanently affect your account</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all associated data. This action cannot be undone.
                      All your messages, documents, and settings will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => settingsStore.deleteAccount()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Tab */}
        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Terms & Agreements</CardTitle>
              <CardDescription>Review and manage your legal agreements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Terms of Service</p>
                  <p className="text-sm text-muted-foreground">
                    {settings.legal.termsAccepted ? "Accepted" : "Not accepted"}
                    {settings.legal.termsAcceptedAt && (
                      <span> on {new Date(settings.legal.termsAcceptedAt).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.legal.termsAccepted ? "default" : "secondary"}>
                    {settings.legal.termsAccepted ? "Accepted" : "Pending"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Privacy Policy</p>
                  <p className="text-sm text-muted-foreground">
                    {settings.legal.privacyPolicyAccepted ? "Accepted" : "Not accepted"}
                    {settings.legal.privacyPolicyAcceptedAt && (
                      <span> on {new Date(settings.legal.privacyPolicyAcceptedAt).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.legal.privacyPolicyAccepted ? "default" : "secondary"}>
                    {settings.legal.privacyPolicyAccepted ? "Accepted" : "Pending"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketing Preferences</CardTitle>
              <CardDescription>Control how we communicate with you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                </div>
                <Switch
                  checked={settings.legal.marketingConsent}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev!,
                      legal: { ...prev!.legal, marketingConsent: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Preferences</CardTitle>
              <CardDescription>Manage your cookie and tracking preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Necessary Cookies</Label>
                  <p className="text-sm text-muted-foreground">Required for basic site functionality</p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics Cookies</Label>
                  <p className="text-sm text-muted-foreground">Help us understand how you use our service</p>
                </div>
                <Switch
                  checked={settings.legal.cookiePreferences.analytics}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev!,
                      legal: {
                        ...prev!.legal,
                        cookiePreferences: { ...prev!.legal.cookiePreferences, analytics: checked },
                      },
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Cookies</Label>
                  <p className="text-sm text-muted-foreground">Used to show you relevant advertisements</p>
                </div>
                <Switch
                  checked={settings.legal.cookiePreferences.marketing}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev!,
                      legal: {
                        ...prev!.legal,
                        cookiePreferences: { ...prev!.legal.cookiePreferences, marketing: checked },
                      },
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Functional Cookies</Label>
                  <p className="text-sm text-muted-foreground">Enable enhanced features and personalization</p>
                </div>
                <Switch
                  checked={settings.legal.cookiePreferences.functional}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev!,
                      legal: {
                        ...prev!.legal,
                        cookiePreferences: { ...prev!.legal.cookiePreferences, functional: checked },
                      },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
