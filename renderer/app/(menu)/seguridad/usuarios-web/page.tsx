import { AdminsPanel } from './_components/AdminsPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'

export default function AdminsPage() {
  return (
    <>
      <BreadcrumbSetter items={[{ label: 'Seguridad' }, { label: 'Administradores' }]} />
      <AdminsPanel />
    </>
  )
}
