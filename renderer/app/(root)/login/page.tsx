import { LoginForm } from "@/app/(root)/login/_components/login-form"

interface Props {
  searchParams: Promise<{ reason?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams
  const messages: Record<string, string> = {
    session_revoked: 'Alguien inició sesión en tu cuenta. Fuiste desconectado.',
    session_expired: 'Tu sesión expiró. Vuelve a ingresar.',
    session_invalid: 'Tu sesión no es válida. Vuelve a ingresar.',
  }
  const sessionRevokedMessage = params.reason ? messages[params.reason] : undefined

  return (
    <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
        {/* Panel izquierdo - formulario */}
        <div className="flex w-full flex-col justify-center bg-white px-10 py-12 md:w-1/2">
          <div className="mx-auto w-full max-w-sm">
            <LoginForm sessionRevokedMessage={sessionRevokedMessage} />
          </div>
        </div>

        {/* Panel derecho - decorativo */}
        <div className="hidden flex-col items-center justify-center bg-gray-100 px-10 md:flex md:w-1/2">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex size-32 items-center justify-center rounded-2xl bg-black shadow-xl">
              <img src="/favicon.ico" alt="Logo" className="size-20 object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ciudadano Dashboard</h2>
              <p className="mt-2 text-sm text-gray-500">Sistema de gestión de incidencias ciudadanas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
