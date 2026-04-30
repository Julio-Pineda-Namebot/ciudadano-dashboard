'use client'

import dynamic from "next/dynamic"

const HeatMap = dynamic(() => import("./HeatMap"), { ssr: false })

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
  robo:      { label: 'Robo',      color: 'bg-red-100 text-red-700 border-red-200' },
  accidente: { label: 'Accidente', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  vandalismo:{ label: 'Vandalismo',color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  violencia: { label: 'Violencia', color: 'bg-purple-100 text-purple-700 border-purple-200' },
}

const DEFAULT_STYLE = { label: '', color: 'bg-gray-100 text-gray-700 border-gray-200' }

interface Props {
  initialPoints: [number, number, number][]
  typeCounts: Record<string, number>
}

export function HeatMapClient({ initialPoints, typeCounts }: Props) {
  const entries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-3">
      <HeatMap initialPoints={initialPoints} />

      {entries.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Tipos de incidencias visualizadas
          </p>
          <div className="flex flex-wrap gap-2">
            {entries.map(([type, count]) => {
              const style = TYPE_STYLES[type] ?? { ...DEFAULT_STYLE, label: type }
              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${style.color}`}
                >
                  {style.label || type}
                  {count > 1 && (
                    <span className="font-normal opacity-70">({count})</span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
