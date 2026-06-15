# Plan 002: Ticket WS de vida corta — dejar de exponer el Bearer al cliente (spike)

> **Instrucciones para el ejecutor**: Este es un plan de **spike/diseño**, no de
> "implementa todo". La solución correcta requiere un endpoint nuevo en el
> backend (fuera de este repo). Tu trabajo: (1) confirmar el problema, (2)
> implementar la parte de frontend que sea segura hacer ya, (3) documentar el
> contrato que el backend debe cumplir y las preguntas abiertas. Respeta las
> condiciones STOP. Al terminar, actualiza la fila de 002 en `plans/README.md`.
>
> **Drift check (ejecutar primero)**:
> `git diff --stat 4904159..HEAD -- app/api/auth/ws-token app/(menu)/_components/SocketProvider.tsx lib/session.ts`
> Si algún archivo en alcance cambió, compara con los excerpts de "Estado actual"
> antes de continuar; ante discrepancia, trátalo como condición STOP.

## Estado

- **Prioridad**: P1
- **Esfuerzo**: M
- **Riesgo**: MED
- **Depende de**: ninguno (pero la implementación completa está bloqueada por el backend)
- **Categoría**: security
- **Planned at**: commit `4904159`, 2026-06-12

## Por qué importa

La cookie de sesión es **httpOnly** precisamente para que JavaScript del cliente no
pueda leer el token (`lib/session.ts:9-15`). Pero la ruta `GET /api/auth/ws-token`
devuelve **ese mismo token** a cualquier fetch del mismo origen, y `SocketProvider`
lo lee desde el cliente para autenticar el socket. Esto **anula** la protección
httpOnly: cualquier vulnerabilidad XSS en el dashboard puede leer el token (vía
`fetch('/api/auth/ws-token')`) y exfiltrarlo. El token es la credencial de sesión
completa, autoriza TODAS las llamadas REST al backend y vive **7 días**
(`lib/session.ts:7`). Resultado: una XSS pasa de "robar lo que se ve" a "tomar la
cuenta por 7 días".

El objetivo es que el cliente nunca tenga en mano la credencial REST de larga vida:
el socket debe autenticarse con un **ticket de vida corta, de un solo uso y de
alcance limitado a WebSocket**, emitido por el backend y canjeado al conectar.

## Estado actual

Archivos relevantes:

- `lib/session.ts` — crea/lee la cookie de sesión. Excerpt:

```ts
const SESSION_COOKIE = 'ciudadano-session'
export async function createSession(token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,                                  // ← protección que se anula
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt, sameSite: 'lax', path: '/',
  })
}
export async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}
```

- `app/api/auth/ws-token/route.ts` — **el problema**. Devuelve el Bearer crudo:

```ts
import { getSession } from '@/lib/session'
export async function GET() {
  const token = await getSession()
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  return Response.json({ token })   // ← entrega el token de sesión al cliente
}
```

- `app/(menu)/_components/SocketProvider.tsx:12-21,59-73` — el cliente consume el
  token y lo pasa a socket.io:

```ts
async function fetchToken(): Promise<string | null> {
  const res = await fetch('/api/auth/ws-token', { cache: 'no-store' })
  ...
  return body.token ?? null
}
// ...
const token = await fetchToken()
const socket = io(`${BACKEND_URL}/admin`, { auth: { token }, transports: ['websocket'], ... })
```

Convenciones a respetar: rutas API en `app/api/...` con `export async function GET()`
estilo App Router; imports con alias `@/`; logging vía `@/lib/logger`.

## Comandos que necesitarás

| Propósito | Comando | Esperado |
|-----------|---------|----------|
| Typecheck | `pnpm exec tsc --noEmit` | exit 0 |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0 |

(No hay framework de tests; verificación funcional es manual — ver Test plan.)

## Alcance

**En alcance**:
- `app/api/auth/ws-token/route.ts` (modificar — canjear sesión por ticket del backend)
- `app/(menu)/_components/SocketProvider.tsx` (sin cambios de contrato si la ruta
  sigue devolviendo `{ token }`; tocar solo si cambia el shape)
