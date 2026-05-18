import { CitizensPanel } from '@/app/(menu)/citizens/_components/CitizensPanel'
import { ModuleTheme } from '@/components/common/module-theme'
import { getCitizens } from '@/app/(menu)/citizens/actions'

export default async function CitizensPage() {
  const citizens = await getCitizens()

  return (
    <ModuleTheme color="green">
      <CitizensPanel citizens={citizens} />
    </ModuleTheme>
  )
}
