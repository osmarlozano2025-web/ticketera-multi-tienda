# Reglas Técnicas (Tech Stack) — Ticketera Multi-Tienda

## 1. Stack elegido

| Capa | Tecnología | Rol |
|---|---|---|
| Frontend | **React + Vite + TypeScript** | SPA del panel de empresa y del panel super admin |
| Estilos | **Tailwind CSS** | Implementación rápida de los patrones definidos en `diseno.md` |
| Componentes UI | **shadcn/ui** (Radix + Tailwind) | Base accesible para modales, dropdowns, tabs, toasts — evita reinventar primitivos y encaja directo con Tailwind |
| Backend / DB | **Supabase** (Postgres + Auth + Storage + Realtime) | Base de datos, autenticación, RLS multi-tenant, storage de fotos |
| Hosting | **Vercel** | Deploy del frontend, preview deployments por PR |
| Formularios | **React Hook Form + Zod** | Validación de los formularios largos (alta de ticket, invitación de usuario) con tipado compartido |
| Routing | **React Router** | Rutas del panel de empresa + rutas separadas del panel super admin |
| Data fetching | **TanStack Query** sobre el cliente JS de Supabase | Cache, refetch e invalidación tras mutaciones (ej. al cambiar estado de un ticket) |

## 2. Por qué este stack (evaluado contra los 6 factores)

1. **Curva de aprendizaje**: React + Vite + Tailwind es el combo más documentado y con más ejemplos del ecosistema actual — bajo riesgo de bloqueo. Supabase abstrae Postgres/Auth/Storage detrás de un SDK simple, evitando escribir un backend propio desde cero.
2. **Comunidad y ecosistema**: los cinco pilares (React, Tailwind, Supabase, Vercel, shadcn/ui) tienen comunidades muy activas y son la combinación de facto recomendada por la propia metodología (`paso1_prd.md`, `paso2_diseno.md`).
3. **Compatibilidad entre piezas**: Supabase Auth + RLS resuelve el requisito más crítico del PRD (aislamiento multi-tenant) sin backend intermedio — el frontend consulta Postgres directo con políticas RLS que garantizan el filtro por `empresa_id`, con menos superficie de bugs que reimplementar ese filtro a mano en cada endpoint.
4. **Rendimiento y costo según escala esperada**: para un MVP con decenas de empresas y cientos de tickets, Supabase free/pro tier y Vercel hobby/pro alcanzan sobrado. No hace falta microservicios ni colas — se evalúa si hace falta escalar más adelante, no ahora.
5. **Experiencia y disponibilidad del equipo**: React/TS es la stack más fácil de encontrar talento en el mercado actual si el proyecto crece y hay que sumar gente.
6. **Preparación a futuro**: los 5 pilares tienen roadmaps activos y compromiso de compatibilidad hacia atrás — bajo riesgo de quedar obsoletos en el horizonte de este proyecto.

## 3. Decisiones técnicas específicas del dominio

- **RLS por `empresa_id`** en todas las tablas de negocio (`tickets`, `tiendas`, `usuarios`, `ordenes_compra`, `envios`, `grupos`, `proveedores`), usando `auth.jwt()` para resolver la empresa del usuario logueado. `super_admin` usa una política de bypass separada, no acceso directo sin RLS.
- **Numeración de ticket por empresa** (`numero_ticket` correlativo, no serial global): se implementa con una función Postgres (`nextval` sobre una secuencia por empresa, o una tabla de contadores con `SELECT ... FOR UPDATE`) para evitar colisiones bajo concurrencia.
- **Fotos** van a Supabase Storage en un bucket privado, con policy de acceso ligada a `empresa_id` — nunca URLs públicas directas de fotos de tickets.
- **Invitación de usuarios** vía `supabase.auth.admin.inviteUserByEmail` desde una función server-side (Supabase Edge Function), no desde el cliente, porque requiere la service role key — nunca exponerla en el frontend.
- **Timeline (`ticket_eventos`)** se escribe automáticamente vía trigger de Postgres en cada cambio de estado (no confiar en que el frontend siempre inserte el evento manualmente) — así el timeline queda consistente incluso si en el futuro se agrega otra vía de escritura (ej. una API externa).

## 4. Qué NO usar en el MVP (y por qué)

- **Backend propio (Node/Express/NestJS)**: innecesario — Supabase + RLS + Edge Functions cubre toda la lógica server-side que hace falta (invitaciones, triggers). Agregar un backend propio sería sobre-ingeniería para este alcance.
- **Microservicios / colas de mensajería**: la escala del MVP no lo justifica.
- **App nativa / React Native**: fuera de alcance según PRD §4 — queda como web responsive.
- **GraphQL**: el cliente de Supabase sobre REST/Postgres alcanza; sumar una capa GraphQL agregaría complejidad sin necesidad real acá.

---

*Generado en el Paso 3 (Tech Stack) de la metodología de 6 pasos. Próximo paso: `todo.md` con el desglose de tareas.*
