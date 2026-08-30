export type Rol = 'super_admin' | 'admin' | 'encargado' | 'operario' | 'compras' | 'logistica'

export type EstadoTicket =
  | 'nuevo'
  | 'asignado'
  | 'en_curso'
  | 'terminado'
  | 'aprobado'
  | 'cerrado'
  | 'cancelado'

export type Urgencia = 'baja' | 'media' | 'alta' | 'emergencia'

export type TipoTramite = 'incidencia' | 'presupuesto' | 'cotizacion'

export interface Empresa {
  id: string
  nombre: string
  estado: 'activa' | 'suspendida'
  creado_en: string
}

export interface Usuario {
  id: string
  empresa_id: string | null
  nombre: string
  email: string
  rol: Rol
  grupo_id: string | null
  telefono: string | null
  avatar_url: string | null
  creado_en: string
}

export interface Grupo {
  id: string
  empresa_id: string
  nombre: string
  creado_en: string
}

export interface Tienda {
  id: string
  empresa_id: string
  nombre: string
  direccion: string | null
  telefono: string | null
  lat: number | null
  lng: number | null
  creado_en: string
}

export interface Ticket {
  id: string
  empresa_id: string
  tienda_id: string
  numero_ticket: number
  fecha_ct: string
  motivo: string
  urgencia: Urgencia
  tipo_tramite: TipoTramite
  estado: EstadoTicket
  requiere_compra: boolean
  requiere_logistica: boolean
  grupo_asignado_id: string | null
  cargado_por: string
  creado_en: string
}

export interface TicketFoto {
  id: string
  ticket_id: string
  url: string
  subido_por: string
  creado_en: string
}

export interface TicketEvento {
  id: string
  ticket_id: string
  usuario_id: string | null
  tipo_evento: 'cambio_estado' | 'comentario' | 'foto_agregada'
  estado_anterior: EstadoTicket | null
  estado_nuevo: EstadoTicket | null
  comentario: string | null
  creado_en: string
}

export interface Proveedor {
  id: string
  empresa_id: string
  nombre: string
  contacto: string | null
  creado_en: string
}

export interface OrdenCompra {
  id: string
  empresa_id: string
  ticket_id: string
  proveedor_id: string
  estado: 'pendiente' | 'comprado' | 'entregado'
  creado_en: string
}

export interface Envio {
  id: string
  empresa_id: string
  ticket_id: string
  origen: string
  destino_tienda_id: string
  estado: 'pendiente' | 'en_transito' | 'entregado'
  fecha_estimada: string | null
  creado_en: string
}
