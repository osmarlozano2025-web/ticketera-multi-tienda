import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/EmptyState'
import { supabase } from '@/lib/supabase'
import type { Empresa } from '@/lib/types'

const nuevaEmpresaSchema = z.object({
  nombre: z.string().min(2, 'Ingresá un nombre'),
})
type NuevaEmpresaForm = z.infer<typeof nuevaEmpresaSchema>

function useEmpresas() {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('empresas').select('*').order('creado_en', { ascending: false })
      if (error) throw error
      return data as Empresa[]
    },
  })
}

function NuevaEmpresaDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm<NuevaEmpresaForm>({ resolver: zodResolver(nuevaEmpresaSchema), defaultValues: { nombre: '' } })

  const crearEmpresa = useMutation({
    mutationFn: async (values: NuevaEmpresaForm) => {
      const { error } = await supabase.from('empresas').insert({ nombre: values.nombre })
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Empresa creada')
      queryClient.invalidateQueries({ queryKey: ['empresas'] })
      form.reset()
      setOpen(false)
    },
    onError: (error: Error) => toast.error(`No se pudo crear la empresa: ${error.message}`),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Nueva empresa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva empresa</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => crearEmpresa.mutate(values))}
        >
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la empresa</Label>
            <Input id="nombre" {...form.register('nombre')} />
            {form.formState.errors.nombre && (
              <p className="text-sm text-destructive">{form.formState.errors.nombre.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={crearEmpresa.isPending}>
              {crearEmpresa.isPending ? 'Creando...' : 'Crear empresa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function SuperAdminPage() {
  const { data: empresas, isLoading } = useEmpresas()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
          <p className="text-sm text-muted-foreground">Todas las empresas registradas en la plataforma</p>
        </div>
        <NuevaEmpresaDialog />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando empresas...</p>
      ) : empresas && empresas.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((empresa) => (
              <TableRow key={empresa.id}>
                <TableCell className="font-medium">{empresa.nombre}</TableCell>
                <TableCell>
                  <Badge variant={empresa.estado === 'activa' ? 'default' : 'destructive'}>
                    {empresa.estado === 'activa' ? 'Activa' : 'Suspendida'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(empresa.creado_en).toLocaleDateString('es-AR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={LayoutDashboard}
          title="Sin empresas registradas"
          description="Las empresas que se den de alta van a aparecer acá."
        />
      )}
    </div>
  )
}
