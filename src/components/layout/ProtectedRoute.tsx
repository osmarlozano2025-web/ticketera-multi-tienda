import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import type { Rol } from '@/lib/types'

export function ProtectedRoute() {
  const { session, usuario, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">Cargando...</div>
  }
  if (!session) {
    return <Navigate to="/login" replace />
  }
  if (!usuario) {
    return (
      <div className="flex min-h-svh items-center justify-center text-center text-sm text-muted-foreground">
        Tu cuenta no está vinculada a ninguna empresa todavía. Contactá a un administrador.
      </div>
    )
  }
  return <Outlet />
}

export function RequireRole({ roles, children }: { roles: Rol[]; children: React.ReactNode }) {
  const { usuario } = useAuth()
  if (!usuario) return null
  if (!roles.includes(usuario.rol)) {
    return <Navigate to={usuario.rol === 'super_admin' ? '/super-admin' : '/tickets'} replace />
  }
  return <>{children}</>
}
