import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormFieldsProps {
  pending: boolean
}

export function LoginFormFields({ pending }: LoginFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Field>
        <FieldLabel htmlFor="username">Usuario</FieldLabel>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="nombre de usuario"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </div>
      </Field>
      <Field>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </Field>
    </>
  )
}
