'use client'

import { useAuth, useIsSuperAdmin } from '@/app/(menu)/_components/auth-provider'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import { TerminalSquareIcon, Newspaper, ShieldCog, MapPin, BarChart3, Bell, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const featureCards = [
  {
    icon: <MapPin className="size-6" />,
    title: 'Mapa de Calor',
    description: 'Visualiza incidencias en tiempo real con un mapa de calor interactivo georreferenciado.',
    href: '/incident/heatmap',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: <Newspaper className="size-6" />,
    title: 'Noticias',
    description: 'Consulta y gestiona las noticias publicadas para los ciudadanos de la plataforma.',
    href: '/news',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: <BarChart3 className="size-6" />,
    title: 'Reportes',
    description: 'Accede a informes detallados y estadísticas sobre las incidencias registradas.',
    href: '#',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    disabled: true,
  },
  {
    icon: <Bell className="size-6" />,
    title: 'Alertas',
    description: 'Mantente informado con notificaciones automáticas ante eventos críticos.',
    href: '#',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    disabled: true,
  },
]

const adminCards = [
  {
    icon: <ShieldCog className="size-5" />,
    title: 'Grupos',
    href: '#',
    disabled: true,
  },
  {
    icon: <TerminalSquareIcon className="size-5" />,
    title: 'Usuarios web',
    href: '#',
    disabled: true,
  },
]

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl bg-muted/50 border border-border/50 flex-1 sm:flex-none sm:px-6 sm:py-3">
      <span className="text-base sm:text-xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export default function WelcomePage() {
  const profile = useAuth()
  const isSuperAdmin = useIsSuperAdmin()

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  const joinYear = new Date(profile.createdAt).getFullYear()

  return (
    <div className="min-h-full p-6 space-y-8">
      <BreadcrumbSetter items={[{ label: 'Inicio' }]} />
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
        <div className="absolute inset-0 bg-linear-to-br from-sidebar-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">{greeting},</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSuperAdmin ? 'Super Administrador' : 'Administrador'} · Ciudadano Dashboard v1.0.0
            </p>
          </div>
          <div className="flex flex-row gap-3 w-full sm:w-auto">
            <StatBadge label="Usuario desde" value={String(joinYear)} />
            <StatBadge label="Rol" value={isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'} />
          </div>
        </div>
      </div>

      {/* Módulos principales */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Módulos disponibles</h2>
          <p className="text-sm text-muted-foreground">Accede rápidamente a las herramientas del sistema.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {featureCards.map((card) => {
            const content = (
              <div
                className={`group h-full flex flex-col gap-4 rounded-xl border p-5 transition-all duration-200 ${
                  card.disabled
                    ? 'opacity-50 cursor-not-allowed border-border bg-card'
                    : 'cursor-pointer border-border bg-card hover:border-sidebar-primary/40 hover:shadow-md hover:-translate-y-0.5'
                } ${card.border}`}
              >
                <div className={`flex size-11 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
                  {card.icon}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground text-sm">{card.title}</h3>
                    {card.disabled && (
                      <span className="text-[10px] font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                        Próximamente
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${card.disabled ? 'invisible' : card.color + ' group-hover:gap-2'} transition-all`}>
                  Ir al módulo <ArrowRight className="size-3" />
                </div>
              </div>
            )

            return card.disabled ? (
              <div key={card.title} className="h-full">{content}</div>
            ) : (
              <Link key={card.title} href={card.href} className="h-full">
                {content}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Panel de admin (solo super admin) */}
      {isSuperAdmin && (
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Administración</h2>
            <p className="text-sm text-muted-foreground">Herramientas exclusivas para super administradores.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {adminCards.map((card) => (
              <div
                key={card.title}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 opacity-50 cursor-not-allowed"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{card.title}</p>
                  <p className="text-xs text-muted-foreground">Próximamente</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
