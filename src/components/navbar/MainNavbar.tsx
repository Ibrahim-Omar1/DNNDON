'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

const MainNavbar = () => {
  const pathname = usePathname()
  const pathnameParts = pathname.split('/').filter(Boolean)

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border bg-white">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home className="w-4 h-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathnameParts.map((part, index) => {
              const href = `/${pathnameParts.slice(0, index + 1).join('/')}`
              const isLast = index === pathnameParts.length - 1

              return (
                <Fragment key={href}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem key={href}>
                    {isLast ? (
                      <BreadcrumbPage>
                        {part.charAt(0).toUpperCase() + part.slice(1)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{part.charAt(0).toUpperCase() + part.slice(1)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

export default MainNavbar
