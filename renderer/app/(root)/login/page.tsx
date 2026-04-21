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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm sessionRevokedMessage={sessionRevokedMessage} />
      </div>
    </div>
  )
}
