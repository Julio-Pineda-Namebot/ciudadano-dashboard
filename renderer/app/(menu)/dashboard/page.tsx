import { getGeneralDashboardData } from './actions'
import { GeneralDashboardClient } from './_components/GeneralDashboardClient'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'

export default async function GeneralDashboardPage() {
  const data = await getGeneralDashboardData()

  return (
    <div className="p-6 space-y-4">
      <BreadcrumbSetter items={[{ label: 'Dashboard General' }]} />
      <div>
        <h1 className="text-2xl font-bold">Dashboard General</h1>
        <p className="text-sm text-muted-foreground">
          Resumen global del sistema en tiempo real
        </p>
      </div>
      <GeneralDashboardClient data={data} />
    </div>
  )
}
