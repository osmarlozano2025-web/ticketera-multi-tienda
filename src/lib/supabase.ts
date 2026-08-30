import { createClient } from '@supabase/supabase-js'

// Valores públicos y seguros de exponer (clave "anon" + URL del proyecto Supabase
// ticketera-multi-tienda) — hardcodeados directo en vez de leerlos de env vars.
// Pegar el JWT en la UI de Vercel introducía de forma reproducible un caracter
// no-ASCII que rompía el header apikey en producción (confirmado en Chrome real,
// tres intentos de recarga). Como el navegador ya expone esta clave igual, no hay
// ganancia de seguridad en mantenerla en una env var — así se elimina el problema
// de raíz sin depender de que el copy/paste salga limpio.
const SUPABASE_URL = 'https://rlaiuolcwrlbwjfyhifr.supabase.co'
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsYWl1b2xjd3JsYndqZnloaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMTY0MjMsImV4cCI6MjEwMzY5MjQyM30.nZilkwO2vR6z99MoIifg9dOWW9CA0HZcFZpRbylrVjA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
