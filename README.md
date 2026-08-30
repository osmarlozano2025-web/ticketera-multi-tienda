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

1. Copiá `.env.example` a `.env` y completá las variables (proyecto Supabase `ticketera-multi-tienda`).
2. `npm install`
3. `npm run dev`

## Supabase

Proyecto: `ticketera-multi-tienda` (`rlaiuolcwrlbwjfyhifr`, región `sa-east-1`). Schema, RLS por `empresa_id` y storage de fotos ya aplicados vía migraciones.
