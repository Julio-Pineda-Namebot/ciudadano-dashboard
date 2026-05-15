import { AuditLogsPanel } from './_components/AuditLogsPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import { ModuleTheme } from '@/components/common/module-theme'

export default function AuditLogsPage() {
  return (
    <ModuleTheme color="blue">
      <BreadcrumbSetter items={[{ label: 'Seguridad' }, { label: 'Logs de auditoría' }]} />
      <AuditLogsPanel />
    </ModuleTheme>
  )
}
