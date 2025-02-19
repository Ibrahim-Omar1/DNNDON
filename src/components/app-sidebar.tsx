"use client"

import {
  Bell,
  ChartSpline,
  Home
} from "lucide-react"
import * as React from "react"

import { Nav, NavItem } from "@/components/nav"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"

// This is sample data.
const navigationItems: NavItem[] = [{
  title: "Home",
  url: "/",
  icon: Home,
  isActive: true,
},
{
  title: "Analytics",
  url: "/analytics",
  icon: ChartSpline,
  isActive: false,
  items: [
    {
      title: "Overview",
      url: "/analytics",
    },
    {
      title: "Starred",
      url: "/analytics/starred",
    },
    {
      title: "Settings",
      url: "/analytics/settings",
    },
  ],
},
{
  title: "Notifications",
  url: "/notifications",
  icon: Bell,
  isActive: false,
},

]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <Nav
          items={navigationItems}
          hideProjectsOnCollapse
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
