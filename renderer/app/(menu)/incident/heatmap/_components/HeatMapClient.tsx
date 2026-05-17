'use client'

import dynamic from "next/dynamic"
import type { HeatMapClientProps } from "@/app/(menu)/incident/heatmap/_types/types"

const HeatMap = dynamic(() => import("@/app/(menu)/incident/heatmap/_components/HeatMap"), { ssr: false })

export function HeatMapClient({ initialPoints, typeCounts }: HeatMapClientProps) {
  return (
    <HeatMap initialPoints={initialPoints} typeCounts={typeCounts} />
  )
}
