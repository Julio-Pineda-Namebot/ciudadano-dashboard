import { NewsPanel } from './_components/NewsPanel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'

export default function NewsPage() {
  return (
    <>
      <BreadcrumbSetter items={[{ label: 'Noticias' }]} />
      <NewsPanel />
    </>
  )
}
