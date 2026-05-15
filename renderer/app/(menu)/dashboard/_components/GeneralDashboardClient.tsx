"use client"

import { AlertTriangle, CheckCircle2, Info, Users, AlertOctagon, ShieldAlert, Clock, Wifi, MapPin } from "lucide-react"
import { MetricCard, SummaryRow } from '@/components/common/dashboard-cards'
import type { GeneralDashboardData } from "../actions"

interface Props {
  data: GeneralDashboardData
}

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

export function GeneralDashboardClient({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Tarjetas de métricas */}
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

      {/* Actividad reciente + Resumen */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Actividad Reciente */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-1">
            <h2 className="font-semibold text-card-foreground">Actividad Reciente</h2>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </div>

          {data.recentActivity.length === 0 ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sin actividad reciente.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
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
        </div>

        {/* Resumen */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-semibold text-card-foreground">Resumen</h2>

          <div className="mt-4 space-y-5">
            {/* Tasa de resolución */}
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

            {/* Tiempo promedio de respuesta */}
            <SummaryRow
              icon={<Clock className="size-4 text-sky-400" />}
              label="Tiempo prom. de respuesta"
              value="N/D"
              valueColor="text-sky-400"
            />

            {/* Usuarios en línea */}
            <SummaryRow
              icon={<Wifi className="size-4 text-yellow-400" />}
              label="Usuarios en línea"
              value={data.onlineUsers.toString()}
              valueColor="text-yellow-400"
            />

            {/* Zonas de alto riesgo */}
            <SummaryRow
              icon={<MapPin className="size-4 text-red-400" />}
              label="Zonas de alto riesgo"
              value={data.highRiskZones.toString()}
              valueColor="text-red-400"
            />

            {/* Noticias publicadas */}
            <SummaryRow
              icon={<Info className="size-4 text-muted-foreground" />}
              label="Noticias publicadas"
              value={data.totalNews.toString()}
              valueColor="text-card-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

