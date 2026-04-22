"use client" 
import dynamic from "next/dynamic"

const HeatMap = dynamic(() => import("../_components/HeatMap"), { ssr: false })

export default function HeatMapPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Mapa de Incidentes</h1>
      <HeatMap />
    </div>
  )
}