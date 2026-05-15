"use client"

import { useEffect, useRef } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { useIsSuperAdmin } from "./auth-provider"

const HEADER_STEPS = [
  {
    element: '[data-tour="header-status"]',
    popover: {
      title: "Estado del sistema",
      description:
        "Indicador en tiempo real de la conectividad con el servidor. Verde significa que todo está operativo.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="header-bell"]',
    popover: {
      title: "Notificaciones",
      description:
        "Alertas y avisos importantes del sistema. El punto rojo indica que hay notificaciones pendientes por revisar.",
      side: "bottom" as const,
      align: "end" as const,
    },
  },
  {
    element: '[data-tour="header-user"]',
    popover: {
      title: "Cuenta de usuario",
      description:
        "Muestra tu nombre y correo. Al hacer clic puedes acceder a tu perfil o cerrar sesión.",
      side: "bottom" as const,
      align: "end" as const,
    },
  },
]

const BASE_STEPS = [
  {
    element: '[data-tour="nav-dashboard-general"]',
    popover: {
      title: "Dashboard General",
      description:
        "Vista principal del sistema con un resumen global de todas las métricas: incidencias, noticias y estado general de la plataforma.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-incidencias"]',
    popover: {
      title: "Incidencias",
      description:
        "Módulo principal para gestionar todos los reportes de incidencias ciudadanas. Contiene dashboard, mapa de calor y listado de reportes.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-incident-dashboard"]',
    popover: {
      title: "Dashboard de Incidencias",
      description:
        "Vista con estadísticas en tiempo real: totales por tipo, tendencias diarias y estado de resolución de cada incidencia.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-incident-heatmap"]',
    popover: {
      title: "Mapa de Calor",
      description:
        "Mapa interactivo que muestra la concentración geográfica de incidencias. Ideal para identificar zonas críticas en la ciudad.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-incident-report"]',
    popover: {
      title: "Ver Reportes",
      description:
        "Listado completo de reportes con filtros por fecha. Permite crear, editar y eliminar incidencias individuales.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-noticias"]',
    popover: {
      title: "Noticias",
      description:
        "Gestión del contenido informativo publicado a los ciudadanos. Crea y edita noticias con imagen, resumen, contenido y etiquetas.",
      side: "right" as const,
      align: "start" as const,
    },
  },
]

const SECURITY_STEPS = [
  {
    element: '[data-tour="nav-seguridad"]',
    popover: {
      title: "Seguridad",
      description:
        "Módulo administrativo para controlar el acceso al sistema: grupos de permisos, usuarios, cámaras y auditoría completa.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-seguridad-grupos"]',
    popover: {
      title: "Grupos",
      description:
        "Define grupos de acceso que agrupan permisos. Cada administrador pertenece a un grupo que determina qué módulos puede operar.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-seguridad-usuarios"]',
    popover: {
      title: "Usuarios Web",
      description:
        "Gestiona las cuentas de los administradores con acceso al panel. Crea usuarios, asigna grupos y actualiza credenciales.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-seguridad-camaras"]',
    popover: {
      title: "Cámaras",
      description:
        "Registro y seguimiento de las cámaras de vigilancia instaladas en la ciudad: ubicación, estado operativo y administración.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="nav-seguridad-audit"]',
    popover: {
      title: "Logs de Auditoría",
      description:
        "Historial completo de acciones de administradores: creaciones, ediciones y eliminaciones con fecha, hora, usuario e IP de origen.",
      side: "right" as const,
      align: "start" as const,
    },
  },
]

interface Props {
  active: boolean
  onDone: () => void
}

export function HelpTour({ active, onDone }: Props) {
  const isSuperAdmin = useIsSuperAdmin()
  const driverRef = useRef<ReturnType<typeof driver> | null>(null)

  useEffect(() => {
    if (!active) return

    const steps = isSuperAdmin
      ? [...HEADER_STEPS, ...BASE_STEPS, ...SECURITY_STEPS]
      : [...HEADER_STEPS, ...BASE_STEPS]

    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} de {{total}}",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "Finalizar",
      steps,
      onDestroyed: onDone,
      overlayColor: "#000",
      overlayOpacity: 0.65,
      smoothScroll: true,
      allowClose: true,
      stagePadding: 6,
      stageRadius: 8,
      popoverClass: "ciudadano-tour-popover",
    })

    driverRef.current = driverObj
    driverObj.drive()

    return () => {
      driverObj.destroy()
      driverRef.current = null
    }
  }, [active, isSuperAdmin, onDone])

  return null
}
