import { Building2, LayoutDashboard, ShoppingCart, Truck, Users } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
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

function SuperAdminPage() {
  return (
    <PlaceholderPage
      titulo="Empresas"
      subtitulo="Todas las empresas registradas en la plataforma"
      icon={LayoutDashboard}
      vacioTitulo="Sin empresas registradas"
      vacioDescripcion="Las empresas que se den de alta van a aparecer acá."
    />
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/tickets" replace />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/compras" element={<ComprasPage />} />
        <Route path="/logistica" element={<LogisticaPage />} />
        <Route path="/tiendas" element={<TiendasPage />} />
        <Route path="/equipo" element={<EquipoPage />} />
        <Route path="/super-admin" element={<SuperAdminPage />} />
      </Route>
    </Routes>
  )
}

export default App
