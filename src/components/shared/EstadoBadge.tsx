import { cn } from '@/lib/utils'
import { ESTADO_TICKET_COLOR_CLASS, ESTADO_TICKET_LABEL, URGENCIA_COLOR_CLASS, URGENCIA_LABEL } from '@/lib/estados'
import type { EstadoTicket, Urgencia } from '@/lib/types'

export function EstadoBadge({ estado }: { estado: EstadoTicket }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        ESTADO_TICKET_COLOR_CLASS[estado],
      )}
    >
      {ESTADO_TICKET_LABEL[estado]}
    </span>
  )
}

export function UrgenciaBadge({ urgencia }: { urgencia: Urgencia }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        URGENCIA_COLOR_CLASS[urgencia],
      )}
    >
      {URGENCIA_LABEL[urgencia]}
    </span>
  )
}
