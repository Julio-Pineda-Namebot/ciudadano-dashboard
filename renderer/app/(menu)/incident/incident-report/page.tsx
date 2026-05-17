import { ModuleTheme } from '@/components/common/module-theme'
import { IncidentReportPanel } from '@/app/(menu)/incident/incident-report/_components/IncidentReportPanel'
import { getIncidentReports } from '@/app/(menu)/incident/incident-report/actions'

export default async function IncidentReportPage() {
  const reports = await getIncidentReports()

  return (
    <ModuleTheme color="yellow">
      <IncidentReportPanel initialReports={reports} />
    </ModuleTheme>
  )
}
