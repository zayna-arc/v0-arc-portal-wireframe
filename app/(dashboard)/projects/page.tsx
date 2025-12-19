"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FolderKanban, AlertTriangle, CheckCircle2, Clock, FileText, MessageSquare, ChevronRight } from "lucide-react"
import Link from "next/link"

// Mock project data
const projects = [
  {
    id: "PRJ-2024-001",
    name: "Moroccan Argan Oil Supply Chain",
    region: "Morocco",
    sector: "Agriculture & Food",
    status: "Active",
    description:
      "Establish long-term argan oil sourcing relationship with certified cooperatives in the Essaouira region for organic cosmetics market.",
    linkedRequests: [
      { id: "SR-1023", name: "Argan Oil - Bulk Order", status: "Quote Received", deadline: "2024-02-15" },
      { id: "SR-1089", name: "Packaging Materials", status: "In Progress", deadline: "2024-02-20" },
    ],
    compliance: {
      hsCode: "1515.90.40",
      hsVerified: true,
      licensing: "Export permit pending",
      sanctions: "Clear",
    },
    activity: [
      { type: "message", text: "New quote received from cooperative", time: "2 hours ago" },
      { type: "update", text: "HS code verification completed", time: "1 day ago" },
    ],
  },
  {
    id: "PRJ-2024-002",
    name: "Tunisian Olive Oil Partnership",
    region: "Tunisia",
    sector: "Agriculture & Food",
    status: "Feasibility",
    description:
      "Evaluate feasibility of importing premium Tunisian olive oil for specialty food distributors in the U.S. Northeast.",
    linkedRequests: [{ id: "SR-1145", name: "Olive Oil Samples", status: "Pending", deadline: "2024-03-01" }],
    compliance: {
      hsCode: "1509.10.20",
      hsVerified: true,
      licensing: "FDA registration required",
      sanctions: "Clear",
    },
    activity: [
      { type: "message", text: "Supplier meeting scheduled", time: "3 hours ago" },
      { type: "update", text: "Market research completed", time: "2 days ago" },
    ],
  },
  {
    id: "PRJ-2024-003",
    name: "Algerian Phosphate Minerals",
    region: "Algeria",
    sector: "Industrial Materials",
    status: "Exploratory",
    description:
      "Explore potential for phosphate rock imports to support U.S. fertilizer production and reduce dependency on single-source suppliers.",
    linkedRequests: [],
    compliance: {
      hsCode: "2510.20.00",
      hsVerified: false,
      licensing: "Mining export license verification in progress",
      sanctions: "Under review",
    },
    activity: [{ type: "update", text: "Initial outreach to mining operators", time: "1 week ago" }],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "default"
    case "Feasibility":
      return "secondary"
    case "Exploratory":
      return "outline"
    case "Closed":
      return "destructive"
    default:
      return "outline"
  }
}

const getRequestStatusColor = (status: string) => {
  switch (status) {
    case "Quote Received":
      return "default"
    case "In Progress":
      return "secondary"
    case "Pending":
      return "outline"
    default:
      return "outline"
  }
}

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">Strategic organizing layer for cross-border trade execution</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <FolderKanban className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Project List */}
      <div className="space-y-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            {/* Project Header */}
            <CardHeader className="bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.id}</span>
                    <span>•</span>
                    <span>{project.region}</span>
                    <span>•</span>
                    <span>{project.sector}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/projects/${project.id}`}>
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Overview */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Overview</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Linked Requests */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Linked Requests</h4>
                  {project.linkedRequests.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Request</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Deadline</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {project.linkedRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-mono text-xs">{request.id}</TableCell>
                              <TableCell className="text-sm">{request.name}</TableCell>
                              <TableCell>
                                <Badge variant={getRequestStatusColor(request.status)} className="text-xs">
                                  {request.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-xs">{request.deadline}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center text-sm text-muted-foreground">
                      No linked requests yet
                    </div>
                  )}
                </div>

                {/* Compliance & Risk */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Compliance & Risk</h4>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">HS Code</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{project.compliance.hsCode}</span>
                        {project.compliance.hsVerified ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Licensing</span>
                      <span className="text-sm">{project.compliance.licensing}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sanctions</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{project.compliance.sanctions}</span>
                        {project.compliance.sanctions === "Clear" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {project.activity.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      {item.type === "message" ? (
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      ) : (
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
