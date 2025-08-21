"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Save, Send } from "lucide-react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function NewRequest() {
  const [requestType, setRequestType] = useState("vehicles")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h2 className="font-semibold">New Request</h2>
        </header>
        <div className="flex min-h-screen bg-gray-50">
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Create New Request</h1>
                  <p className="text-gray-600">Tell us what you're looking for</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </div>

            {/* Request Type Tabs */}
            <Tabs value={requestType} onValueChange={setRequestType} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="machinery">Machinery</TabsTrigger>
              </TabsList>

              {/* Vehicles Form */}
              <TabsContent value="vehicles">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Vehicle Details</CardTitle>
                        <CardDescription>Specify the vehicle you're looking for</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="brand">Brand *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="toyota">Toyota</SelectItem>
                                <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                                <SelectItem value="volvo">Volvo</SelectItem>
                                <SelectItem value="scania">Scania</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="model">Model *</Label>
                            <Input id="model" placeholder="e.g., Hilux, Actros" />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="drivetrain">Drivetrain</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2wd">2WD</SelectItem>
                                <SelectItem value="4wd">4WD</SelectItem>
                                <SelectItem value="awd">AWD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="year">Year Range</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                                <SelectItem value="older">2020 or older</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="condition">Condition</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="used-excellent">Used - Excellent</SelectItem>
                                <SelectItem value="used-good">Used - Good</SelectItem>
                                <SelectItem value="used-fair">Used - Fair</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="budget">Budget Range (USD)</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under-25k">Under $25,000</SelectItem>
                                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                                <SelectItem value="100k-plus">$100,000+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="timeline">Preferred Timeline</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="asap">ASAP</SelectItem>
                                <SelectItem value="1-month">Within 1 month</SelectItem>
                                <SelectItem value="3-months">Within 3 months</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping & Terms</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="incoterms">Incoterms</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select terms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fob">FOB (Free on Board)</SelectItem>
                                <SelectItem value="cif">CIF (Cost, Insurance, Freight)</SelectItem>
                                <SelectItem value="exw">EXW (Ex Works)</SelectItem>
                                <SelectItem value="dap">DAP (Delivered at Place)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="destination">Destination Port</Label>
                            <Input id="destination" placeholder="e.g., Jebel Ali, Dubai" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="notes">Special Requirements / Notes</Label>
                          <Textarea
                            id="notes"
                            placeholder="Any specific requirements, modifications, or additional information..."
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label>Reference Images/Documents</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Drag and drop files here, or <span className="text-blue-600 cursor-pointer">browse</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG, PDF (max 10MB each)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Request Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium">Type:</span> Vehicle
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <Badge variant="secondary" className="ml-2">
                              Draft
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> Just now
                          </div>
                          <div>
                            <span className="font-medium">Auto-save:</span> Enabled
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>What Happens Next?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <div className="font-medium">Review & Matching</div>
                              <div className="text-gray-600">We'll review your request and match with suppliers</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                            <div>
                              <div className="font-medium">Quotes & Proposals</div>
                              <div className="text-gray-600">Receive competitive quotes within 24-48 hours</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                            <div>
                              <div className="font-medium">Negotiation Support</div>
                              <div className="text-gray-600">Our team helps negotiate the best terms</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Machinery Form */}
              <TabsContent value="machinery">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Machinery Details</CardTitle>
                        <CardDescription>Specify the machinery you're looking for</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="machinery-type">Machinery Type *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="excavator">Excavator</SelectItem>
                                <SelectItem value="loader">Wheel Loader</SelectItem>
                                <SelectItem value="bulldozer">Bulldozer</SelectItem>
                                <SelectItem value="crane">Mobile Crane</SelectItem>
                                <SelectItem value="grader">Motor Grader</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="machinery-brand">Brand *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="caterpillar">Caterpillar</SelectItem>
                                <SelectItem value="komatsu">Komatsu</SelectItem>
                                <SelectItem value="hitachi">Hitachi</SelectItem>
                                <SelectItem value="volvo">Volvo</SelectItem>
                                <SelectItem value="liebherr">Liebherr</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="machinery-model">Model</Label>
                            <Input id="machinery-model" placeholder="e.g., 320D, PC200" />
                          </div>
                          <div>
                            <Label htmlFor="operating-weight">Operating Weight</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under-10t">Under 10 tons</SelectItem>
                                <SelectItem value="10-20t">10-20 tons</SelectItem>
                                <SelectItem value="20-30t">20-30 tons</SelectItem>
                                <SelectItem value="30t-plus">30+ tons</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="attachments">Required Attachments</Label>
                          <Textarea
                            id="attachments"
                            placeholder="List any specific attachments needed (bucket, hammer, etc.)"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="repairs-needed">Repairs/Refurbishment Needed</Label>
                          <Textarea
                            id="repairs-needed"
                            placeholder="Describe any known repairs or refurbishment requirements"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Same shipping and additional info cards as vehicles */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping & Terms</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="incoterms">Incoterms</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select terms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fob">FOB (Free on Board)</SelectItem>
                                <SelectItem value="cif">CIF (Cost, Insurance, Freight)</SelectItem>
                                <SelectItem value="exw">EXW (Ex Works)</SelectItem>
                                <SelectItem value="dap">DAP (Delivered at Place)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="destination">Destination Port</Label>
                            <Input id="destination" placeholder="e.g., Jebel Ali, Dubai" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Same sidebar as vehicles */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Request Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium">Type:</span> Machinery
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <Badge variant="secondary" className="ml-2">
                              Draft
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> Just now
                          </div>
                          <div>
                            <span className="font-medium">Auto-save:</span> Enabled
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="btn-brand">Submit</Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
