import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const GOLD = "#CBB26A"
const NAVY = "#0D1335"

const stats = [
  { label: "Active Requests", value: 7 },
  { label: "In Shipping", value: 3 },
  { label: "Delivered", value: 18 },
]

const recent = [
  { id: "REQ-1045", category: "Vehicles", status: "Reviewing" },
  { id: "REQ-1044", category: "Machinery", status: "Quoting" },
  { id: "REQ-1043", category: "Logistics", status: "Negotiating" },
  { id: "REQ-1042", category: "Vehicles", status: "Shipping" },
]

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    Reviewing: { bg: "bg-slate-100", fg: "text-slate-700" },
    Quoting: { bg: "bg-amber-100", fg: "text-amber-800" },
    Negotiating: { bg: "bg-blue-100", fg: "text-blue-800" },
    Shipping: { bg: "bg-indigo-100", fg: "text-indigo-800" },
    Delivered: { bg: "bg-emerald-100", fg: "text-emerald-800" },
  }
  const c = map[status] ?? map.Reviewing
  return <span className={`rounded px-2 py-0.5 text-xs ${c.bg} ${c.fg}`}>{status}</span>
}

export function DashboardPreview() {
  return (
    <div className="grid gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Tier card + Recent requests */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <Badge className="w-fit" style={{ backgroundColor: GOLD, color: "#111827" }}>
              Executive Advantage
            </Badge>
            <CardTitle className="mt-1 text-lg" style={{ color: NAVY }}>
              Priority Turnaround: 48 hours
            </CardTitle>
            <CardDescription>Benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm text-slate-700">
              <li>• Priority U.S. supplier access</li>
              <li>• Monthly strategy check-in</li>
              <li>• Custom order prep (quotes, invoices, packing lists)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: NAVY }}>
              Recent Requests
            </CardTitle>
            <CardDescription>Latest activity across your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded border p-2 hover:bg-slate-50">
                  <div>
                    <div className="text-sm font-medium">{r.id}</div>
                    <div className="text-xs text-slate-500">{r.category}</div>
                  </div>
                  <StatusChip status={r.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
