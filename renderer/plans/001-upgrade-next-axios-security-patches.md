# Plan 001: Actualizar `next` y `axios` a versiones parcheadas (17 advisories HIGH)

> **Instrucciones para el ejecutor**: Sigue este plan paso a paso. Ejecuta cada
> comando de verificación y confirma el resultado esperado antes de pasar al
> siguiente paso. Si ocurre algo de la sección "Condiciones STOP", detente y
> reporta — no improvises. Al terminar, actualiza la fila de estado de este plan
> en `plans/README.md`.
>
> **Drift check (ejecutar primero)**:
> `git diff --stat 4904159..HEAD -- package.json pnpm-lock.yaml`
> Si `package.json` o el lockfile cambiaron desde que se escribió este plan,
> compara las versiones actuales de `next` y `axios` con las de abajo antes de
> continuar; si ya están parcheadas, marca el plan DONE/REJECTED según corresponda.

## Estado

- **Prioridad**: P1
- **Esfuerzo**: S
- **Riesgo**: MED
- **Depende de**: ninguno
- **Categoría**: migration / security
- **Planned at**: commit `4904159`, 2026-06-12

## Por qué importa

`pnpm audit --prod --audit-level=high` reporta **17 advisories HIGH**, todos en dos
dependencias de runtime: `next@16.2.4` y `axios@1.15.1`. Son explotables en este
proyecto, no ruido transitivo:

- **next**: incluye múltiples *Middleware/Proxy bypass en App Router* — este
  proyecto usa middleware de App Router (`proxy.ts`) — además de SSRF y varios DoS
  con Server Components/conexiones. Parcheados en `16.2.5`/`16.2.6`.
- **axios**: transporta el token `Authorization: Bearer` a TODAS las llamadas al
  backend (`lib/backendService.ts`). Los advisories incluyen *prototype pollution*
  con inyección de credenciales / request hijacking, *credential theft & response
  manipulation*, fuga de `Proxy-Authorization` en redirects, y ReDoS. Parcheados
  en `1.15.2`/`1.16.0`.

Al ser una subida de versión menor/patch dentro del mismo major, el costo es bajo y
el riesgo de regresión acotado. Es el cambio de mayor leverage de toda la auditoría.

## Estado actual

Archivo `package.json` (raíz de `renderer/`), versiones relevantes hoy:

```jsonc
// dependencies
"axios": "^1.15.1",
"next": "16.2.4",
// devDependencies
"eslint-config-next": "16.2.4",
```

- `axios` se usa en `lib/backendService.ts:16` (instancia compartida que añade el
  Bearer) y en todas las server actions vía ese módulo.
- `next` es el framework; `proxy.ts` (raíz) es middleware de App Router.
- `eslint-config-next` está pineado a `16.2.4` y **debe** subir a la par de `next`
  para evitar desalineación de reglas de lint.

Objetivo de versiones (cubren los 17 HIGH):

- `next` → **>= 16.2.6** (la mayoría se parchan en 16.2.5; un proxy-bypass requiere 16.2.6).
- `axios` → **>= 1.16.0** (cubre todos: credential theft 1.15.2, y shouldBypassProxy /
  ReDoS / resource-limits / proxy-auth-leak 1.16.0).
- `eslint-config-next` → **igualar** la versión final de `next`.

## Comandos que necesitarás

| Propósito | Comando | Esperado en éxito |
|-----------|---------|-------------------|
| Auditar (antes/después) | `pnpm audit --prod --audit-level=high` | tras el fix: ni `next` ni `axios` aparecen |
| Actualizar deps | `pnpm add next@^16.2.6 axios@^1.16.0` | exit 0, lockfile actualizado |
| Actualizar dev dep | `pnpm add -D eslint-config-next@^16.2.6` | exit 0 |
| Typecheck | `pnpm exec tsc --noEmit` | exit 0, sin errores |
| Lint | `pnpm lint` | exit 0 |
| Build completo | `pnpm build` | exit 0, "Compiled successfully" |

