@AGENTS.md

# Convenciones del proyecto

## Estructura de la app

La app tiene tres grupos de rutas separados — nunca mezclar componentes entre ellos:

- `app/(landing)/` — landing pública
- `app/(menu)/` — dashboard autenticado con sidebar
- `app/(root)/` — pantallas sin layout (login, etc.)

## Estructura de cada módulo

Cada módulo dentro de `(menu)/` sigue esta estructura:

```
(menu)/modulo/
  page.tsx              # Server component, importa actions y pasa data al client
  actions.ts            # Server actions ('use server'), toda la lógica de datos
  _types/types.ts       # Tipos del módulo (usar types.modulo.ts si el archivo es extenso)
  _components/          # Client components ('use client') del módulo
```

Reglas:
- Los tipos inline (`interface`, `type`, unions) van siempre en `_types/<modulo>.ts`, nunca inline en el componente
- Nunca crear `types.ts` suelto en la raíz del módulo — siempre usar `_types/types.ts`
- Si el archivo de tipos es extenso, usar `_types/types.modulo.ts` (ej. `types.incident-report.ts`)
- `actions.ts` importa de otros módulos usando `@/app/(menu)/...`, nunca rutas relativas `../`
- No crear rutas API (`/api/...`) para obtener datos que ya puede proveer una server action
- **NUNCA hacer `export type` desde un archivo `'use server'`** — Next.js lo trata como un intento de exportar una server action y lanza error en build. Los tipos siempre se importan directo desde `types.ts`, nunca re-exportados desde `actions.ts`

## Nomenclatura de archivos

Todos los archivos (componentes, tipos, acciones, utilidades, etc.) se nombran en camelCase. Ejemplos:
- `incidentReport.ts`, `heatmapUtils.ts`, `authHelper.ts`

Excepción: los archivos de componentes React que exportan un componente usan PascalCase para coincidir con el nombre del componente (ej. `IncidentReportPanel.tsx`).

## Nomenclatura de componentes

Los componentes de un módulo se nombran con el prefijo del módulo en PascalCase seguido del sufijo que describe su rol:

| Sufijo | Uso |
|---|---|
| `Panel` | Componente raíz del módulo, orquesta estado y subcomponentes |
| `Table` / `Grid` | Listado tabular o en grilla |
| `FormModal` | Modal con formulario de creación o edición |
| `DeleteDialog` | Diálogo de confirmación de eliminación |
| `Card` | Tarjeta de resumen o detalle |
| `Chart` | Gráfico o visualización |
| `Client` | Wrapper client-side de un componente con carga dinámica |

Ejemplo para el módulo `incident-report`:
- `IncidentReportPanel` — orquestador principal
- `IncidentReportTable` — tabla de datos
- `IncidentReportFormModal` — modal de edición
- `IncidentReportDeleteDialog` — diálogo de borrado

Nunca usar nombres genéricos como `List`, `Modal`, `Form` sin el prefijo del módulo.

## Estructura de diálogos y modales

### FormModal (`*FormModal.tsx`)

Usa `Dialog` de `@/components/ui/dialog`. Estructura fija:

```tsx
<Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
  <DialogContent className="w-[calc(100vw-2rem)] max-w-lg p-0" showCloseButton={false}>
    <DialogHeader className="px-6 pt-6 pb-2">
      <DialogTitle>Título</DialogTitle>
    </DialogHeader>

    <div className="px-6 py-2">
      <form id="module-form" onSubmit={submit} className="grid gap-4" noValidate>
        {/* campos del formulario */}
      </form>
    </div>

    <DialogFooter className="px-6 pb-6 pt-2 border-t border-border flex-row! justify-between!">
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancelar
      </Button>
      <Button type="submit" form="module-form" disabled={isSubmitting} className={btnClass}>
        {isSubmitting ? <><Spinner /><span>Guardando...</span></> : 'Guardar cambios'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Reglas:
- `p-0` en `DialogContent`, padding explícito en cada sección (`px-6`)
- `showCloseButton={false}` siempre — el botón Cancelar cumple esa función
- El `<form>` va **dentro** de `DialogContent` como hijo directo del div central, nunca envolviendo el `Dialog`
- El botón submit usa `form="module-form"` (id del form) y va en el `DialogFooter`, no dentro del `<form>`
- Footer con `flex-row! justify-between!` — Cancelar a la izquierda, acción a la derecha
- Botón de acción usa `btnClass` del `useModuleTheme()` para respetar el color del módulo
- Estado de carga con `<Spinner />` + texto dentro del botón de acción, `disabled={isSubmitting}` en ambos botones

### DeleteDialog (`*DeleteDialog.tsx`)

Usa `AlertDialog` de `@/components/ui/alert-dialog`. Estructura fija:

```tsx
<AlertDialog open={item !== null} onOpenChange={(v) => !v && !loading && onClose()}>
  <AlertDialogContent size="sm" dismissible={false}>
    <AlertDialogHeader>
      <AlertDialogTitle>Eliminar [entidad]</AlertDialogTitle>
      <AlertDialogDescription>
        ¿Estás seguro de que deseas eliminar ...? Esta acción no se puede deshacer.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
        Cancelar
      </Button>
      <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={loading}>
        {loading ? <><Spinner /><span>Eliminando...</span></> : 'Eliminar'}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Reglas:
- `size="sm"` y `dismissible={false}` siempre en `AlertDialogContent`
- `open={item !== null}` — el ítem seleccionado actúa como señal de apertura (null = cerrado)
- Estado de carga con `useState(false)` local, no viene de fuera
- Botón destructivo es `AlertDialogAction` con `variant="destructive"`, nunca un `Button` normal
- El mensaje siempre menciona el nombre/identificador del ítem entre `<strong>` y aclara que la acción no se puede deshacer

## Imports

Usar siempre el alias `@/` — nunca rutas relativas (`../`, `./`).

## Componentes reutilizables

- `components/ui/` — componentes base de shadcn (Button, Card, Chart, etc.)
- `components/common/` — componentes propios reutilizables entre módulos

Siempre usar los componentes padre de `ui/` o `common/` antes de crear HTML a mano. Por ejemplo:
- Charts → `ChartContainer`, `ChartTooltip`, etc. de `@/components/ui/chart`
- Cards → `Card`, `CardHeader`, `CardContent` de `@/components/ui/card`
- Botones de mapa → `MapButton` de `@/components/common/map-button`
