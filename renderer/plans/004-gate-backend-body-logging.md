# Plan 004: Condicionar el logging de bodies del backend (minimización de datos)

> **Instrucciones para el ejecutor**: Sigue el plan paso a paso, ejecuta cada
> verificación y confirma el resultado esperado antes de continuar. Ante una
> condición STOP, detente y reporta. Al terminar, actualiza la fila de 004 en
> `plans/README.md`.
>
> **Drift check (ejecutar primero)**:
> `git diff --stat 4904159..HEAD -- lib/logger.ts lib/backendService.ts app/(menu)/news/actions.ts`
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

`logger.error` escribe **siempre** (incluido producción), y los interceptores y
helpers de red le pasan el **body completo** de las respuestas/errores del backend.
Como estas rutas corren del lado del servidor (server actions y `lib/`), el body
acaba en los **logs del servidor** (stdout, agregadores). Esos bodies pueden
contener PII (datos de ciudadanos, admins) o detalles operativos internos. Es un
problema de minimización de datos: en producción no debería persistirse el contenido
de las respuestas, solo metadatos suficientes para diagnosticar (método, ruta, status).

> Aclaración (corrige un falso positivo de la auditoría): este logging es del
> **servidor**, no de la consola del navegador. El cliente solo usa `logger.log`
> para eventos de socket sin PII.

## Estado actual

- `lib/logger.ts` — `error` no está condicionado a dev:

```ts
const isDev = process.env.NODE_ENV !== 'production'
export const logger = {
  log:  (m, ...a) => { if (isDev) console.log(`[LOG] ${m}`, ...a) },
  error:(m, ...a) => { console.error(`[ERROR] ${m}`, ...a) },   // ← siempre, con args
  warn: (m, ...a) => { if (isDev) console.warn(`[WARN] ${m}`, ...a) },
}
```

- `lib/backendService.ts:21-35` — el interceptor loguea el body en éxito (dev) y en
  error pasa `data` (el body del backend) a `logger.error`:

```ts
api.interceptors.response.use(
  (res) => { logger.log(`${...} → ${res.status}`, res.data); return res },
  (err) => {
    if (err.response) {
      const { status, data, config } = err.response
      logger.error(`${...} → ${status}`, data)   // ← body del backend a logs de prod
      return Promise.reject(new ApiError(status, data))
    }
    ...
  }
)
```

- `app/(menu)/news/actions.ts:39` — `sendMultipart` loguea el body parseado:

```ts
logger.log(`${method} ${path} → ${res.status}`, body)
```

## Comandos que necesitarás

| Propósito | Comando | Esperado |
|-----------|---------|----------|
| Typecheck | `pnpm exec tsc --noEmit` | exit 0 |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0 |
| Grep verificación | `git grep -n "logger.error(.*data)" lib` | sin coincidencias tras el fix |

## Alcance

**En alcance**:
- `lib/backendService.ts` (no pasar el body del backend a `logger.error` en prod)
- `app/(menu)/news/actions.ts` (no loguear el body en prod)

**Decisión sobre `lib/logger.ts`**: NO cambiar la firma ni el comportamiento de
`logger.error` (debe seguir registrando errores siempre — son útiles en prod). El
arreglo es **qué se le pasa**, no el logger. Esto evita tocar todos los callers de
`logger.error` del repo.

**Fuera de alcance**:
- Otros usos de `logger.warn`/`logger.log` que no incluyan bodies del backend.
- `SocketProvider.tsx` (loguea ids/reasons de socket, no PII).

## Git workflow

- Rama: `advisor/004-gate-body-logging`
- Commit estilo repo: `Fix: no registrar bodies del backend en logs de produccion`

## Pasos

### Paso 1: Dejar de pasar el body del backend a `logger.error` en producción

En `lib/backendService.ts`, en el handler de error del interceptor, registra el body
solo en dev. Reemplaza la línea de `logger.error(... , data)` por algo como:

```ts
const detail = process.env.NODE_ENV === 'production' ? undefined : data
logger.error(`${config.method?.toUpperCase()} ${config.url} → ${status}`, detail)
```

(En prod queda método + url + status, sin el body. El `ApiError(status, data)` que se
rechaza no cambia — sigue disponible para que las actions lo mapeen a mensajes.)

**Verify**: `git diff` muestra que `logger.error` ya no recibe `data` directamente en prod.

### Paso 2: Condicionar el log de éxito del interceptor (opcional, mismo criterio)

La línea de éxito `logger.log(..., res.data)` ya está silenciada en prod (porque
`logger.log` chequea `isDev`), así que **no requiere cambio**. Confírmalo leyendo
`lib/logger.ts`. No la toques.

**Verify**: `logger.log` sigue gateado por `isDev` en `lib/logger.ts`.

### Paso 3: Igual criterio en `news/actions.ts`

En `app/(menu)/news/actions.ts:39`, `sendMultipart` usa `logger.log` (ya gateado por
`isDev`), por lo que el body NO se loguea en prod. **Verifícalo**; si tras revisar
prefieres además no loguear el body ni en dev por consistencia, puedes dejar solo
`logger.log(\`${method} ${path} → ${res.status}\`)` sin el body. Cambio menor y opcional.

**Verify**: en prod, ningún `console.*` recibe el body del backend en esta ruta.

### Paso 4: Build y lint

```
pnpm lint && pnpm exec tsc --noEmit && pnpm build
git grep -n "logger.error" lib app   # revisar manualmente que ninguno pase bodies en prod
```

**Verify**: lint/tsc/build exit 0; la revisión del grep confirma que no quedan bodies
del backend en `logger.error` sin gate.

## Done criteria

- [ ] `lib/backendService.ts`: el body del backend no llega a `logger.error` en producción
- [ ] Confirmado que `logger.log` sigue gateado por `isDev` (sin cambios en `lib/logger.ts`)
- [ ] `pnpm exec tsc --noEmit` exit 0, `pnpm lint` exit 0, `pnpm build` exit 0
- [ ] Solo archivos en alcance modificados (`git status`)
- [ ] Fila de estado de 004 actualizada en `plans/README.md`

## Condiciones STOP

- Quitar el body de los logs de error dificulta un diagnóstico que el equipo
  considera imprescindible en prod → STOP y propón un punto medio (p. ej. loguear solo
  un código de error del body, nunca campos de datos).
- Descubres que `logger.error` se usa en componentes de cliente con PII → STOP: amplía
  el alcance y reporta antes de seguir.

## Notas de mantenimiento

- Regla para el equipo: en producción, loguear metadatos (método/ruta/status/ids de
  correlación), nunca bodies de request/response.
- Un revisor debe escanear nuevos `logger.error(..., <algo>)` en PRs para que el
  segundo argumento no sea un body del backend.
