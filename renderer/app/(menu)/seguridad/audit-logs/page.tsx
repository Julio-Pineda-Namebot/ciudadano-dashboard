import { AuditLogsPanel } from './_components/AuditLogsPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'

export default function AuditLogsPage() {
  return (
    <>
      <BreadcrumbSetter items={[{ label: 'Seguridad' }, { label: 'Logs de auditoría' }]} />
      <AuditLogsPanel />
    </>
  )
}
