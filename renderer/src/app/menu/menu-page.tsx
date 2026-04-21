import { AppSidebar } from "@/app/menu/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function MenuPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-base font-medium">Menu</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Bienvenido al panel. Selecciona una opción del menú lateral.
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
