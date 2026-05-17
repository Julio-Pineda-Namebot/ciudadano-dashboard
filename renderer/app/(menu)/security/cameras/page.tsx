import { CamerasClient } from './_components/CamerasClient'

export default function CamerasPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Centro de monitoreo de cámaras</h1>
          <p className="text-sm text-gray-500">Visualiza en vivo las cámaras desplegadas en el distrito.</p>
        </div>
      </div>
      <CamerasClient />
    </div>
  )
}
