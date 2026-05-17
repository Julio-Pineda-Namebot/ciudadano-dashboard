"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ActivitySquare, CalendarDays, TrendingUp, Layers } from "lucide-react"

import { StatCard } from "@/components/common/dashboard-cards"
import { formatDate } from "@/lib/utils"
import type { IncidentDashboardProps, TimeRange } from "@/app/(menu)/incident/dashboard/_types/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"

const TYPE_FILL: Record<string, string> = {
  robo: "#ef4444",
  accidente: "#f97316",
  vandalismo: "#eab308",
  violencia: "#a855f7",
  incendio: "#f43f5e",
}
const DEFAULT_FILL = "#6b7280"

const TYPE_BADGE_COLORS: Record<string, string> = {
  robo: "bg-red-100 text-red-700 border-red-200",
  accidente: "bg-orange-100 text-orange-700 border-orange-200",
  vandalismo: "bg-yellow-100 text-yellow-700 border-yellow-200",
  violencia: "bg-purple-100 text-purple-700 border-purple-200",
  incendio: "bg-rose-100 text-rose-700 border-rose-200",
}
const DEFAULT_BADGE_COLOR = "bg-gray-100 text-gray-700 border-gray-200"

const areaChartConfig = {
  cumulative: {
    label: "Acumulado",
    color: "var(--chart-1)",
  },
  count: {
    label: "Nuevas",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function IncidentDashboardClient({ data }: IncidentDashboardProps) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("all")

  const filteredDaily = React.useMemo(() => {
    if (timeRange === "all") return data.daily
    const days = timeRange === "30d" ? 30 : 7
    return data.daily.slice(-days)
  }, [data.daily, timeRange])

  const barChartConfig = React.useMemo(() => {
    return data.byType.reduce<ChartConfig>((acc, { type }) => {
      acc[type] = {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        color: TYPE_FILL[type] ?? DEFAULT_FILL,
      }
      return acc
    }, {})
  }, [data.byType])

  if (data.daily.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
        No hay incidencias registradas todavía.
      </div>
    )
  }

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
              : "—"
          }
        />
      </div>

      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Crecimiento acumulado de incidencias</CardTitle>
            <CardDescription>
              Total acumulado y nuevas incidencias por fecha de reporte
            </CardDescription>
          </div>
          <div className="flex gap-1 rounded-lg border border-border p-1 text-xs">
            {(["all", "30d", "7d"] satisfies TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-md px-3 py-1 font-medium transition-colors ${
                  timeRange === r
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "Todo" : r === "30d" ? "30 días" : "7 días"}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={areaChartConfig}
            className="aspect-auto h-65 w-full"
          >
            <AreaChart data={filteredDaily}>
              <defs>
                <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-cumulative)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-cumulative)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("es-PE", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={36}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("es-PE", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillCount)"
                stroke="var(--color-count)"
              />
              <Area
                dataKey="cumulative"
                type="natural"
                fill="url(#fillCumulative)"
                stroke="var(--color-cumulative)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {data.byType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribución por tipo</CardTitle>
            <CardDescription>
              Total de incidencias agrupadas por categoría
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ChartContainer
              config={barChartConfig}
              className="aspect-auto h-50 w-full"
            >
              <BarChart
                data={data.byType}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="type"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={28}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, _name, item) => {
                        const type = item.payload?.type as string
                        const color = TYPE_FILL[type] ?? DEFAULT_FILL
                        const label = type
                          ? type.charAt(0).toUpperCase() + type.slice(1)
                          : "—"
                        return (
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-xs"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-muted-foreground">{label}</span>
                            <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                              {Number(value).toLocaleString()}
                            </span>
                          </div>
                        )
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  fill="var(--chart-1)"
                  label={false}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={(props: any) => {
                    const { x, y, width, height, type } = props
                    const fill = TYPE_FILL[type] ?? DEFAULT_FILL
                    const r = 6
                    return (
                      <path
                        d={`M${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} L${x},${y + height} Z`}
                        fill={fill}
                      />
                    )
                  }}
                />
              </BarChart>
            </ChartContainer>

            <div className="mt-4 flex flex-wrap gap-2">
              {data.byType.map(({ type, count }) => (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
                    TYPE_BADGE_COLORS[type] ?? DEFAULT_BADGE_COLOR
                  }`}
                >
                  {type}
                  <span className="font-normal opacity-70">({count})</span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
