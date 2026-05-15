import { CitizensPanel } from './_components/CitizensPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import { ModuleTheme } from '@/components/common/module-theme'

export default function CitizensPage() {
  return (
    <ModuleTheme color="green">
      <BreadcrumbSetter items={[{ label: 'Ciudadanos' }]} />
      <CitizensPanel />
    </ModuleTheme>
  )
}
