"use client"

import { useMemo, useState } from "react"
import { ActivitySquare, CalendarDays, TrendingUp, Layers } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { DashboardData } from "../actions"

const TYPE_COLORS: Record<string, string> = {
  robo: "bg-red-100 text-red-700 border-red-200",
  accidente: "bg-orange-100 text-orange-700 border-orange-200",
  vandalismo: "bg-yellow-100 text-yellow-700 border-yellow-200",
  violencia: "bg-purple-100 text-purple-700 border-purple-200",
  incendio: "bg-rose-100 text-rose-700 border-rose-200",
}
const DEFAULT_COLOR = "bg-gray-100 text-gray-700 border-gray-200"

const WIDTH = 760
const HEIGHT = 280
const PADDING = { top: 20, right: 20, bottom: 36, left: 44 }

interface Props {
  data: DashboardData
}

export function IncidentDashboardClient({ data }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  const chart = useMemo(() => {
    const { daily } = data
    if (daily.length === 0) return null

    const maxCum = Math.max(...daily.map((d) => d.cumulative), 1)
    const innerW = WIDTH - PADDING.left - PADDING.right
    const innerH = HEIGHT - PADDING.top - PADDING.bottom

    const xFor = (i: number) =>
      PADDING.left + (daily.length === 1 ? innerW / 2 : (i * innerW) / (daily.length - 1))
    const yFor = (v: number) => PADDING.top + innerH - (v / maxCum) * innerH

    const points = daily.map((d, i) => ({ x: xFor(i), y: yFor(d.cumulative), point: d }))
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${PADDING.top + innerH} L ${points[0].x} ${PADDING.top + innerH} Z`

    const yTicks = 4
    const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
      const v = Math.round((maxCum * i) / yTicks)
      return { value: v, y: yFor(v) }
    })

    const stride = Math.max(1, Math.ceil(daily.length / 8))
    const xLabels = daily
      .map((d, i) => ({ label: formatDate(d.date), x: xFor(i), i }))
      .filter((_, i) => i % stride === 0 || i === daily.length - 1)

    return { points, linePath, areaPath, yLabels, xLabels, innerH }
  }, [data])

  if (!chart) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-muted-foreground shadow-sm">
        No hay incidencias registradas todavía.
      </div>
    )
  }

  const { points, linePath, areaPath, yLabels, xLabels, innerH } = chart
  const hoveredPoint = hovered !== null ? points[hovered] : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ActivitySquare className="size-4" />}
          label="Total reportadas"
          value={data.total.toString()}
        />
        <StatCard
          icon={<CalendarDays className="size-4" />}
          label="Días con actividad"
          value={data.totalDays.toString()}
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          label="Promedio diario"
          value={data.averagePerDay.toFixed(1)}
        />
        <StatCard
          icon={<Layers className="size-4" />}
          label="Día con más reportes"
          value={
            data.peak
              ? `${formatDate(data.peak.date)} · ${data.peak.count}`
              : '—'
          }
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Crecimiento acumulado de incidencias
            </p>
            <p className="text-xs text-muted-foreground">
              Total acumulado por fecha de reporte
            </p>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full min-w-[560px]"
            role="img"
            aria-label="Gráfico de crecimiento acumulado de incidencias"
          >
            <defs>
              <linearGradient id="incident-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {yLabels.map((t) => (
              <g key={t.value}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={t.y}
                  y2={t.y}
                  stroke="#e5e7eb"
                  strokeDasharray="3 3"
                />
                <text
                  x={PADDING.left - 8}
                  y={t.y + 4}
                  textAnchor="end"
                  className="fill-gray-500"
                  fontSize="10"
                >
                  {t.value}
                </text>
              </g>
            ))}

            <path d={areaPath} fill="url(#incident-area)" />
            <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />

            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={hovered === i ? 5 : 3} fill="#3b82f6" />
                <rect
                  x={p.x - 14}
                  y={PADDING.top}
                  width={28}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            ))}

            {xLabels.map((l) => (
              <text
                key={l.i}
                x={l.x}
                y={HEIGHT - PADDING.bottom + 18}
                textAnchor="middle"
                className="fill-gray-500"
                fontSize="10"
              >
                {l.label}
              </text>
            ))}
          </svg>

          {hoveredPoint && (
            <div
              className="pointer-events-none absolute rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm"
              style={{
                left: `${(hoveredPoint.x / WIDTH) * 100}%`,
                top: `${(hoveredPoint.y / HEIGHT) * 100}%`,
                transform: 'translate(-50%, -110%)',
              }}
            >
              <div className="font-medium text-gray-800">
                {formatDate(hoveredPoint.point.date)}
              </div>
              <div className="text-gray-600">
                Acumulado: <span className="font-semibold">{hoveredPoint.point.cumulative}</span>
              </div>
              <div className="text-gray-600">
                Nuevas: <span className="font-semibold">{hoveredPoint.point.count}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {data.byType.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Distribución por tipo
          </p>
          <div className="flex flex-wrap gap-2">
            {data.byType.map(({ type, count }) => (
              <span
                key={type}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
                  TYPE_COLORS[type] ?? DEFAULT_COLOR
                }`}
              >
                {type}
                <span className="font-normal opacity-70">({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-gray-800">{value}</div>
    </div>
  )
}
