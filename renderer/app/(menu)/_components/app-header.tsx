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
import { useBreadcrumb } from './breadcrumb-context'
import { Fragment } from 'react'

export function AppHeader() {
  const { items } = useBreadcrumb()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        {items.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {items.map((item, index) => {
                const isLast = index === items.length - 1
                return (
                  <Fragment key={index}>
                    <BreadcrumbItem className="hidden md:block">
                      {isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href ?? '#'}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
    </header>
  )
}
