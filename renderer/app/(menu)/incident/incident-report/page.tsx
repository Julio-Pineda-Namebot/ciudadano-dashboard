import { IncidentReportPanel } from './_components/IncidentReportPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'

export default function IncidentReportPage() {
  return (
    <>
      <BreadcrumbSetter items={[{ label: 'Incidencias' }, { label: 'Ver reportes' }]} />
      <IncidentReportPanel />
    </>
  )
}
