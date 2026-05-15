import { AdminsPanel } from './_components/AdminsPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import { ModuleTheme } from '@/components/common/module-theme'

export default function AdminsPage() {
  return (
    <ModuleTheme color="blue">
      <BreadcrumbSetter items={[{ label: 'Seguridad' }, { label: 'Personal web' }]} />
      <AdminsPanel />
    </ModuleTheme>
  )
}
