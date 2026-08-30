import type { EstadoTicket, Urgencia } from '@/lib/types'

export const ESTADO_TICKET_LABEL: Record<EstadoTicket, string> = {
  nuevo: 'Nuevo',
  asignado: 'Asignado',
  en_curso: 'En curso',
  terminado: 'Terminado',
  aprobado: 'Aprobado',
  cerrado: 'Cerrado',
  cancelado: 'Cancelado',
}

export const ESTADO_TICKET_COLOR_CLASS: Record<EstadoTicket, string> = {
  nuevo: 'bg-status-nuevo/15 text-status-nuevo border-status-nuevo/30',
  asignado: 'bg-status-asignado/15 text-status-asignado border-status-asignado/30',
  en_curso: 'bg-status-en-curso/15 text-status-en-curso border-status-en-curso/30',
  terminado: 'bg-status-terminado/15 text-status-terminado border-status-terminado/30',
  aprobado: 'bg-status-aprobado/15 text-status-aprobado border-status-aprobado/30',
  cerrado: 'bg-status-cerrado/15 text-status-cerrado border-status-cerrado/30',
  cancelado: 'bg-status-cancelado/15 text-status-cancelado border-status-cancelado/30',
}

export const URGENCIA_LABEL: Record<Urgencia, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  emergencia: 'Emergencia',
}

export const URGENCIA_COLOR_CLASS: Record<Urgencia, string> = {
  baja: 'bg-urgencia-baja/15 text-urgencia-baja border-urgencia-baja/30',
  media: 'bg-urgencia-media/15 text-urgencia-media border-urgencia-media/30',
  alta: 'bg-urgencia-alta/15 text-urgencia-alta border-urgencia-alta/30',
  emergencia: 'bg-urgencia-emergencia/15 text-urgencia-emergencia border-urgencia-emergencia/30',
}

/**
 * Matriz de transicion de estados (prd.md §2.1): que estado siguiente puede
 * disparar cada rol desde el estado actual. Si un rol no tiene entrada para el
 * estado actual, no ve boton de accion (solo lectura).
 */
export const TRANSICIONES_PERMITIDAS: Partial<
  Record<EstadoTicket, Partial<Record<string, { siguiente: EstadoTicket; label: string }>>>
> = {
  nuevo: {
    admin: { siguiente: 'asignado', label: 'Asignar a grupo' },
  },
  asignado: {
    operario: { siguiente: 'en_curso', label: 'Tomar y empezar' },
  },
  en_curso: {
    operario: { siguiente: 'terminado', label: 'Marcar terminado' },
  },
  terminado: {
    admin: { siguiente: 'aprobado', label: 'Aprobar' },
  },
  aprobado: {
    admin: { siguiente: 'cerrado', label: 'Cerrar ticket' },
  },
}
