import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Building, Globe, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"

export default function OnboardingSummary() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to ARC Portal!</h1>
          <p className="text-gray-600">Your account has been successfully set up</p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Review your setup details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Profile */}
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Company Profile</h3>
                <p className="text-sm text-gray-600">Al-Rashid Trading LLC</p>
                <p className="text-sm text-gray-600">Construction & Heavy Equipment</p>
              </div>
            </div>

            {/* Trade Focus */}
            <div className="flex items-start space-x-3">
              <Globe className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Trade Focus</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="secondary">Heavy Machinery</Badge>
                  <Badge variant="secondary">Logistics</Badge>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Primary Location</h3>
                <p className="text-sm text-gray-600">United Arab Emirates</p>
                <p className="text-sm text-gray-600">Additional markets: Saudi Arabia, Egypt</p>
              </div>
            </div>

            {/* Membership */}
            <div className="flex items-start space-x-3">
              <CreditCard className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Membership</h3>
                <div className="flex items-center space-x-2">
                  <Badge>Business Builder</Badge>
                  <span className="text-sm text-gray-600">$299/month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Get started with these recommended actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Create Your First Request</h4>
                  <p className="text-sm text-gray-600">Start sourcing vehicles or machinery</p>
                </div>
                <Button asChild>
                  <Link href="/dashboard/requests/new">
                    Create Request
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Explore Resources</h4>
                  <p className="text-sm text-gray-600">Access trade guides and templates</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/resources">Browse</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Set Up Your Team</h4>
                  <p className="text-sm text-gray-600">Invite colleagues to collaborate</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/account/team">Invite Team</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
