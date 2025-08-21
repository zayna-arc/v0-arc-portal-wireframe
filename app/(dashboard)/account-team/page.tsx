"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Users,
  Shield,
  Bell,
  Globe,
  AlertTriangle,
  Save,
  X,
  UserPlus,
  Settings,
  Crown,
  Mail,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

export default function AccountTeamPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("organization")
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [sessions, setSessions] = useState<SecuritySession[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
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
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>Basic information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal Name *</Label>
                  <Input
                    id="legalName"
                    value={organization?.legalName || ""}
                    onChange={(e) => handleOrganizationUpdate("legalName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dba">DBA (Doing Business As)</Label>
                  <Input
                    id="dba"
                    value={organization?.dba || ""}
                    onChange={(e) => handleOrganizationUpdate("dba", e.target.value)}
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
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={organization?.website || ""}
                    onChange={(e) => handleOrganizationUpdate("website", e.target.value)}
                  />
                </div>
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
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Last Active</th>
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
                          <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{formatTimeAgo(member.lastActive)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
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
            </CardContent>
          </Card>

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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about important events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="space-y-4">
                <h4 className="font-medium">Delivery Channels</h4>
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
              </div>
            </CardContent>
          </Card>
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
