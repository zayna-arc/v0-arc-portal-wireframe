"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Truck, FileText, MessageSquare, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/sourcing-requests/new">New Request</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 arriving this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,500</div>
            <p className="text-xs text-muted-foreground">5 invoices due</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
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
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates on your sourcing requests and shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Quote received for Argan Oil request</p>
                  <p className="text-sm text-muted-foreground">SR-1023 • 2 hours ago</p>
                </div>
                <Badge variant="outline">New Quote</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Shipment departed from Casablanca Port</p>
                  <p className="text-sm text-muted-foreground">SH-2024-001 • 4 hours ago</p>
                </div>
                <Badge variant="outline">In Transit</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Invoice payment overdue</p>
                  <p className="text-sm text-muted-foreground">INV-2024-045 • 1 day ago</p>
                </div>
                <Badge variant="destructive">Overdue</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">New team member invited</p>
                  <p className="text-sm text-muted-foreground">omar@supplier-dz.com • 2 days ago</p>
                </div>
                <Badge variant="outline">Team</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/sourcing-requests/new">
                <Package className="mr-2 h-4 w-4" />
                New Sourcing Request
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
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/account-team">
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Request Status</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active</span>
              <span className="text-sm font-medium">12</span>
            </div>
            <Progress value={60} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Pending: 5</span>
              <span>In Progress: 7</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Shipment Status</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">In Transit</span>
              <span className="text-sm font-medium">8</span>
            </div>
            <Progress value={75} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Sea: 6</span>
              <span>Air: 2</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Payment Status</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Outstanding</span>
              <span className="text-sm font-medium">$24.5K</span>
            </div>
            <Progress value={40} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Overdue: $8.2K</span>
              <span>Due: $16.3K</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
