"use client"

import * as React from "react"
import Image from "next/image"
import { NavMain } from "@/app/(menu)/_components/nav-main"
import { useIsSuperAdmin } from "@/app/(menu)/_components/auth-provider"
import { HelpTour } from "@/app/(menu)/_components/help-tour"
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
import {
  TerminalSquareIcon, ShieldCog, Newspaper, CircleHelpIcon,
  MapPin, ClipboardList, BarChart2, LayoutDashboard,
  Users, Camera, ScrollText, Settings, UserRound,
} from "lucide-react"

const dashboardItem = {
  title: "Dashboard General",
  url: "/dashboard",
  icon: <LayoutDashboard />,
  tourId: "nav-dashboard-general",
}

const incidentsItem = {
  title: "Incidencias",
  url: "#",
  icon: <TerminalSquareIcon className="text-orange-500" />,
  tourId: "nav-incidencias",
  items: [
    { title: "Dashboard",    url: "/incident/dashboard",       icon: <BarChart2    className="size-4 text-orange-500" />, tourId: "nav-incident-dashboard" },
    { title: "Mapa de Calor",url: "/incident/heatmap",         icon: <MapPin       className="size-4 text-orange-500" />, tourId: "nav-incident-heatmap"   },
    { title: "Ver reportes", url: "/incident/incident-report", icon: <ClipboardList className="size-4 text-orange-500" />, tourId: "nav-incident-report"    },
  ],
}

const newsItem = {
  title: "Noticias",
  url: "/news",
  icon: <Newspaper />,
  tourId: "nav-noticias",
}

const citizensItem = {
  title: "Ciudadanos",
  url: "/ciudadanos",
  icon: <UserRound />,
  tourId: "nav-ciudadanos",
}

const securityItem = {
  title: "Seguridad",
  url: "#",
  icon: <ShieldCog className="text-blue-500" />,
  tourId: "nav-seguridad",
  items: [
    { title: "Grupos",            url: "/seguridad/grupos",        icon: <Users      className="size-4 text-blue-500" />, tourId: "nav-seguridad-grupos"   },
    { title: "Personal web",      url: "/seguridad/personal-web",  icon: <ShieldCog  className="size-4 text-blue-500" />, tourId: "nav-seguridad-usuarios" },
    { title: "Cámaras",           url: "/seguridad/camaras",       icon: <Camera     className="size-4 text-blue-500" />, tourId: "nav-seguridad-camaras"  },
    { title: "Logs de auditoría", url: "/seguridad/audit-logs",    icon: <ScrollText className="size-4 text-blue-500" />, tourId: "nav-seguridad-audit"    },
    { title: "Configuración",     url: "#",                        icon: <Settings   className="size-4 text-blue-500" />                                    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isSuperAdmin = useIsSuperAdmin()
  const [tourActive, setTourActive] = React.useState(false)

  const navMain = isSuperAdmin
    ? [dashboardItem, incidentsItem, newsItem, citizensItem, securityItem]
    : [dashboardItem, incidentsItem, newsItem, citizensItem]

  return (
    <>
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
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setTourActive(true)}
                tooltip="Ayuda"
              >
                <CircleHelpIcon />
                <span>Ayuda</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <HelpTour active={tourActive} onDone={() => setTourActive(false)} />
    </>
  )
}
