import { AccountPanel } from './_components/account-panel'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'

export default function AccountPage() {
  return (
    <>
      <BreadcrumbSetter items={[{ label: 'Mi cuenta' }]} />
      <AccountPanel />
    </>
  )
}
