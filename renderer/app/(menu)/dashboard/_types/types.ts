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

export interface GeneralDashboardClientProps {
  data: GeneralDashboardData
}
