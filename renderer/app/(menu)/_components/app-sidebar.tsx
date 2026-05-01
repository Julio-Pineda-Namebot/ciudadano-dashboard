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
import { TerminalSquareIcon, ShieldCog, Newspaper } from "lucide-react"

const incidentsItem = {
  title: "Incidencias",
  url: "#",
  icon: <TerminalSquareIcon />,
  items: [
    { title: "Dashboard", url: "/incident/dashboard" },
    { title: "Mapa de Calor", url: "/incident/heatmap" },
    { title: "Ver reportes", url: "/incident/incident-report" },
  ],
}

const newsItem = {
  title: "Noticias",
  url: "/news",
  icon: <Newspaper />,
}

const securityItem = {
  title: "Seguridad",
  url: "#",
  icon: <ShieldCog />,
  items: [
    { title: "Grupos", url: "#" },
    { title: "Usuarios web", url: "#" },
    { title: "Configuración", url: "#" },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const profile = useAuth()
  const isSuperAdmin = useIsSuperAdmin()

  const navMain = isSuperAdmin ? [incidentsItem, newsItem, securityItem] : [incidentsItem, newsItem]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/menu">
                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src="/favicon.ico"
                    alt="Ciudadano"
                    width={22}
                    height={22}
                    className="size-7 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
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
