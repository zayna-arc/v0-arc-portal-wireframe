import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, MoreHorizontal, Eye, Edit } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage submissions, deals, and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-green-600">+12% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-orange-600">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,429</div>
              <p className="text-xs text-blue-600">+8% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue (MTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$89,420</div>
              <p className="text-xs text-green-600">+15% vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest sourcing requests requiring review</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search requests..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "REQ-1247",
                    company: "Al-Rashid Trading",
                    type: "Vehicle",
                    status: "Pending Review",
                    date: "2 hours ago",
                  },
                  {
                    id: "REQ-1246",
                    company: "Gulf Construction",
                    type: "Machinery",
                    status: "In Progress",
                    date: "4 hours ago",
                  },
                  {
                    id: "REQ-1245",
                    company: "Desert Logistics",
                    type: "Vehicle",
                    status: "Quoted",
                    date: "6 hours ago",
                  },
                  {
                    id: "REQ-1244",
                    company: "Oasis Equipment",
                    type: "Machinery",
                    status: "Pending Review",
                    date: "8 hours ago",
                  },
                  {
                    id: "REQ-1243",
                    company: "Mirage Industries",
                    type: "Vehicle",
                    status: "Negotiating",
                    date: "1 day ago",
                  },
                ].map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.company}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "Pending Review"
                            ? "destructive"
                            : request.status === "In Progress"
                              ? "default"
                              : request.status === "Quoted"
                                ? "secondary"
                                : "default"
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{request.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
