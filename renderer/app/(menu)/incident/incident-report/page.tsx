import { IncidentReportPanel } from './_components/IncidentReportPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import { ModuleTheme } from '@/components/common/module-theme'

export default function IncidentReportPage() {
  return (
    <ModuleTheme color="green">
      <BreadcrumbSetter items={[{ label: 'Incidencias' }, { label: 'Ver reportes' }]} />
      <IncidentReportPanel />
    </ModuleTheme>
  )
}
