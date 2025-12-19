"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  FileText,
  Link,
  PenTool as Tool,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Lock,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { useDebounce } from "@/hooks/use-debounce"
import { resourcesStore } from "@/lib/resources/store"
import type { ResourceItem, ResourceFilters, ResourceType, Language, Region, FileFormat } from "@/lib/resources/types"

const typeIcons = {
  template: FileText,
  guide: BookOpen,
  regulatory: Link,
  tool: Tool,
  market_brief: TrendingUp,
}

const formatIcons = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: FileText,
  LINK: ExternalLink,
  TOOL: Tool,
}

const languageColors = {
  EN: "bg-blue-100 text-blue-800",
  FR: "bg-green-100 text-green-800",
  AR: "bg-purple-100 text-purple-800",
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ResourceType | "all">("all")
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set())
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [showAttachDialog, setShowAttachDialog] = useState(false)
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "up" | "down" | null; comment: string }>({ type: null, comment: "" })

  const [filters, setFilters] = useState<ResourceFilters>({
    search: "",
    topic: "all",
    region: "all",
    type: "all",
    language: "all",
    access: "all",
  })

  const debouncedSearch = useDebounce(filters.search, 300)

  // Mock user membership - in real app this would come from auth context
  const userMembership = "builder+" // "all" | "builder+" | "advantage+" | "executive+"

  const pinnedResources = useMemo(() => {
    return resourcesStore.getPinnedResources()
  }, [])

  const filteredResources = useMemo(() => {
    const baseResources =
      activeTab === "all" ? resourcesStore.getAllResources() : resourcesStore.getResourcesByType(activeTab)

    const currentFilters = { ...filters, search: debouncedSearch, topic: activeTab }
    return resourcesStore.filterResources(baseResources, currentFilters)
  }, [activeTab, debouncedSearch, filters])

  const myLibraryResources = useMemo(() => {
    return resourcesStore.getSavedResources()
  }, [savedResources])

  useEffect(() => {
    // Initialize saved resources
    const saved = new Set<string>()
    resourcesStore.getAllResources().forEach((resource) => {
      if (resourcesStore.isSaved(resource.id)) {
        saved.add(resource.id)
      }
    })
    setSavedResources(saved)
    setLoading(false)
  }, [])

  const handleSaveResource = async (resourceId: string) => {
    const isSaved = savedResources.has(resourceId)

    try {
      const response = await fetch("/api/resources/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          action: isSaved ? "unsave" : "save",
        }),
      })

      if (response.ok) {
        const newSaved = new Set(savedResources)
        if (isSaved) {
          newSaved.delete(resourceId)
        } else {
          newSaved.add(resourceId)
        }
        setSavedResources(newSaved)
      }
    } catch (error) {
      console.error("Failed to save/unsave resource:", error)
    }
  }

  const handleAttachResource = async (resourceId: string, requestId: string) => {
    try {
      const response = await fetch("/api/resources/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, requestId }),
      })

      if (response.ok) {
        setShowAttachDialog(false)
        // Show success message
      }
    } catch (error) {
      console.error("Failed to attach resource:", error)
    }
  }

  const handleResourceRequest = async (data: { title: string; need: string; deadline: string }) => {
    try {
      const response = await fetch("/api/resources/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setShowRequestDialog(false)
        // Show success message
      }
    } catch (error) {
      console.error("Failed to submit resource request:", error)
    }
  }

  const canAccessResource = (resource: ResourceItem): boolean => {
    const accessLevels = ["all", "builder+", "advantage+", "executive+"]
    const userLevel = accessLevels.indexOf(userMembership)
    const resourceLevel = accessLevels.indexOf(resource.access)
    return userLevel >= resourceLevel
  }

  const handleResourceClick = (resource: ResourceItem) => {
    if (!canAccessResource(resource)) {
      setShowUpgradeModal(true)
      return
    }

    resourcesStore.markAsViewed(resource.id)

    if (resource.format === "TOOL") {
      // Open tool in portal
      console.log(`Opening tool: ${resource.id}`)
    } else if (resource.url) {
      // Download or open external link
      window.open(resource.url, "_blank")
    }
  }

  const ResourceCard = ({ resource }: { resource: ResourceItem }) => {
    const TypeIcon = typeIcons[resource.type]
    const FormatIcon = formatIcons[resource.format]
    const isSaved = savedResources.has(resource.id)
    const canAccess = canAccessResource(resource)

    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardTitle className="text-sm font-medium line-clamp-1 cursor-help">{resource.title}</CardTitle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{resource.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {!canAccess && <Lock className="h-3 w-3 text-amber-500" />}
              <FormatIcon className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
          <CardDescription className="text-xs line-clamp-2 mt-1">{resource.description}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.languages.map((lang) => (
              <span key={lang} className={`text-xs px-2 py-0.5 rounded-full font-medium ${languageColors[lang]}`}>
                {lang}
              </span>
            ))}
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>Updated {new Date(resource.updatedAt).toLocaleDateString()}</span>
              {resource.fileSize && <span>{resource.fileSize}</span>}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={canAccess ? "default" : "secondary"}
                className="flex-1 text-xs h-8"
                onClick={() => handleResourceClick(resource)}
              >
                {resource.format === "TOOL" ? "Open" : resource.format === "LINK" ? "Visit" : "Download"}
              </Button>

              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleSaveResource(resource.id)}>
                {isSaved ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-blue-600" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setSelectedResource(resource)
                  setShowAttachDialog(true)
                }}
              >
                <Paperclip className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground text-balance">Templates, guides, and tools for international trade</p>
        </div>

        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request a Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Resource</DialogTitle>
              <DialogDescription>
                Tell us what resource you need and we'll work on creating it for you.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleResourceRequest({
                  title: formData.get("title") as string,
                  need: formData.get("need") as string,
                  deadline: formData.get("deadline") as string,
                })
              }}
            >
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Resource Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Morocco Import License Template" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="need">What do you need?</Label>
                  <Textarea
                    id="need"
                    name="need"
                    placeholder="Describe what you're looking for and how it would help your business..."
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">When do you need this?</Label>
                  <Input id="deadline" name="deadline" type="date" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowRequestDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources by title, tags, or content..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <Select
            value={filters.region}
            onValueChange={(value: Region | "all") => setFilters((prev) => ({ ...prev, region: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Morocco">Morocco</SelectItem>
              <SelectItem value="Algeria">Algeria</SelectItem>
              <SelectItem value="Tunisia">Tunisia</SelectItem>
              <SelectItem value="Mauritania">Mauritania</SelectItem>
              <SelectItem value="Libya">Libya</SelectItem>
              <SelectItem value="Turkey">Turkey</SelectItem>
              <SelectItem value="U.S.">U.S.</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(value: FileFormat | "all") => setFilters((prev) => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="DOCX">DOCX</SelectItem>
              <SelectItem value="XLSX">XLSX</SelectItem>
              <SelectItem value="LINK">Link</SelectItem>
              <SelectItem value="TOOL">Tool</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.language}
            onValueChange={(value: Language | "all") => setFilters((prev) => ({ ...prev, language: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="EN">English</SelectItem>
              <SelectItem value="FR">French</SelectItem>
              <SelectItem value="AR">Arabic</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.access}
            onValueChange={(value: "all" | "saved") => setFilters((prev) => ({ ...prev, access: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Access" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="saved">My Saved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pinned Resources */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Pinned by ARC</h2>
          <Badge variant="secondary">Curated</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pinnedResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ResourceType | "all")}>
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full lg:grid lg:grid-cols-6">
            <TabsTrigger value="all" className="flex-1 lg:flex-none">
              All
            </TabsTrigger>
            <TabsTrigger value="template" className="flex-1 lg:flex-none">
              Templates
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex-1 lg:flex-none">
              Guides
            </TabsTrigger>
            <TabsTrigger value="regulatory" className="flex-1 lg:flex-none">
              Regulatory
            </TabsTrigger>
            <TabsTrigger value="tool" className="flex-1 lg:flex-none">
              Tools
            </TabsTrigger>
            <TabsTrigger value="market_brief" className="flex-1 lg:flex-none">
              Market Briefs
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {filters.access === "saved" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">My Library ({myLibraryResources.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myLibraryResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
              {myLibraryResources.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No saved resources yet</p>
                  <p className="text-sm mt-1">Save resources to access them quickly later</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{filteredResources.length} resources found</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
              {filteredResources.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No resources found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">Did this help?</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={feedback.type === "up" ? "default" : "outline"}
              onClick={() => setFeedback((prev) => ({ ...prev, type: prev.type === "up" ? null : "up" }))}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={feedback.type === "down" ? "default" : "outline"}
              onClick={() => setFeedback((prev) => ({ ...prev, type: prev.type === "down" ? null : "down" }))}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> These resources provide general guidance and are not legal advice. Always
            consult with qualified professionals for specific situations.
          </p>
        </div>
      </div>

      {/* Attach to Request Dialog */}
      <Dialog open={showAttachDialog} onOpenChange={setShowAttachDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach to Request</DialogTitle>
            <DialogDescription>Select a request to attach "{selectedResource?.title}" to.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Request</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a request..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="req-1">Machinery Import - Morocco</SelectItem>
                  <SelectItem value="req-2">Textile Sourcing - Tunisia</SelectItem>
                  <SelectItem value="req-3">Food Products - Algeria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAttachDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleAttachResource(selectedResource?.id || "", "req-1")}>Attach Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Required</DialogTitle>
            <DialogDescription>This resource requires a higher membership tier to access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm leading-relaxed">
              Upgrade your membership to access premium resources, advanced tools, and exclusive market insights.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1">Upgrade Now</Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowUpgradeModal(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
