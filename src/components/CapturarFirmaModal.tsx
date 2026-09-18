import { useRef, useState } from 'react'
import { Eraser, X } from 'lucide-react'
import { showToast } from '../lib/toast'

type CapturarFirmaModalProps = {
  vsm: string
  retirante: string
  legajo: string
  onFirmado: () => void
}

function getPosition(canvas: HTMLCanvasElement, event: React.PointerEvent) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  }
}

export default function CapturarFirmaModal({
  vsm,
  retirante,
  legajo,
  onFirmado,
}: CapturarFirmaModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasSignature, setHasSignature] = useState(false)

  const getContext = () => canvasRef.current?.getContext('2d') ?? null

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!canvas || !ctx) return
    drawing.current = true
    const { x, y } = getPosition(canvas, event)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!drawing.current || !canvas || !ctx) return
    const { x, y } = getPosition(canvas, event)
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#020509'
    ctx.lineTo(x, y)
    ctx.stroke()
    if (!hasSignature) setHasSignature(true)
  }

  const stopDrawing = () => {
    drawing.current = false
  }

  const limpiarFirma = () => {
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const guardarFirma = () => {
    onFirmado()
    limpiarFirma()
    showToast('success', `Firma de ${retirante} capturada correctamente`)
    ;(
      document.getElementById('capturar_firma_modal') as HTMLDialogElement | null
    )?.close()
  }

  return (
    <dialog id="capturar_firma_modal" className="modal" onClose={limpiarFirma}>
      <div className="modal-box w-full max-w-lg p-0 overflow-hidden">
        <div className="bg-primary text-primary-content flex items-start justify-between px-6 py-4">
          <div>
            <p className="text-xs tracking-wide opacity-80">VALE {vsm}</p>
            <p className="text-lg font-medium">{retirante}</p>
            <p className="text-sm opacity-80">{legajo}</p>
          </div>
          <form method="dialog">
            <button
              type="submit"
              className="btn btn-circle btn-ghost text-primary-content"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </form>
        </div>

        <div className="px-6 py-5">
          <p className="text-base-content/70 text-sm">
            Pedile al retirante que firme dentro del recuadro para confirmar la
            conformidad con los materiales.
          </p>

          <div className="border-base-300 bg-base-100 mt-4 overflow-hidden rounded-lg border">
            <canvas
              ref={canvasRef}
              width={600}
              height={220}
              className="h-48 w-full touch-none"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
            />
          </div>

          <div className="modal-action items-center justify-between">
            <button
              type="button"
              className="btn btn-ghost gap-1"
              onClick={limpiarFirma}
            >
              <Eraser className="size-4" />
              Limpiar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!hasSignature}
              onClick={guardarFirma}
            >
              Guardar firma
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
