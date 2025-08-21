"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Package, Info } from "lucide-react"

// Mock data
const mockOrders = [
  {
    id: "SO-001",
    itemType: "Auction Vehicle",
    description: "1995 Mercedes G-Wagon from Barrett-Jackson",
    budget: "$85,000",
    status: "Reviewing",
    submittedAt: "2 days ago",
  },
  {
    id: "SO-002",
    itemType: "Custom Machinery",
    description: "Modified excavator with custom attachment",
    budget: "$250,000",
    status: "Sourcing",
    submittedAt: "1 week ago",
  },
]

const statusColors = {
  New: "secondary",
  Reviewing: "default",
  Sourcing: "default",
  "Awaiting Customer": "secondary",
  Closed: "secondary",
} as const

export default function SpecialOrders() {
  const [showForm, setShowForm] = useState(false)

  // Mock membership check
  const membershipActive = true

  if (!membershipActive) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen items-center justify-center">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Membership Required</CardTitle>
                <CardDescription>Activate your membership to access special orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/welcome">Activate Membership</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h2 className="font-semibold">Special Orders</h2>
        </header>

        <div className="p-4 space-y-6">
          {/* Info Card */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Special orders are for unique items like auction vehicles, custom machinery, or hard-to-find equipment.
              Coordination fees are billed separately; inspection and freight costs are at cost.
            </AlertDescription>
          </Alert>

          {/* New Order Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Request Special Order
              </CardTitle>
              <CardDescription>Submit details for one-off items, auctions, or custom equipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-type">Item Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auction-vehicle">Auction Vehicle</SelectItem>
                      <SelectItem value="custom-machinery">Custom Machinery</SelectItem>
                      <SelectItem value="rare-equipment">Rare Equipment</SelectItem>
                      <SelectItem value="government-surplus">Government Surplus</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget-cap">Budget Cap</Label>
                  <Input id="budget-cap" placeholder="$100,000" />
                </div>
              </div>

              <div>
                <Label htmlFor="link-lot">Link/Lot Number</Label>
                <Input id="link-lot" placeholder="Auction link or lot number" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="needed-by">Needed By Date</Label>
                  <Input id="needed-by" type="date" />
                </div>
                <div>
                  <Label htmlFor="origin">Origin Location</Label>
                  <Input id="origin" placeholder="City, State/Country" />
                </div>
              </div>

              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="Final destination" />
              </div>

              <div>
                <Label htmlFor="description">Item Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the item, specifications, condition requirements, etc."
                  rows={4}
                />
              </div>

              <div>
                <Label>Photos/Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drop photos, auction listings, or spec sheets here</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 10MB each</p>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Any special requirements, constraints, or preferences..." rows={3} />
              </div>

              <Button className="w-full btn-brand">Submit Special Order Request</Button>
            </CardContent>
          </Card>

          {/* Existing Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Your Special Orders</CardTitle>
              <CardDescription>Track your special order requests</CardDescription>
            </CardHeader>
            <CardContent>
              {mockOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No special orders yet</h3>
                  <p className="text-gray-600">Submit your first special order request above</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Item Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.itemType}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.description}</TableCell>
                        <TableCell>{order.budget}</TableCell>
                        <TableCell>
                          <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{order.submittedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
