"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Eye, Upload } from "lucide-react"

// Mock data
const mockRequests = [
  {
    id: "REQ-001",
    title: "Toyota Hilux 2023",
    country: "UAE",
    qty: 5,
    targetPrice: "$45,000",
    status: "In Progress",
    updatedAt: "2 hours ago",
  },
  {
    id: "REQ-002",
    title: "Caterpillar 320D Excavator",
    country: "Morocco",
    qty: 2,
    targetPrice: "$180,000",
    status: "Quoted",
    updatedAt: "1 day ago",
  },
  {
    id: "REQ-003",
    title: "Mercedes Actros Truck",
    country: "Libya",
    qty: 10,
    targetPrice: "$85,000",
    status: "Draft",
    updatedAt: "3 days ago",
  },
]

const statusColors = {
  Draft: "secondary",
  Submitted: "default",
  "In Progress": "default",
  Quoted: "secondary",
  "On Hold": "destructive",
  Completed: "secondary",
} as const

export default function SourcingRequests() {
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  // Mock membership check - replace with real logic
  const membershipActive = true
  const membershipTier = "builder" // builder, advantage, executive, elite
  const activeRequests = mockRequests.filter((r) => r.status !== "Completed").length

  const requestLimits = {
    builder: 3,
    advantage: 5,
    executive: 8,
    elite: Number.POSITIVE_INFINITY,
  }

  const canCreateRequest = activeRequests < requestLimits[membershipTier as keyof typeof requestLimits]

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status.toLowerCase().replace(" ", "-") === statusFilter
    const matchesCountry = countryFilter === "all" || request.country === countryFilter
    return matchesSearch && matchesStatus && matchesCountry
  })

  if (!membershipActive) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen items-center justify-center">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Membership Required</CardTitle>
                <CardDescription>Activate your membership to access sourcing requests</CardDescription>
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
          <h2 className="font-semibold">Sourcing Requests</h2>
          <div className="ml-auto">
            <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
              <DialogTrigger asChild>
                <Button disabled={!canCreateRequest} className="btn-brand">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>New Sourcing Request</DialogTitle>
                  <DialogDescription>Step {currentStep} of 3</DialogDescription>
                </DialogHeader>

                <Tabs value={`step-${currentStep}`} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="step-1">Product</TabsTrigger>
                    <TabsTrigger value="step-2">Commercials</TabsTrigger>
                    <TabsTrigger value="step-3">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="step-1" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-name">Product Name/SKU</Label>
                        <Input id="product-name" placeholder="e.g., Toyota Hilux 2023" />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vehicles">Vehicles</SelectItem>
                            <SelectItem value="machinery">Heavy Machinery</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="specs">Specifications</Label>
                      <Textarea id="specs" placeholder="Detailed specifications..." />
                    </div>
                    <div>
                      <Label>Photos/Files</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Drop files here or click to browse</p>
                      </div>
                    </div>
                    <Button onClick={() => setCurrentStep(2)} className="w-full">
                      Next
                    </Button>
                  </TabsContent>

                  <TabsContent value="step-2" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" placeholder="1" />
                      </div>
                      <div>
                        <Label htmlFor="target-price">Target Price</Label>
                        <Input id="target-price" placeholder="$50,000" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="incoterm">Incoterm</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select incoterm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fob">FOB</SelectItem>
                            <SelectItem value="cif">CIF</SelectItem>
                            <SelectItem value="exw">EXW</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="destination">Destination</Label>
                        <Input id="destination" placeholder="Port/City" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal (30-45 days)</SelectItem>
                          <SelectItem value="rush">Rush (15-20 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <Button onClick={() => setCurrentStep(3)} className="flex-1">
                        Next
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="step-3" className="space-y-4">
                    <div>
                      <Label htmlFor="vendor-prefs">Vendor Preferences</Label>
                      <Textarea id="vendor-prefs" placeholder="Any specific vendor requirements..." />
                    </div>
                    <div>
                      <Label htmlFor="certifications">Required Certifications</Label>
                      <Input id="certifications" placeholder="e.g., ISO, CE, etc." />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sample-required" />
                      <Label htmlFor="sample-required">Sample required before order</Label>
                    </div>
                    <div>
                      <Label htmlFor="additional-notes">Additional Notes</Label>
                      <Textarea id="additional-notes" placeholder="Any other requirements or constraints..." />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        Back
                      </Button>
                      <Button onClick={() => setShowNewRequest(false)} className="flex-1 btn-brand">
                        Submit Request
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-4 space-y-6">
          {/* Plan Limits Banner */}
          {!canCreateRequest && (
            <Alert>
              <AlertDescription>
                You've reached your plan limit of {requestLimits[membershipTier as keyof typeof requestLimits]} active
                requests.
                <Button variant="link" className="p-0 h-auto ml-1">
                  Upgrade your plan
                </Button>{" "}
                to create more.
              </AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by title or ID..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="quoted">Quoted</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="Morocco">Morocco</SelectItem>
                    <SelectItem value="Libya">Libya</SelectItem>
                    <SelectItem value="Tunisia">Tunisia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Requests</CardTitle>
              <CardDescription>Manage and track your sourcing requests</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No requests found</h3>
                  <p className="text-gray-600 mb-4">
                    {mockRequests.length === 0
                      ? "Create your first sourcing request to get started"
                      : "Try adjusting your filters"}
                  </p>
                  {mockRequests.length === 0 && canCreateRequest && (
                    <Button onClick={() => setShowNewRequest(true)} className="btn-brand">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Request
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Target Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.country}</TableCell>
                        <TableCell>{request.qty}</TableCell>
                        <TableCell>{request.targetPrice}</TableCell>
                        <TableCell>
                          <Badge variant={statusColors[request.status as keyof typeof statusColors]}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{request.updatedAt}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
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
