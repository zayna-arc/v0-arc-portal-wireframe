import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tiers = [
  {
    name: "Business Builder",
    price: "$1,500/mo",
    points: [
      "3–5 day sourcing",
      "Vendor access & escrow for major orders",
      "Basic shipping & customs",
      "Bi-monthly advisor check-in",
      "Tax support, brand setup guidance",
    ],
  },
  {
    name: "Business Advantage",
    price: "$3,500/mo",
    points: [
      "Builder features + supplier screening & reports",
      "1 pre-shipment inspection / order",
      "Quarterly consulting",
      "Shipping & freight advisory",
    ],
  },
  {
    name: "Executive Advantage",
    price: "$6,000/mo",
    points: [
      "Advantage + 48-hour turnaround",
      "Priority U.S. suppliers",
      "Monthly strategy check-in",
      "Order prep (quotes/invoices/packing lists), inspection photos",
      "Morocco/Libya logistics support, optional escrow/order",
    ],
  },
  {
    name: "Almagharabia Elite",
    price: "$10,000/mo",
    points: [
      "<24h turnaround",
      "Full-service project mgmt (US purchase → port delivery)",
      "Dedicated strategy advisor + monthly consulting",
      "Feasibility reports, private/auction sourcing",
      "Freight & customs handled, escrow + invoice protection, VIP tracking",
    ],
    featured: true,
  },
]

export default function Membership() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Choose Your Membership</h1>
      <p className="text-muted-foreground mb-8">Wireframe pricing with inclusions.</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((t) => (
          <Card key={t.name} className={t.featured ? "border-brand-gold" : ""}>
            <CardHeader>
              {t.featured && <Badge className="w-fit mb-2">Recommended</Badge>}
              <CardTitle>{t.name}</CardTitle>
              <CardDescription>{t.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 list-disc pl-5">
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
