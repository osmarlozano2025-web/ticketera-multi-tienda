# todo.md — Ticketera Multi-Tienda

Desglose de tareas a partir de `prd.md`, `diseno.md` y `tech-stack.md`. Se avanza una funcionalidad a la vez, en el orden listado — no saltear.

## 0. Setup del proyecto
- [ ] Crear repo Git dedicado para este proyecto (separado del monorepo de clientes)
- [ ] Inicializar proyecto Vite + React + TypeScript
- [ ] Instalar y configurar Tailwind CSS
- [ ] Instalar shadcn/ui y configurar tema (paleta de `diseno.md` §1)
- [ ] Instalar React Router, TanStack Query, React Hook Form + Zod
- [ ] Crear proyecto en Supabase (vía MCP) y conectar variables de entorno (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- [ ] Configurar Vercel (vía MCP), conectar el repo, variables de entorno de producción

## 1. Base de datos y seguridad
- [ ] Migración: tabla `empresas`
- [ ] Migración: tabla `usuarios` (con `rol`, `grupo_id`, `empresa_id`)
- [ ] Migración: tabla `grupos`
- [ ] Migración: tabla `usuario_tiendas`
- [ ] Migración: tabla `tiendas`
- [ ] Migración: tabla `tickets` (con `numero_ticket`, `urgencia`, `tipo_tramite`, `estado`, `requiere_compra`, `requiere_logistica`)
- [ ] Migración: tabla `ticket_fotos`
- [ ] Migración: tabla `ticket_eventos`
- [ ] Migración: tabla `ordenes_compra`
- [ ] Migración: tabla `proveedores`
- [ ] Migración: tabla `envios`
- [ ] Función/secuencia Postgres para `numero_ticket` correlativo por `empresa_id`
- [ ] Trigger Postgres: insertar fila en `ticket_eventos` en cada cambio de `estado` de un ticket
- [ ] Políticas RLS por `empresa_id` en todas las tablas de negocio
- [ ] Política RLS de bypass para `super_admin`
- [ ] Bucket de Storage privado para fotos de tickets + policy de acceso por `empresa_id`
- [ ] Seed de datos de prueba: 2 empresas, tiendas, usuarios de cada rol, algunos tickets en distintos estados

## 2. Autenticación y layout base
- [ ] Configurar Supabase Auth (email/password)
- [ ] Pantalla de login
- [ ] Edge Function `invite-user` (usa service role, llama `inviteUserByEmail`)
- [ ] Flujo de aceptación de invitación (setear contraseña + crear fila en `usuarios`)
- [ ] Layout base: sidebar colapsable + topbar (según `diseno.md` §2)
- [ ] Lógica de menú condicional por rol (ocultar ítems según tabla de roles del PRD)
- [ ] Guard de rutas: redirigir según rol si intenta acceder a un módulo sin permiso
- [ ] Layout separado para `super_admin` (sin las secciones de empresa)

## 3. Módulo Tickets
- [ ] Vista lista: tabs por estado con contador (`diseno.md` §3.1)
- [ ] Vista lista: filtros rápidos (tienda, grupo, urgencia)
- [ ] Vista lista: fila de ticket con badges de estado/urgencia/compra/logística
- [ ] Estado vacío de la lista
- [ ] Formulario de alta de ticket (modal fullscreen, `diseno.md` §3.3), con upload de fotos a Storage
- [ ] Vista detalle de ticket: columna principal (datos, fotos, timeline, comentarios)
- [ ] Vista detalle de ticket: columna lateral (estado + botón de transición según matriz PRD §2.1, asignación de grupo, toggles requiere_compra/requiere_logistica)
- [ ] Lógica de permisos de transición de estado por rol (matriz PRD §2.1) — validar también server-side (policy o función), no solo ocultar el botón en el frontend
- [ ] Componente de comentario nuevo (inserta en `ticket_eventos`)
- [ ] Numeración `#numero_ticket` visible en toda la UI

## 4. Módulo Compras
- [ ] Vista lista de órdenes de compra, tabs por estado
- [ ] Alta de orden de compra desde el detalle de un ticket `requiere_compra`
- [ ] Sub-tab Proveedores: lista + alta simple (modal)
- [ ] Cambio de estado de orden (Pendiente → Comprado → Entregado)

## 5. Módulo Logística
- [ ] Vista lista de envíos, tabs por estado
- [ ] Alta de envío desde el detalle de un ticket `requiere_logistica`
- [ ] Cambio de estado de envío (Pendiente → En tránsito → Entregado)

## 6. Módulo Tiendas
- [ ] Grid de tarjetas de tienda (con mini-mapa si tiene `lat/lng`)
- [ ] Alta/edición de tienda (con selector de ubicación en mapa)
- [ ] Detalle de tienda: datos + tickets recientes + encargados asignados

## 7. Módulo Usuarios / Equipo
- [ ] Tabla de miembros con badge de rol
- [ ] Modal "+ Invitar miembro" con campos condicionales por rol (grupo si operario, tiendas si encargado)
- [ ] Sub-tab Grupos/Cuadrillas: lista + alta/edición/baja
- [ ] Gestión de `usuario_tiendas` (asignar/desasignar tiendas a un encargado)

## 8. Panel Super Admin
- [ ] Dashboard con tarjetas KPI (empresas activas, tickets totales, usuarios totales, empresas nuevas del mes)
- [ ] Tabla de empresas (alta, tiendas, usuarios, tickets, estado)
- [ ] Acción suspender/activar empresa
- [ ] Flujo de alta de nueva empresa (registro de tenant + admin inicial)

## 9. Pulido final
- [ ] Revisión responsive (sidebar colapsado en mobile, formulario de alta de ticket usable desde celular)
- [ ] Estados vacíos en todos los módulos (no solo Tickets)
- [ ] Toasts de confirmación en todas las mutaciones (crear, editar, cambiar estado)
- [ ] Revisión de accesibilidad básica de shadcn/ui (foco, contraste, labels)
- [ ] Chequeo manual de aislamiento multi-tenant (loguearse con 2 empresas de prueba y confirmar que no hay fuga de datos)

## 10. Preparar producción
- [ ] Variables de entorno de producción en Vercel
- [ ] Deploy final y smoke test de las historias de usuario del PRD §8
- [ ] Subir a GitHub y activar CodeRabbit (Paso 6 de la metodología)

---

*Generado en el Paso 4 de la metodología de 6 pasos, a partir de `prd.md`, `diseno.md` y `tech-stack.md`. Próximo paso: inicializar Git (Paso 5).*
