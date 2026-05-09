import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import { CamarasClient } from './_components/CamarasClient'

export default function CamarasPage() {
  return (
    <div className="p-6 space-y-4">
      <BreadcrumbSetter items={[{ label: 'Seguridad' }, { label: 'Cámaras' }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Centro de monitoreo de cámaras</h1>
          <p className="text-sm text-gray-500">Visualiza en vivo las cámaras desplegadas en el distrito.</p>
        </div>
      </div>
      <CamarasClient />
    </div>
  )
}
