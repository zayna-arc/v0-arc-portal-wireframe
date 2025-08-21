"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calculator, Truck, Ship, Plane, FileText } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default function LogisticsPage() {
  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Logistics & Compliance</h1>
          <p className="text-gray-600">Estimate shipping costs and manage compliance documents</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Shipping Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Shipping Cost Estimator
                </CardTitle>
                <CardDescription>Get instant shipping cost estimates</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input id="origin" placeholder="Houston, TX" />
                </div>
                <div>
                  <Label htmlFor="dest">Destination</Label>
                  <Input id="dest" placeholder="Casablanca, MA" />
                </div>
                <div>
                  <Label htmlFor="dims">Dimensions/Weight</Label>
                  <Input id="dims" placeholder="2.5m x 1.6m x 1.8m / 2.1t" />
                </div>
                <div className="md:col-span-3">
                  <Button onClick={calculateShipping} disabled={loading} className="btn-brand w-full">
                    {loading ? "Calculating..." : "Estimate"}
                  </Button>
                </div>
                <div className="md:col-span-3 text-sm text-gray-600">
                  Result: {estimate ? "wireframe placeholder" : "No estimate available"}
                </div>
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
                </CardContent>
              </Card>
            )}
          </div>

          {/* Compliance Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents You’ll Need
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Commercial Invoice, Packing List, BOL</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Drop files here or <span className="text-blue-600 cursor-pointer">browse</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Verify HS codes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Check import restrictions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Confirm duty rates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Validate certificates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
