# Plan 005: Codificar IDs de entidad en rutas del backend (`encodeURIComponent`)

> **Instrucciones para el ejecutor**: Sigue el plan paso a paso, ejecuta cada
> verificación y confirma el resultado esperado antes de continuar. Ante una
> condición STOP, detente y reporta. Al terminar, actualiza la fila de 005 en
> `plans/README.md`.
>
> **Drift check (ejecutar primero)**:
> `git diff --stat 4904159..HEAD -- "app/(menu)/security/web-staff/actions.ts" "app/(menu)/security/groups/actions.ts" "app/(menu)/incident/incident-report/actions.ts" "app/(menu)/news/actions.ts"`
> Si algún archivo en alcance cambió, compara con los excerpts de "Estado actual"
> antes de continuar; ante discrepancia, trátalo como condición STOP.

## Estado

- **Prioridad**: P3
- **Esfuerzo**: S
- **Riesgo**: LOW
- **Depende de**: ninguno
- **Categoría**: security (higiene / defensa en profundidad)
- **Planned at**: commit `4904159`, 2026-06-12

## Por qué importa

Varias server actions interpolan un `id` directamente en la ruta del backend
(`` `/admin/admins/${id}` ``) sin `encodeURIComponent`. Si un `id` llegara a contener
caracteres especiales (`/`, `?`, `#`, `%`...), la URL se construye mal y el segmento
puede reinterpretarse. El riesgo práctico es bajo (los IDs vienen de datos del propio
backend seleccionados en la UI, y el backend debe validar ownership), pero codificar
es higiene barata y el codebase **ya usa el patrón** en otra parte
(`feed/actions.ts:28` codifica `lat`/`lon`). Este plan unifica esa práctica.

## Estado actual

IDs sin codificar al construir rutas (verificado en el commit base):

- `app/(menu)/security/web-staff/actions.ts`
  - `:18` `` `/admin/admins/${id}` `` (getAdmin)
  - `:28` `` `/admin/admins/${id}` `` (updateAdmin)
  - `:33` `` `/admin/admins/${id}` `` (deleteAdmin)
- `app/(menu)/security/groups/actions.ts`
  - `:18` `` `/admin/groups/${id}` `` (getGroup)
  - `:28` `` `/admin/groups/${id}` `` (updateGroup)
  - `:33` `` `/admin/groups/${id}` `` (deleteGroup)
- `app/(menu)/incident/incident-report/actions.ts`
  - `:18` `` `/admin/incidents/${id}` `` (updateIncidentReport)
  - `:23` `` `/admin/incidents/${id}` `` (deleteIncidentReport)
- `app/(menu)/news/actions.ts`
  - `:52` `` `/admin/news/${id}` `` (getNewsById)
  - `:64` `` `/admin/news/${id}` `` (updateNews)
  - `:71` `` `/admin/news/${id}` `` (deleteNews)

Patrón ya presente a imitar — `app/(landing)/feed/actions.ts:28`:

```ts
`/incidents/nearby?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
```

## Comandos que necesitarás

| Propósito | Comando | Esperado |
|-----------|---------|----------|
| Localizar pendientes | ver grep en Done criteria | 0 coincidencias sin codificar tras el fix |
| Typecheck | `pnpm exec tsc --noEmit` | exit 0 |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0 |

## Alcance

**En alcance** (solo estos cuatro archivos):
- `app/(menu)/security/web-staff/actions.ts`
- `app/(menu)/security/groups/actions.ts`
- `app/(menu)/incident/incident-report/actions.ts`
- `app/(menu)/news/actions.ts`

**Fuera de alcance**:
- `feed/actions.ts` — ya codifica sus parámetros.
- Cualquier query string distinta de un `${id}` de path.
- No refactorizar los helpers `authHeaders`/firma de las actions; solo envolver el `id`.

## Git workflow

- Rama: `advisor/005-encode-entity-ids`
- Commit estilo repo: `Fix: codificar IDs en rutas del backend con encodeURIComponent`

## Pasos

### Paso 1: Envolver cada `${id}` con `encodeURIComponent`

En los cuatro archivos, sustituye cada `` `/admin/.../${id}` `` por
`` `/admin/.../${encodeURIComponent(id)}` ``. Ejemplos:

```ts
// web-staff/actions.ts
const res = await get<{ data: Admin }>(`/admin/admins/${encodeURIComponent(id)}`, { headers: await authHeaders() })
const res = await patch<{ data: Admin }>(`/admin/admins/${encodeURIComponent(id)}`, data, { headers: await authHeaders() })
await del(`/admin/admins/${encodeURIComponent(id)}`, { headers: await authHeaders() })

// groups/actions.ts → `/admin/groups/${encodeURIComponent(id)}` (3 sitios)
// incident-report/actions.ts → `/admin/incidents/${encodeURIComponent(id)}` (2 sitios)
// news/actions.ts → `/admin/news/${encodeURIComponent(id)}` (3 sitios)
```

Son **11 sustituciones** en total. No cambies nada más de esas líneas.

**Verify**: el grep del Paso 2 no devuelve rutas `${id}` sin codificar.

### Paso 2: Confirmar que no quedan IDs sin codificar

```
git grep -n '/admin/[a-z]*/\${id}' "app/(menu)"
```

**Verify**: 0 coincidencias (todas pasaron a `${encodeURIComponent(id)}`).

### Paso 3: Build y lint

```
pnpm lint && pnpm exec tsc --noEmit && pnpm build
```

**Verify**: exit 0 en los tres.

## Test plan

Sin framework de tests; verificación manual rápida:

1. Abrir, editar y eliminar un admin, un grupo, una noticia y una incidencia desde la
   UI → todas las operaciones siguen funcionando (las rutas con IDs normales se
   codifican a sí mismas sin cambio de comportamiento).

## Done criteria

- [ ] Las 11 interpolaciones de `${id}` usan `encodeURIComponent(id)`
- [ ] `git grep -n '/admin/[a-z]*/\${id}' "app/(menu)"` → 0 coincidencias
- [ ] `pnpm exec tsc --noEmit` exit 0, `pnpm lint` exit 0, `pnpm build` exit 0
- [ ] Solo los cuatro archivos en alcance modificados (`git status`)
- [ ] Fila de estado de 005 actualizada en `plans/README.md`

## Condiciones STOP

- Alguna ruta usa el `id` de una forma que `encodeURIComponent` rompería (p. ej. un
  segmento compuesto intencional con `/`) → STOP y reporta esa línea; no la codifiques a ciegas.

## Notas de mantenimiento

- Esto es defensa en profundidad, NO un sustituto de las comprobaciones de ownership
  (IDOR) en el backend, que están fuera de este repo.
- Convención para nuevas actions: cualquier valor interpolado en una ruta o query del
  backend se codifica con `encodeURIComponent`.
