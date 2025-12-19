"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
} from "lucide-react"
import Link from "next/link"

interface SourcingRequest {
  id: string
  title: string
  category: string
  status: "draft" | "active" | "quoted" | "negotiating" | "closed" | "cancelled"
  priority: "low" | "medium" | "high"
  targetPrice: string
  quantity: string
  location: string
  deadline: string
  createdAt: string
  supplier?: string
  lastActivity: string
  description: string
}

const mockRequests: SourcingRequest[] = [
  {
    id: "SR-1023",
    title: "Organic Argan Oil - 1000L",
    category: "Cosmetics & Beauty",
    status: "quoted",
    priority: "high",
    targetPrice: "$28,000",
    quantity: "1000L",
    location: "Morocco",
    deadline: "2024-02-15",
    createdAt: "2024-01-15",
    supplier: "Atlas Argan Co.",
    lastActivity: "2 hours ago",
    description: "Premium organic certified argan oil for cosmetic manufacturing",
  },
  {
    id: "SR-1024",
    title: "Handwoven Berber Carpets - 50 pieces",
    category: "Textiles & Crafts",
    status: "active",
    priority: "medium",
    targetPrice: "$15,000",
    quantity: "50 pieces",
    location: "Morocco",
    deadline: "2024-03-01",
    createdAt: "2024-01-18",
    lastActivity: "1 day ago",
    description: "Traditional handwoven Berber carpets, various sizes and patterns",
  },
  {
    id: "SR-1025",
    title: "Dates - Premium Medjool - 2 tons",
    category: "Food & Agriculture",
    status: "negotiating",
    priority: "high",
    targetPrice: "$12,000",
    quantity: "2 tons",
    location: "Tunisia",
    deadline: "2024-02-28",
    createdAt: "2024-01-20",
    supplier: "Sahara Dates Ltd.",
    lastActivity: "4 hours ago",
    description: "Premium grade Medjool dates for retail distribution",
  },
  {
    id: "SR-1026",
    title: "Olive Oil - Extra Virgin - 500L",
    category: "Food & Agriculture",
    status: "draft",
    priority: "low",
    targetPrice: "$8,500",
    quantity: "500L",
    location: "Tunisia",
    deadline: "2024-04-15",
    createdAt: "2024-01-22",
    lastActivity: "3 days ago",
    description: "Cold-pressed extra virgin olive oil from organic farms",
  },
  {
    id: "SR-1027",
    title: "Phosphate Rock - 100 tons",
    category: "Mining & Minerals",
    status: "closed",
    priority: "medium",
    targetPrice: "$45,000",
    quantity: "100 tons",
    location: "Morocco",
    deadline: "2024-01-30",
    createdAt: "2024-01-10",
    supplier: "Morocco Phosphates Inc.",
    lastActivity: "1 week ago",
    description: "High-grade phosphate rock for fertilizer production",
  },
  {
    id: "SR-1028",
    title: "Leather Goods - Handbags - 200 pieces",
    category: "Leather & Fashion",
    status: "cancelled",
    priority: "low",
    targetPrice: "$18,000",
    quantity: "200 pieces",
    location: "Morocco",
    deadline: "2024-02-10",
    createdAt: "2024-01-12",
    lastActivity: "2 weeks ago",
    description: "Handcrafted leather handbags, various styles and colors",
  },
]

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-blue-100 text-blue-800",
  quoted: "bg-green-100 text-green-800",
  negotiating: "bg-yellow-100 text-yellow-800",
  closed: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

export default function SourcingRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter
    const matchesTab = activeTab === "all" || request.status === activeTab

    return matchesSearch && matchesStatus && matchesCategory && matchesTab
  })

  const getStatusCounts = () => {
    const counts = {
      all: mockRequests.length,
      draft: mockRequests.filter((r) => r.status === "draft").length,
      active: mockRequests.filter((r) => r.status === "active").length,
      quoted: mockRequests.filter((r) => r.status === "quoted").length,
      negotiating: mockRequests.filter((r) => r.status === "negotiating").length,
      closed: mockRequests.filter((r) => r.status === "closed").length,
    }
    return counts
  }

  const statusCounts = getStatusCounts()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isDeadlineNear = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  const isOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    return deadlineDate < today
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sourcing Requests</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/requests/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRequests.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts.active + statusCounts.quoted + statusCounts.negotiating}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$126.5K</div>
            <p className="text-xs text-muted-foreground">Target pricing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground">Closed successfully</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Food & Agriculture">Food & Agriculture</SelectItem>
                  <SelectItem value="Cosmetics & Beauty">Cosmetics & Beauty</SelectItem>
                  <SelectItem value="Textiles & Crafts">Textiles & Crafts</SelectItem>
                  <SelectItem value="Mining & Minerals">Mining & Minerals</SelectItem>
                  <SelectItem value="Leather & Fashion">Leather & Fashion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="draft">Draft ({statusCounts.draft})</TabsTrigger>
              <TabsTrigger value="active">Active ({statusCounts.active})</TabsTrigger>
              <TabsTrigger value="quoted">Quoted ({statusCounts.quoted})</TabsTrigger>
              <TabsTrigger value="negotiating">Negotiating ({statusCounts.negotiating})</TabsTrigger>
              <TabsTrigger value="closed">Closed ({statusCounts.closed})</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Target Price</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{request.title}</div>
                          <div className="text-sm text-muted-foreground">{request.id}</div>
                          <div className="text-xs text-muted-foreground">{request.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[request.status]}>{request.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityColors[request.priority]}>
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                          {request.location}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{request.targetPrice}</TableCell>
                      <TableCell>
                        <div
                          className={`text-sm ${
                            isOverdue(request.deadline)
                              ? "text-red-600 font-medium"
                              : isDeadlineNear(request.deadline)
                                ? "text-yellow-600 font-medium"
                                : ""
                          }`}
                        >
                          {formatDate(request.deadline)}
                          {isOverdue(request.deadline) && " (Overdue)"}
                          {isDeadlineNear(request.deadline) && !isOverdue(request.deadline) && " (Soon)"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{request.lastActivity}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Request
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
