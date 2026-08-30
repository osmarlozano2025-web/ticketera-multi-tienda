import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'

export function PlaceholderPage({
  titulo,
  subtitulo,
  icon,
  accion,
  vacioTitulo,
  vacioDescripcion,
}: {
  titulo: string
  subtitulo: string
  icon: LucideIcon
  accion?: string
  vacioTitulo: string
  vacioDescripcion: string
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
          <p className="text-sm text-muted-foreground">{subtitulo}</p>
        </div>
        {accion && <Button>{accion}</Button>}
      </div>
      <EmptyState icon={icon} title={vacioTitulo} description={vacioDescripcion} />
    </div>
  )
}
