'use client'

import { Bell, Home } from 'lucide-react'
import * as React from 'react'

import { Nav, NavItem } from '@/components/sidebar/nav'
import { NavUser } from '@/components/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { TeamSwitcher } from './team-switcher'

// This is sample data.
const navigationItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Notifications ( CSR )',
    url: '/notifications',
    icon: Bell,
    // isActive: false,
  },
  // {
  //   title: 'Notifications ( SSR )',
  //   url: '/notifications/ssr',
  //   icon: Bell,
  //   // isActive: false,
  // },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <Nav items={navigationItems} hideProjectsOnCollapse />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
