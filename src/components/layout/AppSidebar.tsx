import { Building2, LayoutDashboard, ShoppingCart, Ticket, Truck, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useMockSession } from '@/lib/mock-session'
import type { Rol } from '@/lib/types'

interface NavItem {
  to: string
  label: string
  icon: typeof Ticket
  roles: Rol[]
}

const OPERACION: NavItem[] = [
  { to: '/tickets', label: 'Tickets', icon: Ticket, roles: ['admin', 'encargado', 'operario', 'compras', 'logistica'] },
  { to: '/compras', label: 'Compras', icon: ShoppingCart, roles: ['admin', 'compras'] },
  { to: '/logistica', label: 'Logística', icon: Truck, roles: ['admin', 'logistica'] },
]

const GESTION: NavItem[] = [
  { to: '/tiendas', label: 'Tiendas', icon: Building2, roles: ['admin'] },
  { to: '/equipo', label: 'Usuarios / Equipo', icon: Users, roles: ['admin'] },
]

const SUPER_ADMIN: NavItem[] = [
  { to: '/super-admin', label: 'Empresas', icon: LayoutDashboard, roles: ['super_admin'] },
]

function NavGroup({ label, items, rol }: { label: string; items: NavItem[]; rol: Rol }) {
  const visibles = items.filter((item) => item.roles.includes(rol))
  if (visibles.length === 0) return null
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibles.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'font-medium text-sidebar-primary-foreground bg-sidebar-accent' : ''
                  }
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar() {
  const { user } = useMockSession()

  if (user.rol === 'super_admin') {
    return (
      <Sidebar>
        <SidebarHeader className="px-3 py-4">
          <span className="text-lg font-bold tracking-tight">Ticketera</span>
          <span className="text-xs text-muted-foreground">Panel Super Admin</span>
        </SidebarHeader>
        <SidebarContent>
          <NavGroup label="Plataforma" items={SUPER_ADMIN} rol={user.rol} />
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4">
        <span className="text-lg font-bold tracking-tight">Ticketera</span>
        <span className="text-xs text-muted-foreground">{user.empresaNombre}</span>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Operación" items={OPERACION} rol={user.rol} />
        <NavGroup label="Gestión" items={GESTION} rol={user.rol} />
      </SidebarContent>
    </Sidebar>
  )
}