- `plans/002-...md` (este archivo: rellenar la sección "Hallazgos del spike" al final)

**Fuera de alcance**:
- `lib/session.ts` — la cookie httpOnly está bien; no debilitarla.
- Cualquier cambio en cómo las server actions usan el Bearer para REST: este plan
  es solo el canal del socket.
- No implementar el endpoint del backend desde aquí (otro repo); solo definir su contrato.

## Pasos

### Paso 1: Confirmar el problema (read-only)

Relee los tres excerpts de "Estado actual" en el código vivo y confirma que
`ws-token` devuelve el valor de `getSession()` sin transformarlo. Confirma con
`git grep -n "ws-token"` que `SocketProvider.tsx` es el **único** consumidor.

**Verify**: `git grep -n "ws-token"` lista solo `route.ts` y `SocketProvider.tsx`.

### Paso 2: Definir el contrato del ticket WS (documentar, no implementar backend)

En la sección "Hallazgos del spike" (al final de este archivo) documenta el contrato
que el backend debe ofrecer. Forma recomendada:

- `POST /admin/auth/ws-ticket` con `Authorization: Bearer <session>` →
  `{ data: { ticket: string, expiresInSec: number } }`.
- El `ticket`: vida corta (p. ej. 30–60 s), **un solo uso**, alcance solo-WebSocket
  (no sirve para llamadas REST), invalidado al canjearse o al expirar.
- El gateway de socket.io del backend acepta `auth: { token: ticket }` y lo canjea
  contra la sesión real en el handshake.

Esto es lo que hay que acordar con backend. Anota explícitamente que es un **bloqueo**.

### Paso 3: Cambiar `ws-token/route.ts` para emitir el ticket (cuando exista el endpoint)

Reescribe el handler para que, en vez de devolver la sesión, la canjee por un ticket:

```ts
import { getSession } from '@/lib/session'
import { post, ApiError } from '@/lib/backendService'

interface TicketBody { data: { ticket: string; expiresInSec: number } }

export async function GET() {
  const token = await getSession()
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const res = await post<TicketBody>('/admin/auth/ws-ticket', {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return Response.json({ token: res.data.ticket }) // mismo shape { token } → cliente intacto
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    throw err
  }
}
```

Manteniendo el shape `{ token }`, **`SocketProvider.tsx` no necesita cambios**: ahora
recibe un ticket efímero en lugar del Bearer de 7 días.

**Verify**: `pnpm exec tsc --noEmit` exit 0; `git diff` muestra que `route.ts` ya no
referencia directamente el valor de sesión en la respuesta.

### Paso 4: Verificar build y flujo manual

```
pnpm lint && pnpm exec tsc --noEmit && pnpm build
```

**Verify**: exit 0 en los tres.

## Test plan

No hay framework de tests. Verificación manual (requiere el endpoint del backend):

1. Login en el dashboard → el socket conecta (`session.connected` en consola en dev).
2. En DevTools, `fetch('/api/auth/ws-token').then(r=>r.json())` → el valor devuelto
   es el **ticket efímero**, NO el token de sesión, y deja de funcionar para llamadas
   REST y tras ~60 s.
3. Cerrar y reabrir sesión sigue conectando el socket correctamente.

## Done criteria

- [ ] Sección "Hallazgos del spike" rellenada con el contrato del endpoint y las preguntas abiertas
- [ ] Si el endpoint del backend existe: `ws-token/route.ts` emite el ticket y el cliente sigue conectando
- [ ] Si NO existe aún: estado del plan = BLOCKED con "esperando POST /admin/auth/ws-ticket en backend"
- [ ] `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build` exit 0
- [ ] Fila de estado de 002 actualizada en `plans/README.md`

## Condiciones STOP

- El backend **no** ofrece (ni puede ofrecer pronto) un endpoint de ticket WS de
  vida corta → marca BLOCKED y reporta; **no** "arregles" debilitando la cookie a
  no-httpOnly ni metiendo el token en localStorage (sería peor).
