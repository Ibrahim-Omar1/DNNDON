'use client'

import {
  ChevronRight,
  type LucideIcon
} from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import Link from 'next/link'

export interface NavItem {
  title?: string
  name?: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

interface NavProps {
  items: (NavItem | NavItem[])[]
  hideProjectsOnCollapse?: boolean
}

export function Nav({ items, hideProjectsOnCollapse = false }: NavProps) {
  // const { isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.flat().map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          const displayName = item.title || item.name
          const isProject = !item.items // Projects don't have sub-items

          if (hasSubItems) {
            return (
              <Collapsible
                key={displayName}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={displayName}>
                      {item.icon && <item.icon />}
                      <span>{displayName}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem
              key={displayName}
              className={
                isProject && hideProjectsOnCollapse ? 'group-data-[collapsible=icon]:hidden' : ''
              }
            >
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{displayName}</span>
                </Link>
              </SidebarMenuButton>
              {/* {isProject && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )} */}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
