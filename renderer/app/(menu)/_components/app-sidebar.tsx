"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/app/(menu)/_components/nav-main"
import { NavUser } from "@/app/(menu)/_components/nav-user"
import { useAuth, useIsSuperAdmin } from "@/app/(menu)/_components/auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon, ShieldCog } from "lucide-react"

const playgroundItem = {
  title: "Playground",
  url: "#",
  icon: <TerminalSquareIcon />,
  isActive: true,
  items: [
    { title: "Mapa de Incidentes", url: "/HeatMap" },
    { title: "Starred", url: "#" },
    { title: "Settings", url: "#" },
  ],
}

const securityItem = {
  title: "Seguridad",
  url: "#",
  icon: <ShieldCog />,
  isActive: true,
  items: [
    { title: "Grupos", url: "#" },
    { title: "Administrar Admins", url: "#" },
    { title: "Configuración", url: "#" },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const profile = useAuth()
  const isSuperAdmin = useIsSuperAdmin()

  const navMain = isSuperAdmin ? [playgroundItem, securityItem] : [playgroundItem]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src="/favicon.ico"
                    alt="Ciudadano"
                    width={22}
                    height={22}
                    className="size-7 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Ciudadano</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
