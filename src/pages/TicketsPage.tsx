import { useQuery } from '@tanstack/react-query'
import { Plus, Ticket as TicketIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/shared/EmptyState'
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/EstadoBadge'
import { ESTADO_TICKET_LABEL } from '@/lib/estados'
import { supabase } from '@/lib/supabase'
import type { EstadoTicket } from '@/lib/types'

const TABS: Array<{ value: EstadoTicket | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'nuevo', label: ESTADO_TICKET_LABEL.nuevo },
  { value: 'asignado', label: ESTADO_TICKET_LABEL.asignado },
  { value: 'en_curso', label: ESTADO_TICKET_LABEL.en_curso },
  { value: 'terminado', label: ESTADO_TICKET_LABEL.terminado },
  { value: 'aprobado', label: ESTADO_TICKET_LABEL.aprobado },
  { value: 'cerrado', label: ESTADO_TICKET_LABEL.cerrado },
]

interface TicketConTienda {
  id: string
  numero_ticket: number
  motivo: string
  estado: EstadoTicket
  urgencia: 'baja' | 'media' | 'alta' | 'emergencia'
  requiere_compra: boolean
  requiere_logistica: boolean
  tiendas: { nombre: string } | null
}

function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('id, numero_ticket, motivo, estado, urgencia, requiere_compra, requiere_logistica, tiendas(nombre)')
        .order('creado_en', { ascending: false })
      if (error) throw error
      return data as unknown as TicketConTienda[]
    },
  })
}

export function TicketsPage() {
  const { data: tickets, isLoading } = useTickets()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-sm text-muted-foreground">Gestioná las incidencias de todas tus tiendas</p>
        </div>
        <Button>
          <Plus />
          Nuevo ticket
        </Button>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando tickets...</p>
      ) : tickets && tickets.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <EstadoBadge estado={ticket.estado} />
                <div>
                  <p className="font-medium">
                    #{ticket.numero_ticket} — {ticket.motivo}
                  </p>
                  <p className="text-sm text-muted-foreground">{ticket.tiendas?.nombre}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ticket.requiere_compra && <Badge variant="outline">Compra</Badge>}
                {ticket.requiere_logistica && <Badge variant="outline">Logística</Badge>}
                <UrgenciaBadge urgencia={ticket.urgencia} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={TicketIcon}
          title="Sin tickets todavía"
          description="Cuando se reporte un problema en alguna de tus tiendas, va a aparecer acá."
        />
      )}
    </div>
  )
}
