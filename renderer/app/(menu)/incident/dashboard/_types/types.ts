export interface DailyPoint {
  date: string
  count: number
  cumulative: number
}

export interface PeakDay {
  date: string
  count: number
}

export interface TypeCount {
  type: string
  count: number
}

export interface DashboardData {
  daily: DailyPoint[]
  total: number
  totalDays: number
  averagePerDay: number
  peak: PeakDay | null
  byType: TypeCount[]
}

export type TimeRange = "all" | "30d" | "7d"

export interface IncidentDashboardProps {
  data: DashboardData
}
