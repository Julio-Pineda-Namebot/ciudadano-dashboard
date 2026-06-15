# Plan 003: Validar tipo MIME y tamaño de uploads en el BFF antes de reenviar

> **Instrucciones para el ejecutor**: Sigue el plan paso a paso, ejecuta cada
> verificación y confirma el resultado esperado antes de continuar. Ante una
> condición STOP, detente y reporta. Al terminar, actualiza la fila de 003 en
> `plans/README.md`.
>
> **Drift check (ejecutar primero)**:
> `git diff --stat 4904159..HEAD -- app/(landing)/feed/actions.ts app/(menu)/news/actions.ts`
> Si algún archivo en alcance cambió, compara con los excerpts de "Estado actual"
> antes de continuar; ante discrepancia, trátalo como condición STOP.

## Estado

- **Prioridad**: P2
- **Esfuerzo**: S
- **Riesgo**: LOW
- **Depende de**: ninguno
- **Categoría**: security
- **Planned at**: commit `4904159`, 2026-06-12

## Por qué importa

Dos server actions reciben archivos del cliente y los reenvían al backend **sin
validar tipo ni tamaño** en la capa BFF. El reporte ciudadano solo comprueba que el
archivo no esté vacío (`multimedia.size === 0`); el de noticias adjunta cualquier
`File` tal cual. Aunque el backend sea la autoridad final, validar en el BFF es
defensa en profundidad y evita reenviar payloads enormes o tipos inesperados a través
del proceso de Next (riesgo de DoS por memoria/ancho de banda y de aceptar contenido
no previsto). El cliente ya define límites (ver "Convenciones"); el servidor debe
hacerlos cumplir, porque la validación de cliente es eludible.

## Estado actual

- `app/(landing)/feed/actions.ts:41-64` — `reportIncident`, única validación de archivo:

```ts
const multimedia = formData.get('multimedia') as File | null
// ...validaciones de tipo/descripcion/lat/lon...
if (!multimedia || multimedia.size === 0) {
  return { error: 'Adjunta una foto o video del incidente' }
}
// luego: upstream.set('multimedia', multimedia) y postMultipart(...)
```

- `app/(menu)/news/actions.ts:15-24` — `buildFormData`, adjunta la imagen sin chequear:

```ts
function buildFormData(data: Partial<NewsFormData>): FormData {
  const fd = new FormData()
  // ...
  if (data.image instanceof File) fd.append('image', data.image)
  return fd
}
```

### Convenciones del repo (a respetar)

El cliente ya declara los límites — el servidor debe igualarlos:

- Reporte ciudadano (`app/(landing)/feed/_components/CitizenFeedReportForm.tsx:137`):
  `accept="image/*,video/*"`.
- Componente común de upload (`components/common/form/FormField.tsx:316-345`):
  tipos por defecto `image/png`, `image/jpeg`, `image/webp`; `maxSize` por defecto
  `5 * 1024 * 1024` (5 MB).

Convención de validación existente a imitar: las validaciones de `reportIncident`
devuelven `{ error: '...mensaje en español...' }` y NO lanzan; síguela.

## Comandos que necesitarás

| Propósito | Comando | Esperado |
|-----------|---------|----------|
| Typecheck | `pnpm exec tsc --noEmit` | exit 0 |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0 |

## Alcance

**En alcance**:
- `app/(landing)/feed/actions.ts`
- `app/(menu)/news/actions.ts`

**Fuera de alcance**:
- Los componentes de formulario del cliente (ya validan; no es donde está el gap).
- `lib/backendService.ts` — no cambiar `postMultipart`/`sendMultipart`; la validación
  va en las actions, antes de llamar.
- No introducir dependencias nuevas (no hace falta una lib para esto).

## Git workflow

- Rama: `advisor/003-validate-uploads`
- Commit estilo repo: `Fix: validar tipo y tamaño de uploads en el BFF`

## Pasos

### Paso 1: Validar el upload en `reportIncident` (feed)

