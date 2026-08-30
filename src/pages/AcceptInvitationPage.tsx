import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export function AcceptInvitationPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session)
      setChecking(false)
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('La contraseña tiene que tener al menos 8 caracteres')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/', { replace: true })
  }

  if (checking) {
    return <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">Cargando...</div>
  }

  if (!hasSession) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Este link de invitación no es válido o ya expiró. Pedile a quien te invitó que te mande uno nuevo.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-8">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-bold tracking-tight">Bienvenido/a a Ticketera</h1>
          <p className="text-sm text-muted-foreground">Elegí tu contraseña para activar tu cuenta</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmar">Repetí la contraseña</Label>
            <Input
              id="confirmar"
              type="password"
              required
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Activando...' : 'Activar cuenta'}
        </Button>
      </form>
    </div>
  )
}
