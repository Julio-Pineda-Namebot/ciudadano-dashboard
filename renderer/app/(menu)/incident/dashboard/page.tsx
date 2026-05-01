import { getDashboardData } from './actions'
import { IncidentDashboardClient } from './_components/IncidentDashboardClient'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'

export default async function IncidentDashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="p-6 space-y-4">
      <BreadcrumbSetter items={[{ label: 'Incidencias' }, { label: 'Dashboard' }]} />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard de incidencias</h1>
        <p className="text-sm text-muted-foreground">
          Crecimiento de incidencias reportadas por fecha
        </p>
      </div>
      <IncidentDashboardClient data={data} />
    </div>
  )
}
