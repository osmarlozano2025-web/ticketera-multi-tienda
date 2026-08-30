# Ticketera Multi-Tienda

App web multi-empresa (SaaS) para gestión de tickets de mantenimiento e incidencias en redes de tiendas/locales. Ver la documentación del proyecto:

- [`prd.md`](./prd.md) — Producto y alcance del MVP
- [`diseno.md`](./diseno.md) — Specs de UI e identidad visual
- [`tech-stack.md`](./tech-stack.md) — Stack técnico y decisiones
- [`todo.md`](./todo.md) — Desglose de tareas
- [`REFERENCIA-DISEÑO.md`](./REFERENCIA-DISEÑO.md) — Relevamiento de referencias visuales

## Stack

React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase + Vercel.

## Desarrollo local

1. `npm install`
2. `npm run dev`

La URL y la clave anon de Supabase están hardcodeadas en [`src/lib/supabase.ts`](./src/lib/supabase.ts) — no hace falta `.env`. Son valores públicos (clave "anon", pensada para vivir en el navegador), se movieron ahí porque pegarlos como env var en la UI de Vercel introducía de forma reproducible un caracter no-ASCII que rompía el header `apikey` en producción.

## Supabase

Proyecto: `ticketera-multi-tienda` (`rlaiuolcwrlbwjfyhifr`, región `sa-east-1`). Schema, RLS por `empresa_id` y storage de fotos ya aplicados vía migraciones.
