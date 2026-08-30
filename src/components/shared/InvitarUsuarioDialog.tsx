import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import type { Rol } from '@/lib/types'

const invitarSchema = z.object({
  nombre: z.string().min(2, 'Ingresá un nombre'),
  email: z.string().email('Email inválido'),
})
type InvitarForm = z.infer<typeof invitarSchema>

interface InvitarUsuarioDialogProps {
  empresaId: string
  rol: Rol
  triggerLabel: string
  invalidateKey: string[]
}

export function InvitarUsuarioDialog({ empresaId, rol, triggerLabel, invalidateKey }: InvitarUsuarioDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm<InvitarForm>({ resolver: zodResolver(invitarSchema), defaultValues: { nombre: '', email: '' } })

  const invitar = useMutation({
    mutationFn: async (values: InvitarForm) => {
      const { data, error } = await supabase.functions.invoke('invite-user', {
        body: { email: values.email, nombre: values.nombre, rol, empresa_id: empresaId },
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
    },
    onSuccess: () => {
      toast.success('Invitación enviada')
      queryClient.invalidateQueries({ queryKey: invalidateKey })
      form.reset()
      setOpen(false)
    },
    onError: (error: Error) => toast.error(`No se pudo invitar: ${error.message}`),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{triggerLabel}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => invitar.mutate(values))}>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...form.register('nombre')} />
            {form.formState.errors.nombre && (
              <p className="text-sm text-destructive">{form.formState.errors.nombre.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={invitar.isPending}>
              {invitar.isPending ? 'Enviando...' : 'Enviar invitación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
