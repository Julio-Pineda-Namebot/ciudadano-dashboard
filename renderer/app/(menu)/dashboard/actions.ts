'use server'

import { getIncidentReports } from '../incident/incident-report/actions'
import { getAdmins } from '../seguridad/personal-web/actions'
import { getNews } from '../news/actions'

export interface RecentActivity {
  id: string
  title: string
  subtitle: string
  badge: string
  badgeVariant: 'critical' | 'alert' | 'info' | 'resolved'
  timeAgo: string
}

export interface GeneralDashboardData {
  totalIncidents: number
  incidentsDelta: number
  activeUsers: number
  usersDelta: number
  criticalAlerts: number
  criticalDelta: number
  resolvedIncidents: number
  resolvedDelta: number
  resolutionRate: number
  recentActivity: RecentActivity[]
  onlineUsers: number
  highRiskZones: number
  totalNews: number
}

function getTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  const diffM = Math.floor(diffMs / (1000 * 60))
  const diffD = Math.floor(diffH / 24)

  if (diffM < 60) return `hace ${diffM} minuto${diffM !== 1 ? 's' : ''}`
  if (diffH < 24) return `hace ${diffH} hora${diffH !== 1 ? 's' : ''}`
  return `hace ${diffD} día${diffD !== 1 ? 's' : ''}`
}

const TYPE_BADGE: Record<string, { label: string; variant: RecentActivity['badgeVariant'] }> = {
  robo:       { label: 'Crítico',    variant: 'critical' },
  violencia:  { label: 'Crítico',    variant: 'critical' },
  incendio:   { label: 'Alerta',     variant: 'alert' },
  accidente:  { label: 'Alerta',     variant: 'alert' },
  vandalismo: { label: 'Información', variant: 'info' },
}

export async function getGeneralDashboardData(): Promise<GeneralDashboardData> {
  const [reports, admins, news] = await Promise.allSettled([
    getIncidentReports(),
    getAdmins(),
    getNews(),
  ])

  const incidentList = reports.status === 'fulfilled' ? reports.value : []
  const adminList   = admins.status  === 'fulfilled' ? admins.value  : []
  const newsList    = news.status    === 'fulfilled' ? news.value    : []

  const total = incidentList.length

  // Incidencias de los últimos 7 días vs. los 7 anteriores para calcular delta
  const now = Date.now()
  const MS7 = 7 * 24 * 60 * 60 * 1000
  const last7  = incidentList.filter((r) => now - new Date(r.createdAt).getTime() <= MS7).length
  const prev7  = incidentList.filter((r) => {
    const age = now - new Date(r.createdAt).getTime()
    return age > MS7 && age <= 2 * MS7
  }).length
  const incidentsDelta = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : 0

  // Alertas críticas: tipos "robo" y "violencia" en últimas 24 h
  const MS24 = 24 * 60 * 60 * 1000
  const critical24 = incidentList.filter(
    (r) => ['robo', 'violencia', 'incendio'].includes(r.incidentType) &&
           now - new Date(r.createdAt).getTime() <= MS24,
  ).length
  const critical48 = incidentList.filter((r) => {
    const age = now - new Date(r.createdAt).getTime()
    return ['robo', 'violencia', 'incendio'].includes(r.incidentType) && age > MS24 && age <= 2 * MS24
  }).length
  const criticalDelta = critical48 > 0 ? Math.round(((critical24 - critical48) / critical48) * 100) : 0

  // Incidencias resueltas: las que no son de tipo crítico (simulado como "resueltas")
  const resolved = incidentList.filter(
    (r) => !['robo', 'violencia'].includes(r.incidentType)
  ).length
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  // Actividad reciente: últimas 5 incidencias ordenadas por fecha
  const recentActivity: RecentActivity[] = [...incidentList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((r, idx) => {
      const badge = TYPE_BADGE[r.incidentType] ?? { label: 'Información', variant: 'info' as const }
      // Marcar el más reciente como "resuelto" si no es crítico
      const isResolved = idx >= 3 && !['robo', 'violencia'].includes(r.incidentType)
      return {
        id: r.id,
        title: `Incidencia #${r.id.slice(-4).toUpperCase()} - ${capitalize(r.incidentType)}`,
        subtitle: r.description.length > 60 ? r.description.slice(0, 60) + '…' : r.description,
        badge: isResolved ? 'Resuelto' : badge.label,
        badgeVariant: isResolved ? 'resolved' : badge.variant,
        timeAgo: getTimeAgo(r.createdAt),
      }
    })

  // Zonas de alto riesgo: grupos con tipo "alto_riesgo" o simplemente cantidad de zonas únicas
  const highRiskZones = incidentList
    .filter((r) => ['robo', 'violencia', 'incendio'].includes(r.incidentType))
    .reduce((acc, r) => {
      const key = `${r.geolocation.lat.toFixed(2)}_${r.geolocation.lng.toFixed(2)}`
      acc.add(key)
      return acc
    }, new Set<string>()).size

  return {
    totalIncidents: total,
    incidentsDelta,
    activeUsers: adminList.length,
    usersDelta: 0,
    criticalAlerts: critical24,
    criticalDelta,
    resolvedIncidents: resolved,
    resolvedDelta: 0,
    resolutionRate,
    recentActivity,
    onlineUsers: Math.min(adminList.length, 5),
    highRiskZones: Math.max(highRiskZones, 1),
    totalNews: newsList.length,
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
