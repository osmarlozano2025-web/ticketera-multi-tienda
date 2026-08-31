# Estado actual — Ticketera Multi-Tienda

Bitácora de dónde quedó el desarrollo, para retomar sin perder contexto. Se actualiza a medida que avanza el proyecto — no es parte de la metodología de 6 pasos (eso vive en `prd.md`, `diseno.md`, `tech-stack.md`, `todo.md`), es el "dónde estábamos" de la sesión de trabajo.

## Accesos

- **Producción:** https://ticketera-multi-tienda.vercel.app
- **Repo:** https://github.com/osmarlozano2025-web/ticketera-multi-tienda
- **Supabase:** proyecto `ticketera-multi-tienda` (`rlaiuolcwrlbwjfyhifr`, región `sa-east-1`)
- **Vercel:** proyecto `ticketera-multi-tienda`, team `impulso-digital3`

### Login super_admin (real, funciona en producción)
- Email: `osmar.lozano.2025@gmail.com`
- Contraseña: `superadmin2026`

## Lo que está construido y probado de punta a punta

- **Auth real** con Supabase (login, sesión, logout, guard de rutas por rol)
- **Panel Super Admin**: alta de empresas, tabla de empresas
- **Invitación de usuarios**: Edge Function `invite-user` (versionada en `supabase/functions/invite-user/index.ts`) + página `/aceptar-invitacion` para setear contraseña — probado de punta a punta una vez
- **Layout de empresa**: sidebar con menú condicional por rol, topbar
- **Módulo Tickets**: lista conectada a Supabase (vacía porque no hay tickets cargados todavía), sin formulario de alta conectado
- **Compras / Logística / Tiendas / Equipo**: solo pantallas placeholder (header + estado vacío), sin funcionalidad real
- **Base de datos**: schema completo del PRD, RLS por `empresa_id` verificado, numeración de ticket y timeline automáticos vía triggers

Empresa de prueba ya cargada: **Acontec** (`29c9888c-fd89-4578-aeec-a278a21867c2`).

## Justo donde quedamos (bloqueante activo)

Estábamos reenviando la invitación de admin para Acontec y **Supabase devolvió `email rate limit exceeded`** — el servicio de mail que trae Supabase por defecto (compartido, gratuito) tiene un límite muy bajo, pensado solo para pruebas.

**Decisión tomada:** configurar Resend como proveedor SMTP propio.

**Siguiente paso concreto:**
1. Vos: crear cuenta en resend.com, generar una API key (Settings → API Keys → Sending access), pasármela
2. Vos: decirme si tenés un dominio propio para verificar en Resend (si no, el envío queda limitado a tu propia casilla de Resend)
3. Yo: no tengo herramienta para tocar la config SMTP de Supabase por API — te voy a dar los pasos exactos de qué completar en **Supabase → Authentication → Emails → SMTP Settings**, más el template del mail de invitación en español (el actual es el genérico de Supabase, en inglés)

## Bugs ya resueltos (para no repetirlos)

- **SPA 404 en Vercel al refrescar una ruta**: faltaba `vercel.json` con rewrite a `index.html` — ya está.
- **Login rompía en producción con "non ISO-8859-1 code point"**: la clave anon de Supabase se corrompía al pegarla en la UI de variables de entorno de Vercel (repetido 3 veces, con distintos tipos Secret/Config). Se resolvió hardcodeando la URL y la clave anon directo en `src/lib/supabase.ts` — son valores públicos, no hay riesgo de seguridad en tenerlos en el código.
- **Link de invitación apuntaba a localhost**: la Edge Function usaba el header `Origin` del request en vez de una URL fija. Se corrigió hardcodeando `APP_URL` en `supabase/functions/invite-user/index.ts`.

## Próximos módulos (orden sugerido en `todo.md`)

1. Terminar SMTP/Resend (en curso)
2. Módulo Tiendas (bloqueante real: sin tiendas, Acontec no puede cargar tickets)
3. Módulo Usuarios/Equipo (invitar operarios/encargados, gestión de grupos y `usuario_tiendas`)
4. Módulo Tickets completo (alta, detalle, timeline, transición de estados)
