"use client"

import * as React from "react"
import Image from "next/image"
import { NavMain } from "@/app/(menu)/_components/NavMain"
import { useIsSuperAdmin } from "@/app/(menu)/_components/AuthProvider"
import { HelpTour } from "@/app/(menu)/_components/HelpTour"
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
  Users, Camera, ScrollText, Settings, UserRound, Siren,
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
  icon: <TerminalSquareIcon />,
  tourId: "nav-incidencias",
  items: [
    { title: "Dashboard",    url: "/incident/dashboard",       icon: <BarChart2    className="size-4" />, tourId: "nav-incident-dashboard" },
    { title: "Mapa de Calor",url: "/incident/heatmap",         icon: <MapPin       className="size-4" />, tourId: "nav-incident-heatmap"   },
    { title: "Ver reportes", url: "/incident/incident-report", icon: <ClipboardList className="size-4" />, tourId: "nav-incident-report"    },
  ],
}

const alertsItem = {
  title: "Alertas de pánico",
  url: "/alerts",
  icon: <Siren />,
  tourId: "nav-alertas",
}

const newsItem = {
  title: "Noticias",
  url: "/news",
  icon: <Newspaper />,
  tourId: "nav-noticias",
}

const citizensItem = {
  title: "Ciudadanos",
  url: "/citizens",
  icon: <UserRound />,
  tourId: "nav-ciudadanos",
}

const securityItem = {
  title: "Seguridad",
  url: "#",
  icon: <ShieldCog />,
  tourId: "nav-seguridad",
  items: [
    { title: "Grupos",            url: "/security/groups",        icon: <Users      className="size-4" />, tourId: "nav-seguridad-grupos"   },
    { title: "Personal web",      url: "/security/web-staff",     icon: <ShieldCog  className="size-4" />, tourId: "nav-seguridad-usuarios" },
    { title: "Cámaras",           url: "/security/cameras",       icon: <Camera     className="size-4" />, tourId: "nav-seguridad-camaras"  },
    { title: "Logs de auditoría", url: "/security/audit-logs",    icon: <ScrollText className="size-4" />, tourId: "nav-seguridad-audit"    },
    { title: "Configuración",     url: "#",                        icon: <Settings   className="size-4" />                                   },
  ],
}

const TOUR_SEEN_KEY = "ciudadano_tour_seen"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isSuperAdmin = useIsSuperAdmin()
  const [tourActive, setTourActive] = React.useState(
    () => typeof window !== 'undefined' && !localStorage.getItem(TOUR_SEEN_KEY)
  )
  const navMain = isSuperAdmin
    ? [dashboardItem, incidentsItem, alertsItem, newsItem, citizensItem, securityItem]
    : [dashboardItem, incidentsItem, alertsItem, newsItem, citizensItem]

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

      <HelpTour
        active={tourActive}
        onDone={() => {
          localStorage.setItem(TOUR_SEEN_KEY, "1")
          setTourActive(false)
        }}
      />
    </>
  )
}
