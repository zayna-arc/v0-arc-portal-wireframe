"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Users,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Plus,
  MoreHorizontal,
  AlertTriangle,
  Save,
  X,
  UserPlus,
  Settings,
  Crown,
  Mail,
  Phone,
  Activity,
  Upload,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import type {
  Organization,
  TeamMember,
  SecuritySession,
  AuditLogEntry,
  Region,
  UserRole,
  Language,
} from "@/lib/account/types"

const regions: Region[] = ["Morocco", "Algeria", "Libya", "Tunisia", "Mauritania", "Turkey", "U.S"]
const roles: UserRole[] = ["Owner", "Admin", "Manager", "Member", "Viewer", "Billing", "Guest"]
const languages: Language[] = ["EN", "FR", "AR"]

export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("organization")
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [sessions, setSessions] = useState<SecuritySession[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "Member" as UserRole,
    regions: [] as Region[],
    language: "EN" as Language,
    requestId: "",
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgRes, teamRes, sessionsRes, auditRes] = await Promise.all([
          fetch("/api/account/organization"),
          fetch("/api/account/team"),
          fetch("/api/account/security/sessions"),
          fetch("/api/account/audit"),
        ])

        if (orgRes.ok) setOrganization(await orgRes.json())
        if (teamRes.ok) setTeamMembers(await teamRes.json())
        if (sessionsRes.ok) setSessions(await sessionsRes.json())
        if (auditRes.ok) setAuditLog(await auditRes.json())
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load account data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleOrganizationUpdate = (field: string, value: any) => {
    if (!organization) return

    setOrganization({ ...organization, [field]: value })
    setHasUnsavedChanges(true)
  }

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/account/organization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(organization),
      })

      if (response.ok) {
        await fetch("/api/account/organization", { method: "POST" })
        setHasUnsavedChanges(false)
        toast({
          title: "Success",
          description: "Changes saved successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    }
  }

  const handleInviteUser = async () => {
    try {
      const response = await fetch("/api/account/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inviteForm,
          notificationPrefs: {
            sourcing: { newQuote: true, statusChange: true },
            logistics: { inspectionBooked: true, docApproved: true },
            billing: { invoiceIssued: true, paymentFailed: true, paymentSucceeded: true },
            channels: ["email", "in-app"],
          },
          timezone: "Africa/Casablanca",
          isDefaultAssignee: { sourcing: false, logistics: false, compliance: false },
        }),
      })

      if (response.ok) {
        const updatedTeam = await response.json()
        setTeamMembers(updatedTeam)
        setShowInviteDialog(false)
        setInviteForm({
          name: "",
          email: "",
          role: "Member",
          regions: [],
          language: "EN",
          requestId: "",
        })
        toast({
          title: "Success",
          description: "Team member invited successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to invite team member",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const response = await fetch(`/api/account/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedMember = await response.json()
        setTeamMembers((prev) => prev.map((member) => (member.id === id ? updatedMember : member)))
        toast({
          title: "Success",
          description: "Team member updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      })
    }
  }

  const handleDeactivateUser = async (id: string) => {
    try {
      const response = await fetch(`/api/account/team/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTeamMembers((prev) => prev.map((member) => (member.id === id ? { ...member, status: "Inactive" } : member)))
        toast({
          title: "Success",
          description: "Team member deactivated",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate team member",
        variant: "destructive",
      })
    }
  }

  const handleSignOutAllSessions = async () => {
    try {
      const response = await fetch("/api/account/security/sessions", {
        method: "DELETE",
      })

      if (response.ok) {
        const updatedSessions = await response.json()
        setSessions(updatedSessions)
        toast({
          title: "Success",
          description: "Signed out of all other sessions",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out sessions",
        variant: "destructive",
      })
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "Owner":
        return "bg-purple-100 text-purple-800"
      case "Admin":
        return "bg-blue-100 text-blue-800"
      case "Manager":
        return "bg-green-100 text-green-800"
      case "Member":
        return "bg-gray-100 text-gray-800"
      case "Viewer":
        return "bg-yellow-100 text-yellow-800"
      case "Billing":
        return "bg-orange-100 text-orange-800"
      case "Guest":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Account & Team</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded w-24 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Account & Team</h2>
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved changes
            </Badge>
            <Button onClick={handleSaveChanges} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHasUnsavedChanges(false)
                window.location.reload()
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.filter((m) => m.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.filter((m) => m.status === "Pending").length} pending invites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Regions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization?.operatingRegions.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active markets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">Signed in devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLog.length > 0 ? formatTimeAgo(auditLog[0].timestamp) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Recent changes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="organization">
            <Building2 className="h-4 w-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-4">
          <div className="grid gap-6">
            {/* Company Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="legalName">Legal Name *</Label>
                    <Input
                      id="legalName"
                      value={organization?.legalName || ""}
                      onChange={(e) => handleOrganizationUpdate("legalName", e.target.value)}
                      className="truncate"
                      title={organization?.legalName}
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="dba">DBA (Doing Business As)</Label>
                    <Input
                      id="dba"
                      value={organization?.dba || ""}
                      onChange={(e) => handleOrganizationUpdate("dba", e.target.value)}
                      className="truncate"
                      title={organization?.dba}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entityType">Entity Type</Label>
                    <Select
                      value={organization?.entityType}
                      onValueChange={(value) => handleOrganizationUpdate("entityType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LLC">LLC</SelectItem>
                        <SelectItem value="Corporation">Corporation</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="countryOfRegistration">Country of Registration *</Label>
                    <Input
                      id="countryOfRegistration"
                      value={organization?.countryOfRegistration || ""}
                      onChange={(e) => handleOrganizationUpdate("countryOfRegistration", e.target.value)}
                      className="truncate"
                      title={organization?.countryOfRegistration}
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <Input
                      id="registrationNumber"
                      value={organization?.registrationNumber || ""}
                      onChange={(e) => handleOrganizationUpdate("registrationNumber", e.target.value)}
                      className="truncate"
                      title={organization?.registrationNumber}
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={organization?.website || ""}
                      onChange={(e) => handleOrganizationUpdate("website", e.target.value)}
                      className="truncate"
                      title={organization?.website}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hqAddress">Headquarters Address *</Label>
                  <Textarea
                    id="hqAddress"
                    value={organization?.hqAddress || ""}
                    onChange={(e) => handleOrganizationUpdate("hqAddress", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Operating Regions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {regions.map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox
                          id={region}
                          checked={organization?.operatingRegions.includes(region)}
                          onCheckedChange={(checked) => {
                            const current = organization?.operatingRegions || []
                            const updated = checked ? [...current, region] : current.filter((r) => r !== region)
                            handleOrganizationUpdate("operatingRegions", updated)
                          }}
                        />
                        <Label htmlFor={region} className="text-sm">
                          {region}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Branding */}
            <Card>
              <CardHeader>
                <CardTitle>Branding for Documents</CardTitle>
                <CardDescription>Logo and branding elements for generated documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload logo</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Stamp/Signature Image (Optional)</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload stamp</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 1MB</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="letterhead"
                    checked={organization?.letterheadEnabled}
                    onCheckedChange={(checked) => handleOrganizationUpdate("letterheadEnabled", checked)}
                  />
                  <Label htmlFor="letterhead">Enable letterhead on documents</Label>
                </div>
              </CardContent>
            </Card>

            {/* Trade Defaults */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Defaults</CardTitle>
                <CardDescription>Default settings for new sourcing and logistics requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={organization?.currency}
                      onValueChange={(value) => handleOrganizationUpdate("currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="MAD">MAD - Moroccan Dirham</SelectItem>
                        <SelectItem value="DZD">DZD - Algerian Dinar</SelectItem>
                        <SelectItem value="TND">TND - Tunisian Dinar</SelectItem>
                        <SelectItem value="TRY">TRY - Turkish Lira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Units</Label>
                    <Select
                      value={organization?.units}
                      onValueChange={(value) => handleOrganizationUpdate("units", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg/cm">kg/cm (Metric)</SelectItem>
                        <SelectItem value="lb/in">lb/in (Imperial)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredIncoterm">Preferred Incoterm</Label>
                    <Select
                      value={organization?.preferredIncoterm}
                      onValueChange={(value) => handleOrganizationUpdate("preferredIncoterm", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                        <SelectItem value="FCA">FCA - Free Carrier</SelectItem>
                        <SelectItem value="FOB">FOB - Free on Board</SelectItem>
                        <SelectItem value="CFR">CFR - Cost and Freight</SelectItem>
                        <SelectItem value="CIF">CIF - Cost, Insurance & Freight</SelectItem>
                        <SelectItem value="DAP">DAP - Delivered at Place</SelectItem>
                        <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select
                      value={organization?.paymentTerms}
                      onValueChange={(value) => handleOrganizationUpdate("paymentTerms", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="COD">COD - Cash on Delivery</SelectItem>
                        <SelectItem value="Prepaid">Prepaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultShipmentMode">Default Shipment Mode</Label>
                    <Select
                      value={organization?.defaultShipmentMode}
                      onValueChange={(value) => handleOrganizationUpdate("defaultShipmentMode", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sea">Sea Freight</SelectItem>
                        <SelectItem value="Air">Air Freight</SelectItem>
                        <SelectItem value="Road">Road Transport</SelectItem>
                        <SelectItem value="Rail">Rail Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Favorite Origin Ports</Label>
                    <div className="space-y-2">
                      {organization?.favoriteOriginPorts.map((port, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={port}
                            onChange={(e) => {
                              const updated = [...(organization?.favoriteOriginPorts || [])]
                              updated[index] = e.target.value
                              handleOrganizationUpdate("favoriteOriginPorts", updated)
                            }}
                            className="truncate"
                            title={port}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = organization?.favoriteOriginPorts.filter((_, i) => i !== index) || []
                              handleOrganizationUpdate("favoriteOriginPorts", updated)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = [...(organization?.favoriteOriginPorts || []), ""]
                          handleOrganizationUpdate("favoriteOriginPorts", updated)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Port
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Favorite Destination Ports</Label>
                    <div className="space-y-2">
                      {organization?.favoriteDestinationPorts.map((port, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={port}
                            onChange={(e) => {
                              const updated = [...(organization?.favoriteDestinationPorts || [])]
                              updated[index] = e.target.value
                              handleOrganizationUpdate("favoriteDestinationPorts", updated)
                            }}
                            className="truncate"
                            title={port}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = organization?.favoriteDestinationPorts.filter((_, i) => i !== index) || []
                              handleOrganizationUpdate("favoriteDestinationPorts", updated)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = [...(organization?.favoriteDestinationPorts || []), ""]
                          handleOrganizationUpdate("favoriteDestinationPorts", updated)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Port
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Profile</CardTitle>
                <CardDescription>Tax IDs, certifications, and authorized signers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxVatEin">Tax/VAT/EIN</Label>
                    <Input
                      id="taxVatEin"
                      value={organization?.taxVatEin || ""}
                      onChange={(e) => handleOrganizationUpdate("taxVatEin", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dunsEori">DUNS/EORI (Optional)</Label>
                    <Input
                      id="dunsEori"
                      value={organization?.dunsEori || ""}
                      onChange={(e) => handleOrganizationUpdate("dunsEori", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Importer/Exporter IDs</Label>
                  <div className="space-y-2">
                    {organization?.importerExporterIds.map((id, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={id}
                          onChange={(e) => {
                            const updated = [...(organization?.importerExporterIds || [])]
                            updated[index] = e.target.value
                            handleOrganizationUpdate("importerExporterIds", updated)
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = organization?.importerExporterIds.filter((_, i) => i !== index) || []
                            handleOrganizationUpdate("importerExporterIds", updated)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...(organization?.importerExporterIds || []), ""]
                        handleOrganizationUpdate("importerExporterIds", updated)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add ID
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Authorized Signers</Label>
                  <div className="space-y-2">
                    {organization?.authorizedSigners.map((signer, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={signer}
                          onChange={(e) => {
                            const updated = [...(organization?.authorizedSigners || [])]
                            updated[index] = e.target.value
                            handleOrganizationUpdate("authorizedSigners", updated)
                          }}
                          className="truncate"
                          title={signer}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = organization?.authorizedSigners.filter((_, i) => i !== index) || []
                            handleOrganizationUpdate("authorizedSigners", updated)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...(organization?.authorizedSigners || []), ""]
                        handleOrganizationUpdate("authorizedSigners", updated)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Signer
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>KYC Uploads</Label>
                  <div className="space-y-2">
                    {organization?.kycUploads.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" title={file}>
                            {file}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload W-9, Certificate of Insurance, Power of Attorney
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Primary Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Contacts</CardTitle>
                <CardDescription>Assign team members to key roles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["admin", "billing", "logistics", "compliance"].map((role) => (
                    <div key={role} className="space-y-2">
                      <Label htmlFor={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</Label>
                      <Select
                        value={organization?.primaryContacts[role as keyof typeof organization.primaryContacts] || ""}
                        onValueChange={(value) => {
                          const updated = { ...organization?.primaryContacts, [role]: value }
                          handleOrganizationUpdate("primaryContacts", updated)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers
                            .filter((m) => m.status === "Active")
                            .map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-2">
                                  <span className="truncate">{member.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {member.role}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Button onClick={() => router.push("/dashboard/invoices-payments")}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Billing & Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Team Members</h3>
              <p className="text-sm text-muted-foreground">Manage your team members and their permissions</p>
            </div>
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>Send an invitation to join your organization</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteName">Name</Label>
                    <Input
                      id="inviteName"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail">Email</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteRole">Role</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value: UserRole) => setInviteForm({ ...inviteForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles
                          .filter((role) => role !== "Owner")
                          .map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Regions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {regions.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={`invite-${region}`}
                            checked={inviteForm.regions.includes(region)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...inviteForm.regions, region]
                                : inviteForm.regions.filter((r) => r !== region)
                              setInviteForm({ ...inviteForm, regions: updated })
                            }}
                          />
                          <Label htmlFor={`invite-${region}`} className="text-sm">
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteLanguage">Language</Label>
                    <Select
                      value={inviteForm.language}
                      onValueChange={(value: Language) => setInviteForm({ ...inviteForm, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EN">English</SelectItem>
                        <SelectItem value="FR">Français</SelectItem>
                        <SelectItem value="AR">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {inviteForm.role === "Guest" && (
                    <div className="space-y-2">
                      <Label htmlFor="requestId">Request ID</Label>
                      <Input
                        id="requestId"
                        placeholder="SR-1023"
                        value={inviteForm.requestId}
                        onChange={(e) => setInviteForm({ ...inviteForm, requestId: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Guest users can only view and comment on the specified request
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteUser}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Member</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Regions</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Last Active</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium truncate flex items-center gap-1" title={member.name}>
                                {member.name}
                                {member.role === "Owner" && <Crown className="h-3 w-3 text-yellow-500" />}
                              </div>
                              <div className="text-sm text-muted-foreground truncate" title={member.email}>
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {member.regions.slice(0, 2).map((region) => (
                              <Badge key={region} variant="outline" className="text-xs">
                                {region}
                              </Badge>
                            ))}
                            {member.regions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.regions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{formatTimeAgo(member.lastActive)}</td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {member.status === "Pending" && (
                                <DropdownMenuItem onClick={() => {}}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Resend Invite
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => {}}>
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Permissions
                              </DropdownMenuItem>
                              {member.role !== "Owner" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleDeactivateUser(member.id)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setShowTransferDialog(true)}>
                                    <Crown className="h-4 w-4 mr-2" />
                                    Make Owner
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Role Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Understanding what each role can do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">Owner</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Full access, transfer ownership, billing, users</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Everything except ownership transfer</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Manager</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Create/approve quotes & requests, view invoices</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-100 text-gray-800">Member</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Create/manage assigned work; no billing</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Viewer</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Read-only access to all content</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-800">Billing</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Invoices, payment methods, customer portal only</p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-pink-100 text-pink-800">Guest</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      View/comment on a specific request/thread only (request-scoped)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-6">
            {/* Authentication */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>SSO Connections</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <div className="w-4 h-4 mr-2 bg-blue-500 rounded" />
                      Connect Google Workspace
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <div className="w-4 h-4 mr-2 bg-blue-600 rounded" />
                      Connect Microsoft 365
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your signed-in devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium flex items-center gap-2">
                          <span className="truncate" title={session.device}>
                            {session.device}
                          </span>
                          {session.current && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.location} • {formatTimeAgo(session.lastActive)}
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={handleSignOutAllSessions}>
                  Sign Out All Other Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Download activity and audit logs</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {auditLog.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{entry.action}</div>
                          <div className="text-muted-foreground">{entry.details}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {entry.user} • {formatTimeAgo(entry.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Transfer Ownership</Label>
                    <p className="text-sm text-muted-foreground">Transfer ownership to another team member</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-200 bg-transparent">
                    Transfer
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Deactivate Organization</Label>
                    <p className="text-sm text-muted-foreground">Contact support to deactivate your account</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-200 bg-transparent">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="grid gap-6">
            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about important events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sourcing Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium">Sourcing</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New Quote Received</Label>
                        <p className="text-sm text-muted-foreground">When suppliers submit quotes for your requests</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Status Changes</Label>
                        <p className="text-sm text-muted-foreground">When request status is updated</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Logistics Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium">Logistics & Compliance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Inspection Booked</Label>
                        <p className="text-sm text-muted-foreground">When inspections are scheduled</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Document Approved/Rejected</Label>
                        <p className="text-sm text-muted-foreground">When compliance documents are reviewed</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Billing Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium">Billing</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Invoice Issued</Label>
                        <p className="text-sm text-muted-foreground">When new invoices are created</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Payment Failed</Label>
                        <p className="text-sm text-muted-foreground">When payment attempts fail</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Payment Succeeded</Label>
                        <p className="text-sm text-muted-foreground">When payments are processed successfully</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Channels</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4" />
                    <div>
                      <Label>In-App</Label>
                      <p className="text-sm text-muted-foreground">Show notifications in the portal</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4" />
                      <div>
                        <Label>WhatsApp</Label>
                        <p className="text-sm text-muted-foreground">Receive urgent notifications via WhatsApp</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <Input placeholder="+212-600-123456" className="ml-7" />
                </div>
              </CardContent>
            </Card>

            {/* Localization */}
            <Card>
              <CardHeader>
                <CardTitle>Localization</CardTitle>
                <CardDescription>Customize language and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="EN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EN">English</SelectItem>
                        <SelectItem value="FR">Français</SelectItem>
                        <SelectItem value="AR">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="Africa/Casablanca">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Casablanca">Africa/Casablanca</SelectItem>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/Istanbul">Europe/Istanbul</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="DD/MM/YYYY">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberFormat">Number Format</Label>
                    <Select defaultValue="1,234.56">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1,234.56">1,234.56</SelectItem>
                        <SelectItem value="1.234,56">1.234,56</SelectItem>
                        <SelectItem value="1 234,56">1 234,56</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Audit Footer */}
      {organization?.updatedBy && organization?.updatedAt && (
        <div className="text-xs text-muted-foreground text-center py-4 border-t">
          Updated by {organization.updatedBy} • {formatTimeAgo(organization.updatedAt)}
        </div>
      )}
    </div>
  )
}
