import { CamerasPanel } from '@/app/(menu)/security/cameras/_components/CamerasPanel'

export default function CamerasPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Visualiza en vivo las cámaras desplegadas en el distrito.</p>
        </div>
      </div>
      <CamerasPanel />
    </div>
  )
}
