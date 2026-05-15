'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/app/(menu)/_components/auth-provider'
import { formatDateTime } from '@/lib/utils'

export function AccountPanel() {
  const profile = useAuth()

  const fullName = `${profile.firstName} ${profile.lastName}`.trim()
  const initials =
    fullName
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '??'

  const createdAt = formatDateTime(profile.createdAt)

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16 rounded-lg">
          <AvatarFallback className="rounded-lg text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{fullName}</h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
      </div>

      <Separator className="my-6" />

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" value={profile.firstName} />
        <Field label="Apellido" value={profile.lastName} />
        <Field label="Usuario" value={profile.username} />
        <Field label="Correo" value={profile.email} />
        <Field label="Grupo" value={profile.group.name} />
        <Field label="Creado el" value={createdAt} />
      </dl>
    </div>
  )
}

function Field({
  label,
  value,
  className,
  mono,
}: {
  label: string
  value: string
  className?: string
  mono?: boolean
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className={`mt-1 text-sm ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  )
}
