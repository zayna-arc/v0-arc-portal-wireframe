"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Search,
  Package,
  Truck,
  FileText,
  MessageSquare,
  User,
  BookOpen,
  Settings,
  Menu,
  X,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Sourcing Requests", href: "/dashboard/requests", icon: Search },
  { name: "Special Orders", href: "/dashboard/special-orders", icon: Package },
  { name: "Logistics & Compliance", href: "/dashboard/logistics", icon: Truck },
  { name: "Invoices & Payments", href: "/dashboard/invoices", icon: FileText },
  { name: "Messages & Updates", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Account & Team", href: "/dashboard/account", icon: User },
  { name: "Resources", href: "/dashboard/resources", icon: BookOpen },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <div className="w-8 h-8 bg-blue-600 rounded mr-3"></div>
            <span className="text-xl font-bold">ARC Portal</span>
          </div>

          {/* Create Request CTA */}
          <div className="p-4">
            <Button className="w-full" asChild>
              <Link href="/dashboard/requests/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </Link>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {item.name === "Messages & Updates" && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      3
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Sarah Ahmed</div>
                <div className="text-xs text-gray-600">Business Builder</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