(Comandos verificados durante recon: gestor = pnpm; no existe script `test`.)

## Alcance

**En alcance** (únicos archivos a modificar):
- `package.json`
- `pnpm-lock.yaml` (lo regenera pnpm; no editar a mano)

**Fuera de alcance** (NO tocar):
- Cualquier código de `lib/backendService.ts`, `proxy.ts` u otro: este plan es solo
  subida de versiones. Si un cambio de API de `next`/`axios` obliga a tocar código,
  es una **condición STOP** (ver abajo) — no lo improvises aquí.
- No actualizar otras dependencias "de paso". Una dep = un cambio auditable.

## Git workflow

- Rama: `advisor/001-upgrade-next-axios`
- Un commit, estilo del repo: `Fix: actualizar next y axios a versiones con parches de seguridad`
- No hacer push ni abrir PR salvo que el operador lo indique.

## Pasos

### Paso 1: Registrar el estado de seguridad previo

Ejecuta `pnpm audit --prod --audit-level=high` y guarda el conteo final
("N vulnerabilities found ... X high"). Sirve de línea base para comparar.

**Verify**: el comando termina y muestra una línea resumen con conteo de `high`.

### Paso 2: Actualizar `next` y `axios`

```
pnpm add next@^16.2.6 axios@^1.16.0
pnpm add -D eslint-config-next@^16.2.6
```

**Verify**: `package.json` muestra `next` >= 16.2.6, `axios` >= 1.16.0 y
`eslint-config-next` alineado; `pnpm-lock.yaml` quedó modificado.

### Paso 3: Confirmar que los advisories HIGH de next/axios desaparecieron

```
pnpm audit --prod --audit-level=high
```

**Verify**: ni `next` ni `axios` aparecen ya en la salida. (Puede quedar
`fast-uri` vía `shadcn`; eso es esperado y está fuera de alcance — ver
`plans/README.md` → rechazados.)

### Paso 4: Verificar que el proyecto sigue compilando

```
pnpm exec tsc --noEmit   # exit 0
pnpm lint                # exit 0
pnpm build               # exit 0, "Compiled successfully"
```

**Verify**: los tres salen con exit 0. Si `next build` falla por un cambio de API,
es condición STOP.

## Done criteria

Todas deben cumplirse:

- [ ] `package.json`: `next` >= 16.2.6, `axios` >= 1.16.0, `eslint-config-next` alineado a `next`
- [ ] `pnpm audit --prod --audit-level=high` ya no lista `next` ni `axios`
- [ ] `pnpm exec tsc --noEmit` exit 0
- [ ] `pnpm lint` exit 0
- [ ] `pnpm build` exit 0
- [ ] Ningún archivo fuera de `package.json`/`pnpm-lock.yaml` modificado (`git status`)
- [ ] Fila de estado de 001 actualizada en `plans/README.md`

## Condiciones STOP

Detente y reporta (no improvises) si:

- `pnpm build` o `pnpm exec tsc --noEmit` falla por un cambio de API en `next` o
  `axios` (p. ej. firma de middleware, opciones del cliente axios). Reportar el
  error exacto: requiere un plan de migración aparte, no parchear a ciegas.
- El audit sigue listando `next` o `axios` como HIGH tras la subida (puede haber
  otra ruta de dependencia; reportar la columna "Paths").
- La subida arrastra un cambio major inesperado de alguna dep (revisar el diff del lockfile).

## Notas de mantenimiento

- Tras mergear, vale la pena dejar `pnpm audit` corriendo en CI con
  `--audit-level=high` para no volver a acumular deuda.
- `proxy.ts` (middleware de App Router) es justo la superficie de varios de los
  advisories de `next` parcheados; un revisor debería confirmar que el
  comportamiento de `proxy.ts` no cambió tras la subida.
- Diferido: los 19 `moderate` / 3 `low` restantes del audit no se tratan aquí.
