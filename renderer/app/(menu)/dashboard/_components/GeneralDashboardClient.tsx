"use client"

import { AlertTriangle, CheckCircle2, Info, Users, AlertOctagon, ShieldAlert, Clock, Wifi, MapPin } from "lucide-react"
import { MetricCard, SummaryRow } from "@/components/common/dashboard-cards"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { GeneralDashboardClientProps } from "@/app/(menu)/dashboard/_types/types"

const BADGE_STYLES: Record<string, string> = {
  critical: "bg-red-500 text-white",
  alert:    "bg-amber-500 text-white",
  info:     "bg-sky-500 text-white",
  resolved: "bg-emerald-500 text-white",
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  critical: <AlertOctagon className="size-3" />,
  alert:    <AlertTriangle className="size-3" />,
  info:     <Info className="size-3" />,
  resolved: <CheckCircle2 className="size-3" />,
}

export function GeneralDashboardClient({ data }: GeneralDashboardClientProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Incidencias Totales"
          value={data.totalIncidents.toLocaleString()}
          delta={data.incidentsDelta}
          icon={<AlertTriangle className="size-5" />}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-500"
        />
        <MetricCard
          label="Usuarios Activos"
          value={data.activeUsers.toLocaleString()}
          delta={data.usersDelta}
          icon={<Users className="size-5" />}
          iconBg="bg-sky-500/15"
          iconColor="text-sky-500"
        />
        <MetricCard
          label="Alertas Críticas"
          value={data.criticalAlerts.toLocaleString()}
          delta={data.criticalDelta}
          icon={<ShieldAlert className="size-5" />}
          iconBg="bg-red-500/15"
          iconColor="text-red-500"
          invertDelta
        />
        <MetricCard
          label="Incidencias Resueltas"
          value={data.resolvedIncidents.toLocaleString()}
          delta={data.resolvedDelta}
          icon={<CheckCircle2 className="size-5" />}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas 24 horas</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentActivity.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Sin actividad reciente.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {data.recentActivity.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-card-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.timeAgo}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        BADGE_STYLES[item.badgeVariant] ?? BADGE_STYLES.info
                      }`}
                    >
                      {BADGE_ICONS[item.badgeVariant]}
                      {item.badge}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Tasa de resolución</span>
                <span className="font-semibold text-emerald-500">{data.resolutionRate}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${data.resolutionRate}%` }}
                />
              </div>
            </div>
            <SummaryRow
              icon={<Clock className="size-4 text-sky-400" />}
              label="Tiempo prom. de respuesta"
              value="N/D"
              valueColor="text-sky-400"
            />
            <SummaryRow
              icon={<Wifi className="size-4 text-yellow-400" />}
              label="Usuarios en línea"
              value={data.onlineUsers.toString()}
              valueColor="text-yellow-400"
            />
            <SummaryRow
              icon={<MapPin className="size-4 text-red-400" />}
              label="Zonas de alto riesgo"
              value={data.highRiskZones.toString()}
              valueColor="text-red-400"
            />
            <SummaryRow
              icon={<Info className="size-4 text-muted-foreground" />}
              label="Noticias publicadas"
              value={data.totalNews.toString()}
              valueColor="text-card-foreground"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
