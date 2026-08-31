import { createClient } from 'jsr:@supabase/supabase-js@2'

// Hardcodeado: no confiar en el header Origin del request, porque si la
// invitacion se dispara desde un entorno local de desarrollo el link de
// invitacion terminaria apuntando a localhost en vez de produccion.
const APP_URL = 'https://ticketera-multi-tienda.vercel.app'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, nombre, rol, empresa_id, grupo_id, tienda_ids } = await req.json()

    if (!email || !nombre || !rol) {
      return json({ error: 'Faltan email, nombre o rol' }, 400)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'No autorizado' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user: callerUser },
      error: callerError,
    } = await callerClient.auth.getUser()
    if (callerError || !callerUser) return json({ error: 'No autorizado' }, 401)

    const adminClient = createClient(supabaseUrl, serviceKey)

    const { data: callerRow } = await adminClient
      .from('usuarios')
      .select('rol, empresa_id')
      .eq('id', callerUser.id)
      .single()

    if (!callerRow) return json({ error: 'No autorizado' }, 403)

    const esSuperAdmin = callerRow.rol === 'super_admin'
    const esAdminDeEsaEmpresa = callerRow.rol === 'admin' && callerRow.empresa_id === empresa_id

    if (rol !== 'admin' && !esAdminDeEsaEmpresa && !esSuperAdmin) {
      return json({ error: 'No tenes permiso para invitar en esta empresa' }, 403)
    }
    if (rol === 'admin' && !esSuperAdmin && !esAdminDeEsaEmpresa) {
      return json({ error: 'No tenes permiso para invitar admins en esta empresa' }, 403)
    }
    if (!empresa_id) return json({ error: 'Falta empresa_id' }, 400)

    const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${APP_URL}/aceptar-invitacion`,
    })

    if (inviteError || !invited?.user) {
      return json({ error: inviteError?.message ?? 'No se pudo invitar al usuario' }, 400)
    }

    const { error: usuarioError } = await adminClient.from('usuarios').insert({
      id: invited.user.id,
      empresa_id,
      nombre,
      email,
      rol,
      grupo_id: grupo_id ?? null,
    })

    if (usuarioError) {
      return json({ error: usuarioError.message }, 400)
    }

    if (rol === 'encargado' && Array.isArray(tienda_ids) && tienda_ids.length > 0) {
      await adminClient
        .from('usuario_tiendas')
        .insert(tienda_ids.map((tienda_id: string) => ({ usuario_id: invited.user!.id, tienda_id })))
    }

    return json({ ok: true })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Error inesperado' }, 500)
  }
})
