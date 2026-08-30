import { Building2, ShoppingCart, Truck, Users } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute, RequireRole } from '@/components/layout/ProtectedRoute'
import { useAuth } from '@/lib/auth'
import { LoginPage } from '@/pages/LoginPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { SuperAdminPage } from '@/pages/SuperAdminPage'
import { TicketsPage } from '@/pages/TicketsPage'

function ComprasPage() {
  return (
    <PlaceholderPage
      titulo="Compras"
      subtitulo="Órdenes de compra generadas desde tickets que requieren materiales"
      icon={ShoppingCart}
      vacioTitulo="Sin órdenes de compra todavía"
      vacioDescripcion="Van a aparecer acá cuando un ticket se marque como 'requiere compra'."
    />
  )
}

function LogisticaPage() {
  return (
    <PlaceholderPage
      titulo="Logística"
      subtitulo="Envíos y traslados generados desde tickets que requieren logística"
      icon={Truck}
      vacioTitulo="Sin envíos todavía"
      vacioDescripcion="Van a aparecer acá cuando un ticket se marque como 'requiere logística'."
    />
  )
}

function TiendasPage() {
  return (
    <PlaceholderPage
      titulo="Tiendas"
      subtitulo="Locales de tu empresa"
      icon={Building2}
      accion="+ Nueva tienda"
      vacioTitulo="Sin tiendas todavía"
      vacioDescripcion="Agregá la primera tienda de tu empresa para empezar a cargar tickets."
    />
  )
}

function EquipoPage() {
  return (
    <PlaceholderPage
      titulo="Usuarios / Equipo"
      subtitulo="Miembros de tu empresa, roles y grupos"
      icon={Users}
      accion="+ Invitar miembro"
      vacioTitulo="Sin miembros todavía"
      vacioDescripcion="Invitá a tu equipo por email para que empiecen a usar la plataforma."
    />
  )
}

function HomeRedirect() {
  const { usuario } = useAuth()
  if (!usuario) return null
  return <Navigate to={usuario.rol === 'super_admin' ? '/super-admin' : '/tickets'} replace />
}

const ROLES_EMPRESA = ['admin', 'encargado', 'operario', 'compras', 'logistica'] as const

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomeRedirect />} />
          <Route
            path="/tickets"
            element={
              <RequireRole roles={[...ROLES_EMPRESA]}>
                <TicketsPage />
              </RequireRole>
            }
          />
          <Route
            path="/compras"
            element={
              <RequireRole roles={['admin', 'compras']}>
                <ComprasPage />
              </RequireRole>
            }
          />
          <Route
            path="/logistica"
            element={
              <RequireRole roles={['admin', 'logistica']}>
                <LogisticaPage />
              </RequireRole>
            }
          />
          <Route
            path="/tiendas"
            element={
              <RequireRole roles={['admin']}>
                <TiendasPage />
              </RequireRole>
            }
          />
          <Route
            path="/equipo"
            element={
              <RequireRole roles={['admin']}>
                <EquipoPage />
              </RequireRole>
            }
          />
          <Route
            path="/super-admin"
            element={
              <RequireRole roles={['super_admin']}>
                <SuperAdminPage />
              </RequireRole>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
