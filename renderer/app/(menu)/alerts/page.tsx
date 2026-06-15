import { getPanicAlerts } from './actions'
import { AlertsClient } from './_components/AlertsClient'

export default async function AlertsPage() {
  const alerts = await getPanicAlerts()

  return (
    <div className="p-6 space-y-4">
      <AlertsClient initialAlerts={alerts} />
    </div>
  )
}