En `app/(landing)/feed/actions.ts`, tras el chequeo de `size === 0`, añade
allow-list de MIME y tope de tamaño. El form acepta imágenes y video, así que:

```ts
const ALLOWED_UPLOAD_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/webm',
] as const
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024 // 25 MB (imágenes+video)

// dentro de reportIncident, después de comprobar que multimedia existe y no está vacío:
if (!ALLOWED_UPLOAD_TYPES.includes(multimedia.type as typeof ALLOWED_UPLOAD_TYPES[number])) {
  return { error: 'Formato no permitido. Usa una imagen (JPG, PNG, WebP) o video (MP4, MOV, WebM).' }
}
if (multimedia.size > MAX_UPLOAD_BYTES) {
  return { error: 'El archivo supera el tamaño máximo de 25 MB.' }
}
```

Coloca las constantes a nivel de módulo (junto a `ALLOWED_TYPES` existente).

**Verify**: `pnpm exec tsc --noEmit` exit 0 y `git diff` muestra las dos guardas
nuevas antes del `postMultipart`.

### Paso 2: Validar la imagen en las actions de noticias

En `app/(menu)/news/actions.ts`, valida la imagen donde se construye el FormData.
Noticias usa solo imagen (no video) → allow-list de imágenes y 5 MB (igual al
default del componente común):

```ts
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

function assertValidImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    throw new Error('Formato de imagen no permitido. Usa JPG, PNG o WebP.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('La imagen supera el tamaño máximo de 5 MB.')
  }
}
```

Llama `assertValidImage(data.image)` dentro de `buildFormData` justo antes del
`fd.append('image', data.image)`, dentro del bloque `if (data.image instanceof File)`.

> Nota de patrón: las actions de noticias (`createNews`/`updateNews`) lanzan en error
> y el panel cliente captura — por eso aquí se usa `throw new Error(...)` (mensaje en
> español), coherente con cómo el resto de noticias propaga errores. NO cambies eso a
> retornar `{ error }`: rompería el contrato de `createNews`/`updateNews`.

**Verify**: `pnpm exec tsc --noEmit` exit 0; `buildFormData` valida antes de adjuntar.

### Paso 3: Build y lint

```
pnpm lint && pnpm exec tsc --noEmit && pnpm build
```

**Verify**: exit 0 en los tres.

## Test plan

Sin framework de tests; verificación manual:

1. Reporte ciudadano: adjuntar un `.txt` renombrado o un archivo > 25 MB →
   aparece el mensaje de error y NO se envía al backend.
2. Reporte ciudadano: adjuntar un JPG válido pequeño → se envía correctamente.
3. Noticias: subir una imagen > 5 MB o un tipo no permitido → error visible en el
   panel; una imagen válida se crea/edita bien.

## Done criteria

- [ ] `feed/actions.ts` valida MIME (allow-list) y tamaño del `multimedia` antes de `postMultipart`
- [ ] `news/actions.ts` valida MIME y tamaño de `data.image` antes de adjuntarla
- [ ] `pnpm exec tsc --noEmit` exit 0
- [ ] `pnpm lint` exit 0
- [ ] `pnpm build` exit 0
- [ ] Solo se modificaron los dos archivos en alcance (`git status`)
- [ ] Fila de estado de 003 actualizada en `plans/README.md`

## Condiciones STOP

- El backend espera tipos/tamaños distintos a los aquí asumidos (p. ej. acepta PDF, o
  el límite real es otro) → STOP y ajusta las constantes al contrato real antes de mergear.
- `multimedia.type` viene vacío para archivos legítimos en el entorno de prueba
  (algunos navegadores omiten el MIME) → STOP: decide si caer a validar por extensión
  en vez de rechazar válidos.

## Notas de mantenimiento

- Si se añaden nuevos tipos de adjunto (audio, etc.), actualizar ambas allow-lists.
- Estas validaciones son defensa en profundidad: el backend sigue siendo la autoridad;
  no asumir que reemplazan su validación.
- Un revisor debe confirmar que los límites del servidor son >= a los del cliente para
  no rechazar uploads que el cliente sí permite.
