import { AuditLogsPanel } from '@/app/(menu)/security/audit-logs/_components/AuditLogsPanel'
import { ModuleTheme } from '@/components/common/module-theme'

export default function AuditLogsPage() {
  return (
    <ModuleTheme color="blue">
      <AuditLogsPanel />
    </ModuleTheme>
  )
}
