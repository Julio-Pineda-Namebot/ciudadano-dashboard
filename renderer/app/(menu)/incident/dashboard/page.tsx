import { getDashboardData } from '@/app/(menu)/incident/dashboard/actions'
import { IncidentDashboardClient } from '@/app/(menu)/incident/dashboard/_components/IncidentDashboardClient'

export default async function IncidentDashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="p-6 space-y-4">
      <IncidentDashboardClient data={data} />
    </div>
  )
}
