import { NewsPanel } from './_components/NewsPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import { ModuleTheme } from '@/components/common/module-theme'

export default function NewsPage() {
  return (
    <ModuleTheme color="orange">
      <BreadcrumbSetter items={[{ label: 'Noticias' }]} />
      <NewsPanel />
    </ModuleTheme>
  )
}
