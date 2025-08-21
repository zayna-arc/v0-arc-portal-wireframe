"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const GOLD = "#CBB26A"
const NAVY = "#0D1335"

const sectors = [
  { label: "Agriculture & Machinery", href: "/sectors/agriculture" },
  { label: "Security & Transportation", href: "/sectors/security-transport" },
  { label: "Mining & Construction", href: "/sectors/mining-construction" },
  { label: "Trade & Logistics", href: "/sectors/trade-logistics" },
]

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative pb-1 font-medium text-slate-800 hover:text-slate-900" style={{ color: NAVY }}>
      <span className="group inline-block">
        <span className="relative">
          {children}
          <span
            className="absolute left-0 -bottom-0.5 block h-0.5 w-0 transition-all group-hover:w-full"
            style={{ backgroundColor: GOLD }}
            aria-hidden="true"
          />
        </span>
      </span>
    </Link>
  )
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="Almagharabia logo"
              width={32}
              height={32}
              className="rounded"
              priority
            />
            <span className="sr-only">Almagharabia Regional Commerce</span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-2 hidden items-center gap-6 md:flex">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/sourcing">Sourcing</NavLink>
            <NavLink href="/services">Services</NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 pb-1 font-medium text-slate-800 outline-none transition hover:text-slate-900">
                <span className="relative group">
                  <span className="relative">
                    Sectors
                    <span
                      className="absolute left-0 -bottom-0.5 block h-0.5 w-0 transition-all group-hover:w-full"
                      style={{ backgroundColor: GOLD }}
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-64">
                {sectors.map((s) => (
                  <DropdownMenuItem key={s.href} asChild>
                    <Link href={s.href}>{s.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink href="/insights">Insights</NavLink>
            <NavLink href="/contact">Contact Us</NavLink>
          </nav>
        </div>

        {/* Right: CTA */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="md:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid gap-3">
                <Link href="/about" className="py-1 font-medium">
                  About
                </Link>
                <Link href="/sourcing" className="py-1 font-medium">
                  Sourcing
                </Link>
                <Link href="/services" className="py-1 font-medium">
                  Services
                </Link>
                <div className="pt-2 text-xs font-semibold uppercase text-muted-foreground">Sectors</div>
                <div className="grid gap-2">
                  {sectors.map((s) => (
                    <Link key={s.href} href={s.href} className="text-sm">
                      {s.label}
                    </Link>
                  ))}
                </div>
                <Link href="/insights" className="py-1 font-medium">
                  Insights
                </Link>
                <Link href="/contact" className="py-1 font-medium">
                  Contact Us
                </Link>
                <Button
                  asChild
                  className="mt-3 w-full font-semibold"
                  style={{ backgroundColor: GOLD, color: "#1f2937" }}
                >
                  <Link href="/quote">Request A Quote</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop CTA */}
          <Button
            asChild
            className="hidden font-semibold md:inline-flex hover:brightness-95"
            style={{ backgroundColor: GOLD, color: "#1f2937" }}
          >
            <Link href="/quote">Request A Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
