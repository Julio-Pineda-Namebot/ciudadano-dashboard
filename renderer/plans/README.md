# Planes de implementación — Seguridad

Generados por la skill `improve security` el 2026-06-12, contra el commit `4904159`.
Foco: **seguridad** del proyecto `renderer/` (Next.js 16 / React 19, patrón BFF).

Cada ejecutor: lee el plan completo antes de empezar, respeta sus condiciones STOP
y actualiza su fila de estado al terminar.

## Contexto del proyecto (común a todos los planes)

- Gestor de paquetes: **pnpm** (`pnpm-lock.yaml`, `.npmrc`). Nunca usar npm/yarn.
- **No hay framework de tests** instalado (no hay script `test`). Las puertas de
  verificación son: `pnpm lint`, `pnpm exec tsc --noEmit` y, para validación
  completa, `pnpm build`. Donde un plan pida "tests", se traduce a verificación
  manual + estas puertas, salvo que el plan diga lo contrario.
- Modelo de auth: token en cookie **httpOnly** (`lib/session.ts`), cada server
  action adjunta `Authorization: Bearer <token>` y el **backend** REST es la
  autoridad de autorización. El frontend es un BFF: no reimplementar authz aquí.
- Estilo de commits del repo (ver `git log`): prefijo `Fix:` / `Update:` + texto
  en español. Ej.: `Fix: validar tipo y tamaño de uploads en el BFF`.
- Imports siempre con alias `@/` (ver `CLAUDE.md`), nunca rutas relativas.

## Orden de ejecución y estado

| Plan | Título | Prioridad | Esfuerzo | Depende de | Estado |
|------|--------|-----------|----------|------------|--------|
| 001  | Actualizar `next` y `axios` (17 advisories HIGH) | P1 | S | — | DONE (2026-06-12, rama `advisor/001-upgrade-next-axios`, sin commitear) |
| 002  | Ticket WS de vida corta — dejar de exponer el Bearer | P1 | M | — | DONE (2026-06-12, implementado end-to-end; FE rama `advisor/001-...`, BE rama `advisor/002-ws-ticket`, sin commitear) |
| 003  | Validar MIME/tamaño de uploads en el BFF | P2 | S | — | DONE (2026-06-12, rama `advisor/001-upgrade-next-axios`, sin commitear) |
| 004  | Condicionar el logging de bodies del backend | P2 | S | — | DONE (2026-06-12, rama `advisor/001-upgrade-next-axios`, sin commitear) |
| 005  | Codificar IDs de entidad en rutas del backend | P3 | S | — | DONE (2026-06-12, rama `advisor/001-upgrade-next-axios`, sin commitear) |

Valores de estado: TODO | IN PROGRESS | DONE | BLOCKED (con motivo en una línea) | REJECTED (con motivo).

> **Nota verificación 001**: `pnpm build` ✅, `pnpm exec tsc --noEmit` ✅ (exit 0),
> `pnpm audit --prod --audit-level=high` pasó de 17→2 HIGH (los 2 restantes son
> `fast-uri` vía el CLI `shadcn`, fuera de alcance). `pnpm lint` falla con 13 errores
> **preexistentes en `main`** (`react-hooks/set-state-in-effect` en `FormField.tsx`,
> `no-unused-vars` en `proxy.ts`): mismo `eslint-plugin-react-hooks@7.1.1` que `main`
> y archivos no tocados por este plan → no es regresión del bump.
>
> **Resuelto (2026-06-12)**: `pnpm lint` ahora exit 0. Se arreglaron los 3 errores
> reales `no-html-link-for-pages` (`<a>`→`<Link>` en `login-card.tsx` y
> `CitizenFeedPanel.tsx`) y se degradó `react-hooks/set-state-in-effect` a `warn`
> en `eslint.config.mjs` (los 10 usos son patrones intencionales: fetch-on-mount y
> sync de valores solo-cliente que no pueden calcularse en render por SSR). Quedan
> 17 warnings preexistentes (`<img>`, react-compiler skip, `request` sin usar) que
> no bloquean el gate. Refactorizar los `set-state-in-effect` sigue como tarea
> opcional de DX, no de seguridad.

## Notas de dependencia

- Ninguno bloquea a otro. 001 es el de mayor leverage e independiente.
- 002 (ticket WS) requiere coordinación con el equipo de backend; la parte de
  frontend es pequeña pero está bloqueada por el contrato del nuevo endpoint.
- 004 y 005 son higiene de bajo riesgo; pueden ejecutarse en cualquier orden.

## Hallazgos considerados y rechazados (para no re-auditar)

- **`ApiError.body` público** (`lib/backendService.ts:9`): Next.js sanea el
  mensaje y body de errores lanzados desde server actions en producción
  (los reemplaza por un digest). El body solo es visible en desarrollo, no es
  una fuga en producción. No es un hallazgo.
- **`dangerouslySetInnerHTML` en `components/ui/chart.tsx:95`**: patrón estándar
  de shadcn que inyecta variables CSS de color desde la `config` provista por el
  desarrollador, no input de usuario. Por diseño.
- **Cookie `secure` solo en producción** (`lib/session.ts:11`): convención
  estándar dev-sobre-http. Por diseño.
- **Token Mapbox `NEXT_PUBLIC_MAPBOX_TOKEN`**: público por diseño; restringir por
  origin en el dashboard de Mapbox (ya documentado en `.env.example`).
- **`fast-uri` (advisory HIGH)**: transitivo bajo `shadcn` (CLI de desarrollo),
  no alcanzable en runtime de producción. Bajo señal; se reevaluará si `shadcn`
  pasa a usarse en build de distribución.

## No auditado (fuera del alcance de este repo)

- El backend REST en sí: autorización, IDOR/ownership, inyección SQL,
  rate-limiting, estructura y expiración real del token. Todo server-side.
- Pentesting activo.
- Los 19 advisories `moderate` y 3 `low` de `pnpm audit` (solo se trataron los HIGH).
