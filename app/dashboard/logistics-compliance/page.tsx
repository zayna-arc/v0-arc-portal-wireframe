"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Truck, Ship, Plane, FileText, Upload, Download, CheckCircle, AlertCircle } from "lucide-react"

// Mock data
const mockEstimates = [
  {
    id: "EST-001",
    route: "Houston, TX → Casablanca, MA",
    dimensions: "2.5m x 1.6m x 1.8m / 2.1t",
    seaCost: 2850,
    airCost: 8500,
    landCost: 1200,
    createdAt: "2 days ago",
  },
]

const mockUploads = [
  { name: "Commercial_Invoice_REQ001.pdf", status: "Uploaded", uploadedAt: "1 hour ago" },
  { name: "Packing_List_REQ001.pdf", status: "Required", uploadedAt: null },
  { name: "Bill_of_Lading.pdf", status: "Required", uploadedAt: null },
]

export default function LogisticsCompliance() {
  const [estimate, setEstimate] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [dimensions, setDimensions] = useState("")

  // Mock membership check
  const membershipActive = true

  const calculateShipping = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setEstimate({
        sea: { cost: 2850, days: "25-30" },
        air: { cost: 8500, days: "3-5" },
        land: { cost: 1200, days: "7-10" },
      })
      setLoading(false)
    }, 2000)
  }

  if (!membershipActive) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen items-center justify-center">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Membership Required</CardTitle>
                <CardDescription>Activate your membership to access logistics tools</CardDescription>
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
          <h2 className="font-semibold">Logistics & Compliance</h2>
        </header>

        <div className="p-4 space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Tools */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Shipping Cost Estimator
                  </CardTitle>
                  <CardDescription>Get instant shipping cost estimates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="origin">Origin</Label>
                      <Input
                        id="origin"
                        placeholder="Houston, TX"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dest">Destination</Label>
                      <Input
                        id="dest"
                        placeholder="Casablanca, MA"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dims">Dimensions/Weight</Label>
                      <Input
                        id="dims"
                        placeholder="2.5m x 1.6m x 1.8m / 2.1t"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={calculateShipping}
                    disabled={loading || !origin || !destination}
                    className="btn-brand w-full"
                  >
                    {loading ? "Calculating..." : "Get Estimate"}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {estimate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Options</CardTitle>
                    <CardDescription>Estimated costs and transit times</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Ship className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="font-medium">Sea Freight</div>
                            <div className="text-sm text-gray-600">{estimate.sea.days} days</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">${estimate.sea.cost}</div>
                          <Badge variant="secondary">Most economical</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Truck className="h-8 w-8 text-green-600" />
                          <div>
                            <div className="font-medium">Land Transport</div>
                            <div className="text-sm text-gray-600">{estimate.land.days} days</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">${estimate.land.cost}</div>
                          <Badge variant="secondary">Regional only</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Plane className="h-8 w-8 text-purple-600" />
                          <div>
                            <div className="font-medium">Air Freight</div>
                            <div className="text-sm text-gray-600">{estimate.air.days} days</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">${estimate.air.cost}</div>
                          <Badge variant="secondary">Fastest</Badge>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-transparent" variant="outline">
                      Save Estimate
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Saved Estimates */}
              <Card>
                <CardHeader>
                  <CardTitle>Saved Estimates</CardTitle>
                  <CardDescription>Your previous shipping calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  {mockEstimates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No saved estimates yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Route</TableHead>
                          <TableHead>Dimensions</TableHead>
                          <TableHead>Sea</TableHead>
                          <TableHead>Air</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockEstimates.map((est) => (
                          <TableRow key={est.id}>
                            <TableCell className="font-medium">{est.route}</TableCell>
                            <TableCell>{est.dimensions}</TableCell>
                            <TableCell>${est.seaCost}</TableCell>
                            <TableCell>${est.airCost}</TableCell>
                            <TableCell className="text-gray-600">{est.createdAt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* HS Code & Licensing */}
              <Card>
                <CardHeader>
                  <CardTitle>HS Code & Licensing Lookup</CardTitle>
                  <CardDescription>Get HS codes and licensing requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="product-desc">Product Description</Label>
                    <Textarea
                      id="product-desc"
                      placeholder="Detailed product description for classification..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="origin-country">Origin Country</Label>
                      <Input id="origin-country" placeholder="United States" />
                    </div>
                    <div>
                      <Label htmlFor="dest-country">Destination Country</Label>
                      <Input id="dest-country" placeholder="Morocco" />
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Get HS Code & Requirements
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Compliance Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Checklist</CardTitle>
                  <CardDescription>Track your compliance requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { task: "HS code verified", completed: true },
                      { task: "License/permit check", completed: false },
                      { task: "RPS screening", completed: false },
                      { task: "Docs prepared (CI/PL/BOL/COO)", completed: false },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" checked={item.completed} className="rounded" readOnly />
                        <span className={item.completed ? "line-through text-gray-500" : ""}>{item.task}</span>
                        {item.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Document Uploads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Document Uploads
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Drop files here or <span className="text-blue-600 cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">CI, PL, BOL, COO, etc.</p>
                  </div>

                  <div className="space-y-2">
                    {mockUploads.map((upload, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{upload.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {upload.status === "Uploaded" ? (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {upload.status}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {upload.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Book Inspection
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Request Freight Quotes
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Doc Templates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
