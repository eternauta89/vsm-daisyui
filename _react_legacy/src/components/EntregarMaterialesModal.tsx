import { useState } from 'react'
import {
  Ban,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  Printer,
  XCircle,
  X,
  ArrowRight,
} from 'lucide-react'
import { showToast } from '../lib/toast'

type Step = 'cantidades' | 'tarjeta' | 'confirmar'
type Resultado = 'success' | 'error' | null

const itemsIniciales = [
  {
    nombre: 'BOTIN NEGRO N° 42 DIELEC AQUILES-N04',
    solicitado: 2,
    entregado: 1,
  },
  {
    nombre: 'BOTIN NEGRO N° 42 DIELEC AQUILES-N04',
    solicitado: 2,
    entregado: 1,
  },
  {
    nombre: 'BOTIN NEGRO N° 42 DIELEC AQUILES-N04',
    solicitado: 2,
    entregado: 1,
  },
]

const steps: { key: Step; label: string }[] = [
  { key: 'cantidades', label: 'Cantidades' },
  { key: 'tarjeta', label: 'Tarjeta' },
  { key: 'confirmar', label: 'Confirmar' },
]

export default function EntregarMaterialesModal() {
  const [step, setStep] = useState<Step>('cantidades')
  const [resultado, setResultado] = useState<Resultado>(null)
  const [items, setItems] = useState(itemsIniciales)
  const stepIndex = steps.findIndex((s) => s.key === step)

  const updateCantidad = (index: number, delta: number) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              entregado: Math.min(
                item.solicitado,
                Math.max(0, item.entregado + delta),
              ),
            }
          : item,
      ),
    )
  }

  const reset = () => {
    setStep('cantidades')
    setResultado(null)
    setItems(itemsIniciales)
  }

  return (
    <dialog id="entregar_materiales_modal" className="modal" onClose={reset}>
      <div className="modal-box flex h-[600px] w-full max-w-2xl flex-col overflow-hidden p-0">
        <div className="bg-primary text-primary-content flex shrink-0 items-start justify-between px-6 py-4">
          <div>
            <p className="text-xs tracking-wide opacity-80">
              ENTREGA VALE #1500
            </p>
            <p className="text-lg font-medium">Valenzuela Alberto Javier</p>
            <p className="text-sm opacity-80">Leg.2558</p>
          </div>
          <button
            type="button"
            className="btn btn-circle btn-ghost text-primary-content"
            aria-label="Cerrar"
            onClick={() =>
              (
                document.getElementById(
                  'entregar_materiales_modal',
                ) as HTMLDialogElement | null
              )?.close()
            }
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="shrink-0 px-6 pt-4">
          <ul className="steps steps-horizontal w-full">
            {steps.map((s, index) => (
              <li
                key={s.key}
                className={`step ${index <= stepIndex ? 'step-primary' : ''}`}
              >
                {s.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'cantidades' && (
            <div>
              <p className="text-base-content/70 text-sm">
                Indicá la cantidad realmente entregada. Puede ser menor a la
                solicitada, nunca mayor.
              </p>
              <ul className="mt-4 space-y-4">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-medium">{item.nombre}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="btn btn-circle btn-outline"
                        aria-label="Restar unidad"
                        disabled={item.entregado <= 0}
                        onClick={() => updateCantidad(index, -1)}
                      >
                        <Minus className="size-3" />
                      </button>
                      <div className="text-center">
                        <p className="text-sm font-semibold">
                          {item.entregado}
                        </p>
                        <p className="text-base-content/50 text-xs">
                          de {item.solicitado}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-circle btn-outline"
                        aria-label="Sumar unidad"
                        disabled={item.entregado >= item.solicitado}
                        onClick={() => updateCantidad(index, 1)}
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 'tarjeta' && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="bg-primary text-primary-content flex size-16 items-center justify-center rounded-full">
                <CreditCard className="size-7" />
              </div>
              <h4 className="mt-4 text-base font-semibold">
                Acercá la tarjeta al lector
              </h4>
              <p className="text-base-content/60 mt-2 max-w-sm text-sm">
                El retirante debe acercar su tarjeta de identificación al lector
                para confirmar su identidad y la conformidad con los materiales.
              </p>
            </div>
          )}

          {step === 'confirmar' && resultado === 'success' && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h4 className="text-base font-semibold">Entregado</h4>
              <div className="bg-success mt-4 flex size-16 items-center justify-center rounded-full text-white">
                <CheckCircle2 className="size-8" />
              </div>
              <span className="badge badge-primary mt-4">Sap. 498223256</span>
            </div>
          )}

          {step === 'confirmar' && resultado === 'error' && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h4 className="text-base font-semibold">Tarjeta rechazada</h4>
              <div className="bg-error mt-4 flex size-16 items-center justify-center rounded-full text-white">
                <XCircle className="size-8" />
              </div>
              <p className="text-base-content/60 mt-3 max-w-sm text-sm">
                Tarjeta no autorizada para esta entrega. Verifique el legajo del
                retirante.
              </p>
              <span className="badge badge-error mt-4 gap-1 text-white">
                <Ban className="size-3.5" />
                No autorizada
              </span>
              <p className="text-base-content/50 mt-2 max-w-sm text-xs">
                El vale queda registrado como No autorizada. Podés reintentar
                la entrega apretando "Entregar" en esa misma fila.
              </p>
            </div>
          )}
        </div>

        <div className="border-base-300 flex shrink-0 items-center justify-between gap-4 border-t px-6 py-4">
          {step === 'cantidades' && (
            <>
              <form method="dialog">
                <button type="submit" className="btn btn-ghost w-56">
                  Cancelar
                </button>
              </form>
              <button
                type="button"
                className="btn btn-primary w-56 gap-2"
                onClick={() => setStep('tarjeta')}
              >
                Confirmar entrega
                <ArrowRight className="size-4" />
              </button>
            </>
          )}

          {step === 'tarjeta' && (
            <>
              <button
                type="button"
                className="link link-hover shrink-0 text-sm whitespace-nowrap"
                onClick={() => setStep('cantidades')}
              >
                Volver atrás
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline btn-error w-56"
                  onClick={() => {
                    setResultado('error')
                    setStep('confirmar')
                    showToast(
                      'error',
                      'Tarjeta rechazada. Vale marcado como No autorizada',
                    )
                  }}
                >
                  Tarjeta rechazada
                </button>
                <button
                  type="button"
                  className="btn btn-primary w-56 gap-2"
                  onClick={() => {
                    setResultado('success')
                    setStep('confirmar')
                    showToast('success', 'Entrega registrada correctamente')
                  }}
                >
                  <CheckCircle2 className="size-4" />
                  Tarjeta Confirmada
                </button>
              </div>
            </>
          )}

          {step === 'confirmar' && resultado === 'success' && (
            <>
              <button
                type="button"
                className="btn btn-outline btn-secondary w-56 gap-2"
              >
                <Printer className="size-4" />
                Imprimir
              </button>
              <form method="dialog">
                <button type="submit" className="btn btn-primary w-56">
                  Listo
                </button>
              </form>
            </>
          )}

          {step === 'confirmar' && resultado === 'error' && (
            <form method="dialog" className="ml-auto">
              <button type="submit" className="btn btn-primary w-56">
                Cerrar
              </button>
            </form>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
