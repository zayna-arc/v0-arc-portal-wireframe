import Link from "next/link"
import { redirect } from "next/navigation"
import { SiteNav } from "@/components/site-nav"
import { DashboardPreview } from "@/components/dashboard-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Shield, Truck, Users, FileText } from "lucide-react"

const GOLD = "#CBB26A"
const NAVY = "#0D1335"

export default function HomePage() {
  redirect("/dashboard")

  return (
    <main className="min-h-screen">
      <SiteNav />

      {/* Hero */}
      <section className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols-2">
          {/* Left: copy */}
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Almagharabia Regional Commerce</h1>
            <p className="mt-4 text-white/85">
              A modern, secure portal to source, ship, and manage U.S.–Maghreb trade with verified suppliers and expert
              logistics support.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="rounded-md px-5 text-sm font-semibold text-slate-900 hover:brightness-95"
                style={{ backgroundColor: GOLD }}
              >
                <Link href="/onboarding">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-white/40 bg-transparent text-white hover:bg-white/10">
                <Link href="/membership">Explore Memberships</Link>
              </Button>
            </div>
          </div>

          {/* Right: dashboard preview */}
          <div className="rounded-lg border border-white/10 bg-white p-4 text-slate-900 shadow-sm">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Below Hero: Feature links */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Membership",
              desc: "Plans and benefits",
              href: "/membership",
              icon: Users,
            },
            {
              title: "Sourcing Requests",
              desc: "Create and track requests",
              href: "/dashboard/requests",
              icon: FileText,
            },
            {
              title: "Logistics & Compliance",
              desc: "Docs, templates, and tracking",
              href: "/dashboard/logistics",
              icon: Shield,
            },
            {
              title: "Resources",
              desc: "Guides and sector links",
              href: "/dashboard/resources",
              icon: Truck,
            },
          ].map((f) => (
            <Link key={f.title} href={f.href} className="group">
              <Card className="transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                <CardHeader className="pb-2">
                  <f.icon className="mb-1 h-6 w-6 text-slate-600" />
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span
                    className="inline-block h-0.5 w-10 rounded transition-all group-hover:w-16"
                    style={{ backgroundColor: GOLD }}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