- Cambiar `route.ts` rompe la conexión del socket en pruebas manuales → STOP, el
  shape del ticket no coincide con lo que espera el gateway.
- Descubres otro consumidor de `/api/auth/ws-token` además de `SocketProvider` → STOP
  y replantea el alcance.

## Notas de mantenimiento

- Mitigación complementaria (no sustituye el ticket, súmala si es barata): reducir la
  vida de la sesión y/o rotación del token reduce la ventana de un robo de Bearer.
- Un revisor debe verificar que el nuevo `route.ts` nunca devuelva el valor de
  `getSession()` directamente en ninguna rama.
- Endurecer contra XSS (CSP, escape) sigue siendo valioso aparte: este plan limita el
  *impacto* de una XSS sobre el socket, no elimina la XSS.

---

## Hallazgos del spike — IMPLEMENTADO (2026-06-12)

El backend está en el mismo workspace (`ciudadano-rest-api`, NestJS + JWT +
socket.io), así que el ticket se implementó end-to-end en vez de quedar como spike.

### Contrato del endpoint

- **`POST /admin/auth/ws-ticket`** — guard `JwtAdminGuard` (requiere el `Bearer`
  de sesión). Respuesta: `{ data: { ticket: string, expiresInSec: number } }`.
- **Ticket** = JWT de **60 s** firmado con el mismo `JWT_SECRET`, con claims
  `{ sub, role:"admin", sid, typ:"ws" }`. El claim `typ:"ws"` es la marca de
  alcance solo-WebSocket.

### Alcance enforced (defensa en profundidad)

- **Gateway** (`admin-session.gateway.ts`): ahora verifica con
  `AdminTokenContract.verifyWsTicket`, que **exige `typ:"ws"`** → el token de
  sesión de 30 días ya NO autentica el socket.
- **Strategy REST** (`jwt-admin.strategy.ts`): rechaza cualquier token con
  `typ:"ws"` → el ticket NO sirve para llamadas REST aunque siga vigente.
- Resultado: el cliente solo recibe un ticket de 60 s, sin valor REST. Robarlo vía
  XSS da, como mucho, 60 s de conexión de socket — no la sesión completa.

### Archivos backend (rama `advisor/002-ws-ticket`)

- `domain/contracts/admin-token.contract.ts` — `generateWsTicket` / `verifyWsTicket`
- `infrastructure/services/admin-token.service.ts` — impl (`WS_TICKET_EXPIRATION_TIME = 60`, claim `typ`)
- `application/usecases/generate-ws-ticket.use-case.ts` — NUEVO
- `infrastructure/rest/controllers/admin-auth.controller.ts` — endpoint `ws-ticket`
- `admin-auth.module.ts` — registro del use-case
- `infrastructure/ws/admin-session.gateway.ts` — `verifyWsTicket`
- `infrastructure/rest/strategies/jwt-admin.strategy.ts` — rechaza `typ:"ws"`

Frontend: `app/api/auth/ws-token/route.ts` canjea el ticket (shape `{ token }`
intacto → `SocketProvider` sin cambios).

### Verificación

- Backend `npm run build` (nest/tsc) exit 0. Frontend `tsc`/`lint`/`build` exit 0.

### ⚠️ Caveat de despliegue (un solo uso NO implementado)

- **Deploy acoplado**: el gateway ahora **exige** `typ:"ws"`. Si el backend nuevo
  se despliega con un frontend viejo (que manda el token de sesión al socket), el
  gateway lo rechaza y el socket no conecta (dispara el flujo de sesión revocada →
  login). Desplegar backend + frontend juntos.
- **Un solo uso**: el ticket es de vida corta (60 s) pero **no es single-use**
  (re-jugable dentro de su ventana). Para single-use real haría falta persistir un
  jti/nonce y marcarlo consumido en el handshake. Quedó como mejora futura; la vida
  de 60 s ya acota la ventana drásticamente. Decidir si vale el costo del store.
