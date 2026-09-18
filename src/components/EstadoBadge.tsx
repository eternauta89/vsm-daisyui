import { AlertTriangle, Ban, CheckCircle2, Clock } from 'lucide-react'

export type EstadoVale = 'Pendiente' | 'Entregado' | 'No autorizada' | 'Error SAP'

export default function EstadoBadge({ estado }: { estado: EstadoVale }) {
  switch (estado) {
    case 'Pendiente':
      return (
        <span className="badge badge-warning gap-1 text-black">
          <Clock className="size-3.5" />
          Pendiente
        </span>
      )
    case 'Entregado':
      return (
        <span className="badge badge-success gap-1 text-white">
          <CheckCircle2 className="size-3.5" />
          Entregado
        </span>
      )
    case 'No autorizada':
      return (
        <span className="badge gap-1 border-none bg-[#dc362e] text-white">
          <Ban className="size-3.5" />
          No autorizada
        </span>
      )
    case 'Error SAP':
      return (
        <span className="badge badge-error badge-soft gap-1">
          <AlertTriangle className="size-3.5" />
          Error SAP
        </span>
      )
  }
}
