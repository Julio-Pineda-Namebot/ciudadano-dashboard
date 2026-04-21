import { createFileRoute } from '@tanstack/react-router'
import { MenuPage } from '@/app/menu/menu-page'

export const Route = createFileRoute('/menu')({
  component: MenuPage,
})
