import type { ReactNode } from 'react'

export function MetricCard({
  label,
  value,
  delta,
  icon,
  iconBg,
  iconColor,
  invertDelta = false,
}: {
  label: string
  value: string
  delta: number
  icon: ReactNode
  iconBg: string
  iconColor: string
  invertDelta?: boolean
}) {
  const isPositive = invertDelta ? delta < 0 : delta > 0
  const isNeutral = delta === 0
  const deltaColor = isNeutral
    ? 'text-muted-foreground'
    : isPositive
      ? 'text-emerald-500'
      : 'text-red-500'
  const deltaPrefix = delta > 0 ? '+' : ''

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`flex size-9 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">{value}</div>
      {!isNeutral && (
        <p className={`mt-1 text-xs font-medium ${deltaColor}`}>
          {deltaPrefix}{delta}% vs semana anterior
        </p>
      )}
    </div>
  )
}

export function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-card-foreground">{value}</div>
    </div>
  )
}

export function SummaryRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: ReactNode
  label: string
  value: string
  valueColor: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`text-lg font-bold ${valueColor}`}>{value}</span>
    </div>
  )
}
