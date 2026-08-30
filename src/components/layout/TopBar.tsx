import { ChevronDown, LogOut, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/lib/auth'

const ROL_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  encargado: 'Encargado',
  operario: 'Operario',
  compras: 'Compras',
  logistica: 'Logística',
}

export function TopBar() {
  const { usuario, signOut } = useAuth()
  if (!usuario) return null

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border px-4">
      <SidebarTrigger />
      <div className="relative mx-auto w-full max-w-md">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar tickets..." className="pl-8" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 text-sm">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {usuario.nombre.charAt(0)}
          </span>
          <span className="hidden sm:inline">{usuario.nombre}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {usuario.email}
            <span className="block text-xs font-normal text-muted-foreground">{ROL_LABEL[usuario.rol]}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
