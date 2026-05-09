import { GroupsPanel } from './_components/GroupsPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'

export default function GroupsPage() {
  return (
    <>
      <BreadcrumbSetter items={[{ label: 'Seguridad' }, { label: 'Grupos' }]} />
      <GroupsPanel />
    </>
  )
}
