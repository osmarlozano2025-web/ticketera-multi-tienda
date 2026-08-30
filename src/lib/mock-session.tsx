import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Rol } from '@/lib/types'

/**
 * TEMPORAL: reemplazar por la sesion real de Supabase Auth (todo.md seccion 2).
 * Mientras no este la autenticacion cableada, este contexto simula un usuario
 * logueado y permite cambiar de rol desde la topbar para probar el menu
 * condicional de diseno.md §2 (que items ve cada rol).
 */
export interface MockUser {
  nombre: string
  rol: Rol
  empresaNombre: string
}

const ROLES_DEMO: Record<Rol, MockUser> = {
  super_admin: { nombre: 'Nazareno (Super Admin)', rol: 'super_admin', empresaNombre: 'Plataforma' },
  admin: { nombre: 'Admin Demo', rol: 'admin', empresaNombre: 'Empresa Demo' },
  encargado: { nombre: 'Encargado Demo', rol: 'encargado', empresaNombre: 'Empresa Demo' },
  operario: { nombre: 'Operario Demo', rol: 'operario', empresaNombre: 'Empresa Demo' },
  compras: { nombre: 'Compras Demo', rol: 'compras', empresaNombre: 'Empresa Demo' },
  logistica: { nombre: 'Logistica Demo', rol: 'logistica', empresaNombre: 'Empresa Demo' },
}

interface MockSessionContextValue {
  user: MockUser
  setRol: (rol: Rol) => void
}

const MockSessionContext = createContext<MockSessionContextValue | null>(null)

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol>('admin')
  const value = useMemo<MockSessionContextValue>(
    () => ({ user: ROLES_DEMO[rol], setRol }),
    [rol],
  )
  return <MockSessionContext.Provider value={value}>{children}</MockSessionContext.Provider>
}

export function useMockSession() {
  const ctx = useContext(MockSessionContext)
  if (!ctx) throw new Error('useMockSession debe usarse dentro de MockSessionProvider')
  return ctx
}

export const ROLES_DISPONIBLES: Rol[] = ['super_admin', 'admin', 'encargado', 'operario', 'compras', 'logistica']
