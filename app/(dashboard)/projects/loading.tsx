import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Project Cards Skeleton */}
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="bg-muted/30">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-96" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
