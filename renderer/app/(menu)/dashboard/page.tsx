import { getGeneralDashboardData } from '@/app/(menu)/dashboard/actions'
import { GeneralDashboardClient } from '@/app/(menu)/dashboard/_components/GeneralDashboardClient'

export default async function GeneralDashboardPage() {
  const data = await getGeneralDashboardData()

  return (
    <div className="p-6 space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Resumen global del sistema en tiempo real
        </p>
      </div>
      <GeneralDashboardClient data={data} />
    </div>
  )
}
