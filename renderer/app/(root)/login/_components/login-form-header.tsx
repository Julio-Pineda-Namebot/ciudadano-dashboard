import { GalleryVerticalEndIcon } from "lucide-react"
import { FieldDescription } from "@/components/ui/field"

export function LoginFormHeader() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex flex-col items-center gap-2 font-medium">
        <div className="flex size-8 items-center justify-center rounded-md">
          <GalleryVerticalEndIcon className="size-6" />
        </div>
      </div>
      <h1 className="text-xl font-bold">Ciudadano Dashboard</h1>
      <FieldDescription>Ingresa tus credenciales para continuar</FieldDescription>
    </div>
  )
}
