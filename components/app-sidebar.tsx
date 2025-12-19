"use client"

import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Home,
  FolderKanban,
  Search,
  Package,
  Truck,
  FileText,
  MessageSquare,
  Users,
  BookOpen,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { LanguageToggle } from "./language-toggle"
import { messagesStore } from "@/lib/messages/store"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Sourcing Requests", url: "/sourcing-requests", icon: Search },
  { title: "Special Orders", url: "/dashboard/special-orders", icon: Package },
  { title: "Logistics & Compliance", url: "/dashboard/logistics-compliance", icon: Truck },
  { title: "Invoices & Payments", url: "/dashboard/invoices-payments", icon: FileText },
  { title: "Messages & Updates", url: "/messages", icon: MessageSquare, showBadge: true },
  { title: "Resources", url: "/resources", icon: BookOpen },
  { title: "Account & Team", url: "/account-team", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const updateUnreadCount = () => {
      setUnreadCount(messagesStore.getTotalUnread())
    }

    updateUnreadCount()

    const interval = setInterval(updateUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-8 w-8 rounded-full bg-brand-gold border border-brand-navy" />
          <div>
            <div className="font-semibold">ARC Portal</div>
            <div className="text-xs tagline">Your gateway to U.S.–Maghreb trade</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.showBadge && unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto text-xs h-5">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between px-2 py-2">
          <LanguageToggle />
          <span className="text-xs text-muted-foreground">v0 wireframe</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
