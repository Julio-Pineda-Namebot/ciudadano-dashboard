'use server'

import { getIncidentReports } from '../incident-report/actions'

export interface DailyPoint {
  date: string
  count: number
  cumulative: number
}

export interface DashboardData {
  daily: DailyPoint[]
  total: number
  totalDays: number
  averagePerDay: number
  peak: { date: string; count: number } | null
  byType: { type: string; count: number }[]
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10)
}

export async function getDashboardData(): Promise<DashboardData> {
  const reports = await getIncidentReports()

  if (reports.length === 0) {
    return { daily: [], total: 0, totalDays: 0, averagePerDay: 0, peak: null, byType: [] }
  }

  const countsByDate = new Map<string, number>()
  const countsByType = new Map<string, number>()

  for (const r of reports) {
    const key = toDateKey(r.createdAt)
    countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1)
    countsByType.set(r.incidentType, (countsByType.get(r.incidentType) ?? 0) + 1)
  }

  const sortedKeys = [...countsByDate.keys()].sort()
  const first = new Date(sortedKeys[0])
  const last = new Date(sortedKeys[sortedKeys.length - 1])

  const daily: DailyPoint[] = []
  let cumulative = 0
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    const count = countsByDate.get(key) ?? 0
    cumulative += count
    daily.push({ date: key, count, cumulative })
  }

  const peak = daily.reduce<{ date: string; count: number } | null>(
    (acc, p) => (p.count > 0 && (!acc || p.count > acc.count) ? { date: p.date, count: p.count } : acc),
    null,
  )

  const byType = [...countsByType.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  return {
    daily,
    total: reports.length,
    totalDays: daily.length,
    averagePerDay: reports.length / Math.max(daily.length, 1),
    peak,
    byType,
  }
}
