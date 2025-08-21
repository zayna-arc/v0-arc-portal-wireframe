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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Download, ExternalLink, Plus, Trash2 } from "lucide-react"

// Mock data
const mockInvoices = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    amount: "$1,500.00",
    status: "Paid",
    description: "Business Builder - January 2024",
    downloadUrl: "#",
  },
  {
    id: "INV-2024-002",
    date: "2024-02-15",
    amount: "$1,500.00",
    status: "Paid",
    description: "Business Builder - February 2024",
    downloadUrl: "#",
  },
  {
    id: "INV-2024-003",
    date: "2024-03-15",
    amount: "$1,500.00",
    status: "Overdue",
    description: "Business Builder - March 2024",
    downloadUrl: "#",
  },
]

const mockPaymentMethods = [
  {
    id: "pm_1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expiry: "08/26",
    isDefault: false,
  },
]

const statusColors = {
  Paid: "secondary",
  Pending: "default",
  Overdue: "destructive",
  Failed: "destructive",
} as const

export default function InvoicesPayments() {
  const [showAddPayment, setShowAddPayment] = useState(false)

  // Mock membership data
  const membershipData = {
    tier: "Business Builder",
    billingCycle: "Monthly",
    nextChargeDate: "March 15, 2024",
    status: "Active",
    amount: "$1,500.00",
  }

  const outstandingBalance = mockInvoices
    .filter((inv) => inv.status === "Overdue" || inv.status === "Pending")
    .reduce((sum, inv) => sum + Number.parseFloat(inv.amount.replace("$", "").replace(",", "")), 0)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h2 className="font-semibold">Invoices & Payments</h2>
        </header>

        <div className="p-4 space-y-6">
          {/* Outstanding Balance Alert */}
          {outstandingBalance > 0 && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between">
                <span>You have an outstanding balance of ${outstandingBalance.toFixed(2)}</span>
                <Button size="sm" variant="destructive">
                  Pay Now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Membership Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Membership Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Current Plan</Label>
                  <div className="font-semibold">{membershipData.tier}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Billing</Label>
                  <div className="font-semibold">{membershipData.billingCycle}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Next Charge</Label>
                  <div className="font-semibold">{membershipData.nextChargeDate}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Amount</Label>
                  <div className="font-semibold">{membershipData.amount}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{membershipData.status}</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Payment Methods */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockPaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                          {method.brand.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">•••• {method.last4}</div>
                          <div className="text-sm text-gray-600">Expires {method.expiry}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Billing Profile */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Billing Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Al-Rashid Trading LLC" />
                  </div>
                  <div>
                    <Label htmlFor="tax-id">Tax/VAT ID</Label>
                    <Input id="tax-id" placeholder="Enter tax ID" />
                  </div>
                  <div>
                    <Label htmlFor="billing-email">Billing Email</Label>
                    <Input id="billing-email" type="email" defaultValue="billing@alrashid.com" />
                  </div>
                  <div>
                    <Label htmlFor="address">Billing Address</Label>
                    <Input id="address" placeholder="Street address" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="City" />
                    <Input placeholder="Postal Code" />
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Invoices */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice History</CardTitle>
                  <CardDescription>View and download your invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  {mockInvoices.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
                      <p className="text-gray-600">Your invoices will appear here once billing starts</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>{invoice.description}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>
                              <Badge variant={statusColors[invoice.status as keyof typeof statusColors]}>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                {invoice.status === "Overdue" && (
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    Pay
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
