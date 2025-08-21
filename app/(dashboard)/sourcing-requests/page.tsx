"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, MoreHorizontal, Eye, MessageSquare, Calendar, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockRequests = [
  {
    id: "SR-1023",
    title: "Premium Argan Oil - 500L",
    status: "Active",
    priority: "High",
    region: "Morocco",
    budget: "$15,000",
    quotes: 3,
    deadline: "2024-12-20",
    description: "High-quality organic argan oil for cosmetic use",
    createdAt: "2024-12-01",
  },
  {
    id: "SR-1024",
    title: "Handwoven Berber Carpets - 50 pieces",
    status: "Pending",
    priority: "Medium",
    region: "Morocco",
    budget: "$25,000",
    quotes: 1,
    deadline: "2024-12-25",
    description: "Traditional Berber carpets for retail distribution",
    createdAt: "2024-12-03",
  },
  {
    id: "SR-1025",
    title: "Dates - Premium Medjool - 2 tons",
    status: "Completed",
    priority: "Low",
    region: "Algeria",
    budget: "$8,000",
    quotes: 5,
    deadline: "2024-12-15",
    description: "Premium quality Medjool dates for export",
    createdAt: "2024-11-28",
  },
  {
    id: "SR-1026",
    title: "Olive Oil - Extra Virgin - 1000L",
    status: "Active",
    priority: "High",
    region: "Tunisia",
    budget: "$12,000",
    quotes: 2,
    deadline: "2024-12-22",
    description: "Cold-pressed extra virgin olive oil",
    createdAt: "2024-12-05",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
      return "bg-blue-100 text-blue-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function SourcingRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && request.status === "Active"
    if (activeTab === "pending") return matchesSearch && request.status === "Pending"
    if (activeTab === "completed") return matchesSearch && request.status === "Completed"

    return matchesSearch
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sourcing Requests</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/sourcing-requests/new">
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRequests.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRequests.filter((r) => r.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Currently sourcing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRequests.reduce((sum, r) => sum + r.quotes, 0)}</div>
            <p className="text-xs text-muted-foreground">Received this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$60K</div>
            <p className="text-xs text-muted-foreground">Across all requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription>{request.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Messages
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {request.region}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="mr-1 h-3 w-3" />
                        {request.budget}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        {request.quotes} quotes
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Due {request.deadline}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
