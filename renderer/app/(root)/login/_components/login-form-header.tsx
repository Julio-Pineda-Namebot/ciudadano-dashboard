import { FieldDescription } from "@/components/ui/field"

export function LoginFormHeader() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex flex-col items-center gap-2 font-medium">
        <div className="flex size-14 items-center justify-center rounded-xl bg-black shadow-md">
          <img src="/favicon.ico" alt="Logo" className="size-9 object-contain" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bienvenido</h1>
        <FieldDescription>Ingresa tus credenciales para continuar</FieldDescription>
      </div>
    </div>
  )
}
