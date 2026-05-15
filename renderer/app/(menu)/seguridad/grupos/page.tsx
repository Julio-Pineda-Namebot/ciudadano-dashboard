import { GroupsPanel } from './_components/GroupsPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import { ModuleTheme } from '@/components/common/module-theme'

export default function GroupsPage() {
  return (
    <ModuleTheme color="blue">
      <BreadcrumbSetter items={[{ label: 'Seguridad' }, { label: 'Grupos' }]} />
      <GroupsPanel />
    </ModuleTheme>
  )
}
