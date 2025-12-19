"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, FileText, MessageSquare, Upload, AlertTriangle, Calendar } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const filters = [
    { id: "all", label: "All" },
    { id: "risk", label: "Risk" },
    { id: "compliance", label: "Compliance" },
    { id: "execution", label: "Execution" },
    { id: "partner", label: "Partner Activity" },
  ]

  const projectSignals = [
    {
      project: "Argan Oil Import Q1 2025",
      signal: "Quote received from supplier",
      timestamp: "2 hours ago",
      owner: "Procurement Team",
      category: "execution",
      categoryLabel: "Execution",
    },
    {
      project: "Atlas Spices Shipment",
      signal: "Customs clearance delayed",
      timestamp: "4 hours ago",
      owner: "Logistics Team",
      category: "risk",
      categoryLabel: "Risk",
    },
    {
      project: "Textile Import - Fez",
      signal: "Export license verification pending",
      timestamp: "6 hours ago",
      owner: "Compliance Team",
      category: "compliance",
      categoryLabel: "Compliance",
    },
    {
      project: "Electronics Components Q2",
      signal: "Supplier updated pricing terms",
      timestamp: "1 day ago",
      owner: "Partner Relations",
      category: "partner",
      categoryLabel: "Partner Activity",
    },
  ]

  const filteredSignals =
    activeFilter === "all" ? projectSignals : projectSignals.filter((s) => s.category === activeFilter)

  const blockedMilestones = [
    {
      project: "Atlas Spices Shipment",
      milestone: "Customs clearance approval",
      dueDate: "Dec 20, 2024",
      status: "blocked" as const,
    },
    {
      project: "Textile Import - Fez",
      milestone: "Export license verification",
      dueDate: "Dec 22, 2024",
      status: "blocked" as const,
    },
    {
      project: "Argan Oil Import Q1 2025",
      milestone: "Quality inspection booking",
      dueDate: "Dec 28, 2024",
      status: "upcoming" as const,
    },
    {
      project: "Electronics Components Q2",
      milestone: "Proforma invoice approval",
      dueDate: "Jan 5, 2025",
      status: "upcoming" as const,
    },
    {
      project: "Pharmaceutical Supplies",
      milestone: "FDA documentation submission",
      dueDate: "Dec 15, 2024",
      status: "overdue" as const,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Project Overview</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/sourcing-requests/new">New Request</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all corridors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execution in Progress</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 arriving this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Requiring Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Licensing, compliance, approvals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 urgent notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Project Signals</CardTitle>
            <CardDescription>Decision-relevant updates across all initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className={activeFilter === filter.id ? "" : "bg-transparent"}
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Signals Feed */}
            <div className="space-y-4">
              {filteredSignals.map((signal, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium leading-none">
                      {signal.project} → {signal.signal}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>{signal.timestamp}</span>
                      <span>•</span>
                      <span>{signal.owner}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    {signal.categoryLabel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/projects">
                <Package className="mr-2 h-4 w-4" />
                View Projects
              </Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/sourcing-requests/new">
                <FileText className="mr-2 h-4 w-4" />
                New Sourcing Request
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/resources">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Check Messages
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/dashboard/invoices-payments">
                <FileText className="mr-2 h-4 w-4" />
                Review Invoices
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blocked & Upcoming Milestones</CardTitle>
          <CardDescription>Critical path items requiring oversight</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {blockedMilestones.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none mb-1">{item.project}</p>
                    <p className="text-sm text-muted-foreground truncate">{item.milestone}</p>
                  </div>
                  <div className="text-sm text-muted-foreground flex-shrink-0">{item.dueDate}</div>
                  <Badge
                    variant={
                      item.status === "blocked" ? "destructive" : item.status === "overdue" ? "destructive" : "outline"
                    }
                    className="flex-shrink-0"
                  >
                    {item.status === "blocked" && "Blocked"}
                    {item.status === "overdue" && "Overdue"}
                    {item.status === "upcoming" && "Upcoming"}
                  </Badge>
                </div>
                <Button asChild variant="ghost" size="sm" className="ml-2 flex-shrink-0">
                  <Link href={`/projects/${index + 1}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
