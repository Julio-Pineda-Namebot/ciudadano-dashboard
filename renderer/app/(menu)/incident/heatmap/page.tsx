import { getIncidents } from "./actions"
import { HeatMapClient } from "./_components/HeatMapClient"

export default async function HeatMapPage() {
  const { points, typeCounts } = await getIncidents()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Mapa de calor de incidencias registradas</h1>
      <HeatMapClient initialPoints={points} typeCounts={typeCounts} />
    </div>
  )
}