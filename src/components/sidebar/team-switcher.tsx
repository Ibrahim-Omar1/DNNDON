import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import Image from 'next/image'

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="mx-auto">
            <Image
              src="https://dnndon.net/assets/images/dnndon_logo.svg"
              alt="dnndon logo"
              width={150}
              height={0}
              className="h-[30px] w-auto group-data-[collapsible=icon]:hidden"
            />
            <p className="font-bold text-3xl text-primary-green uppercase group-data-[collapsible=icon]:block hidden">
              D
            </p>
          </div>
          {/* <ChevronsUpDown className="ml-auto" /> */}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
