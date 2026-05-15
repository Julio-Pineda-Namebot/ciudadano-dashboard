'use client'

import { useAuth, useIsSuperAdmin } from '@/app/(menu)/_components/auth-provider'
import { BreadcrumbSetter } from '@/app/(menu)/_components/breadcrumb-setter'
import {
  TerminalSquareIcon,
  Newspaper,
  ShieldCog,
  MapPin,
  BarChart3,
  Bell,
  ArrowRight,
  LayoutDashboard,
  Users,
  Camera,
  ScrollText,
  Settings,
} from 'lucide-react'
import Link from 'next/link'

type FeatureCard = {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  color: string
  bg: string
  border: string
  disabled?: boolean
}

const featureCards: FeatureCard[] = [
  {
    icon: <LayoutDashboard className="size-6" />,
    title: 'Dashboard General',
    description: 'Vista global del sistema: métricas clave, actividad reciente y resumen de estado.',
    href: '/dashboard',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: <TerminalSquareIcon className="size-6" />,
    title: 'Dashboard Incidencias',
    description: 'Seguimiento del crecimiento acumulado y distribución de incidencias por tipo.',
    href: '/incident/dashboard',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
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
    icon: <TerminalSquareIcon className="size-6" />,
    title: 'Reportes de Incidencias',
    description: 'Consulta, crea y gestiona todos los reportes de incidencias ciudadanas.',
    href: '/incident/incident-report',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
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
    title: 'Reportes Avanzados',
    description: 'Accede a informes detallados y estadísticas exportables sobre las incidencias registradas.',
    href: '#',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    disabled: true,
  },
  {
    icon: <Bell className="size-6" />,
    title: 'Alertas',
    description: 'Notificaciones automáticas ante eventos críticos configurables por tipo y zona.',
    href: '#',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    disabled: true,
  },
]

type AdminCard = {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  disabled?: boolean
  color: string
  bg: string
}

const adminCards: AdminCard[] = [
  {
    icon: <Users className="size-5" />,
    title: 'Usuarios web',
    description: 'Gestiona los administradores del panel.',
    href: '/seguridad/usuarios-web',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
  {
    icon: <ShieldCog className="size-5" />,
    title: 'Grupos',
    description: 'Administra grupos y permisos del sistema.',
    href: '/seguridad/grupos',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: <Camera className="size-5" />,
    title: 'Cámaras',
    description: 'Monitoreo del sistema de videovigilancia.',
    href: '/seguridad/camaras',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    icon: <ScrollText className="size-5" />,
    title: 'Logs de auditoría',
    description: 'Historial de acciones del sistema.',
    href: '/seguridad/audit-logs',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: <Settings className="size-5" />,
    title: 'Configuración',
    description: 'Ajustes generales del sistema.',
    href: '#',
    color: 'text-muted-foreground',
    bg: 'bg-muted',
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

function FeatureCardItem({ card }: { card: FeatureCard }) {
  const inner = (
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
      <div
        className={`flex items-center gap-1 text-xs font-medium transition-all ${
          card.disabled ? 'invisible' : `${card.color} group-hover:gap-2`
        }`}
      >
        Ir al módulo <ArrowRight className="size-3" />
      </div>
    </div>
  )

  return card.disabled ? (
    <div className="h-full">{inner}</div>
  ) : (
    <Link href={card.href} className="h-full">
      {inner}
    </Link>
  )
}

function AdminCardItem({ card }: { card: AdminCard }) {
  const inner = (
    <div
      className={`flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 ${
        card.disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-sidebar-primary/40 hover:shadow-sm cursor-pointer'
      }`}
    >
      <div className={`flex size-9 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
        {card.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{card.title}</p>
        <p className="text-xs text-muted-foreground truncate">{card.description}</p>
      </div>
      {card.disabled ? (
        <span className="text-[10px] font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5 shrink-0">
          Próximamente
        </span>
      ) : (
        <ArrowRight className={`size-4 shrink-0 ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
      )}
    </div>
  )

  return card.disabled ? (
    <div>{inner}</div>
  ) : (
    <Link href={card.href} className="group">
      {inner}
    </Link>
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
          {featureCards.map((card) => (
            <FeatureCardItem key={card.title} card={card} />
          ))}
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
              <AdminCardItem key={card.title} card={card} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
