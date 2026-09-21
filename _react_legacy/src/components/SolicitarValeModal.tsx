import { useState } from 'react'
import { Lock, Plus, X } from 'lucide-react'
import SearchableSelect from './SearchableSelect'
import { showToast } from '../lib/toast'

const TIPOS_ENTREGA = ['EPP- Protección personal', 'Herramientas', 'Insumos']
const EMPRESAS = ['G001- Rio- Rioplatense', 'G002- Norte']
const ALMACENES = ['Rioplatense', 'INC']
const CENTROS_COSTOS = ['123']
const RETIRANTES = ['Juarez Bruno Tomas']
const PRODUCTOS = [
  'Faja lumbar (EPP-6634)',
  'Arnés de altura (EPP-7702)',
  'Casco de seguridad (EPP-1842)',
]

type ProductoAgregado = {
  nombre: string
  unidades: number
}

const estadoInicial = {
  tipoEntrega: TIPOS_ENTREGA[0],
  empresa: EMPRESAS[0],
  almacen: ALMACENES[0],
  centroCostos: '',
  retirante: '',
  producto: '',
  unidades: 1,
  productosAgregados: [] as ProductoAgregado[],
  observaciones: '',
}

export default function SolicitarValeModal() {
  const [tipoEntrega, setTipoEntrega] = useState(estadoInicial.tipoEntrega)
  const [empresa, setEmpresa] = useState(estadoInicial.empresa)
  const [almacen, setAlmacen] = useState(estadoInicial.almacen)
  const [centroCostos, setCentroCostos] = useState(estadoInicial.centroCostos)
  const [retirante, setRetirante] = useState(estadoInicial.retirante)
  const [producto, setProducto] = useState(estadoInicial.producto)
  const [unidades, setUnidades] = useState(estadoInicial.unidades)
  const [productosAgregados, setProductosAgregados] = useState<
    ProductoAgregado[]
  >(estadoInicial.productosAgregados)
  const [observaciones, setObservaciones] = useState(
    estadoInicial.observaciones,
  )

  const resetForm = () => {
    setTipoEntrega(estadoInicial.tipoEntrega)
    setEmpresa(estadoInicial.empresa)
    setAlmacen(estadoInicial.almacen)
    setCentroCostos(estadoInicial.centroCostos)
    setRetirante(estadoInicial.retirante)
    setProducto(estadoInicial.producto)
    setUnidades(estadoInicial.unidades)
    setProductosAgregados(estadoInicial.productosAgregados)
    setObservaciones(estadoInicial.observaciones)
  }

  const agregarProducto = () => {
    if (!producto || unidades < 1) return
    setProductosAgregados((current) => [
      ...current,
      { nombre: producto, unidades },
    ])
    setProducto('')
    setUnidades(1)
  }

  const quitarProducto = (index: number) => {
    setProductosAgregados((current) => current.filter((_, i) => i !== index))
  }

  const puedeAgregarProducto = producto !== '' && unidades >= 1
  const puedeConfirmar =
    tipoEntrega !== '' &&
    empresa !== '' &&
    almacen !== '' &&
    centroCostos !== '' &&
    retirante !== '' &&
    productosAgregados.length > 0

  return (
    <dialog id="solicitar_vale_modal" className="modal" onClose={resetForm}>
      <div className="modal-box w-full max-w-2xl p-0 overflow-hidden">
        <div className="bg-primary text-primary-content flex items-center justify-between px-7 py-6">
          <h3 className="text-xl font-medium">
            Solicitar vale de salida de materiales
          </h3>
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

        <form
          method="dialog"
          className="max-h-[70vh] overflow-y-auto px-7 py-5"
        >
          <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-2">
            <fieldset className="fieldset p-0">
              <label className="label">Tipo de entrega</label>
              <SearchableSelect
                value={tipoEntrega}
                onChange={setTipoEntrega}
                options={TIPOS_ENTREGA}
                ariaLabel="Tipo de entrega"
              />
            </fieldset>

            <fieldset className="fieldset p-0">
              <label className="label">Empresa que representa</label>
              <SearchableSelect
                value={empresa}
                onChange={setEmpresa}
                options={EMPRESAS}
                ariaLabel="Empresa que representa"
              />
            </fieldset>

            <fieldset className="fieldset p-0">
              <label className="label">Almacén</label>
              <SearchableSelect
                value={almacen}
                onChange={setAlmacen}
                options={ALMACENES}
                ariaLabel="Almacén"
              />
            </fieldset>

            <fieldset className="fieldset p-0">
              <label className="label">Centro de costos</label>
              <SearchableSelect
                value={centroCostos}
                onChange={setCentroCostos}
                options={CENTROS_COSTOS}
                placeholder="Selecciona un centro de costos"
                ariaLabel="Centro de costos"
              />
            </fieldset>
          </div>

          <p className="text-base-content/60 mt-5 text-xs font-medium tracking-wide">
            PERSONAS
          </p>
          <div className="mt-3 grid grid-cols-1 gap-x-7 gap-y-1 sm:grid-cols-2">
            <fieldset className="fieldset p-0">
              <label className="label" htmlFor="solicitante">
                Solicitante
              </label>
              <label className="input w-full">
                <input
                  id="solicitante"
                  type="text"
                  className="grow"
                  value="Enrique Emilio Costantini"
                  disabled
                />
                <Lock className="size-4 opacity-60" />
              </label>
              <p className="text-info label text-xs">
                Se completa con el usuario que inició sesión
              </p>
            </fieldset>

            <fieldset className="fieldset p-0">
              <label className="label">Nombre del retirante</label>
              <SearchableSelect
                value={retirante}
                onChange={setRetirante}
                options={RETIRANTES}
                placeholder="Selecciona un retirante"
                ariaLabel="Nombre del retirante"
              />
            </fieldset>
          </div>

          <p className="text-base-content/60 mt-5 text-xs font-medium tracking-wide">
            PRODUCTOS
          </p>
          <div className="mt-3 flex flex-col items-end gap-3 sm:flex-row">
            <fieldset className="fieldset w-full p-0">
              <label className="label">Detalle del producto</label>
              <SearchableSelect
                value={producto}
                onChange={setProducto}
                options={PRODUCTOS}
                placeholder="Nombre del producto o código"
                ariaLabel="Detalle del producto"
              />
            </fieldset>

            <fieldset className="fieldset w-full max-w-[125px] p-0">
              <label className="label" htmlFor="unidades">
                Unidades
              </label>
              <input
                id="unidades"
                type="number"
                min={1}
                value={unidades}
                onChange={(event) =>
                  setUnidades(Math.max(1, Number(event.target.value)))
                }
                className="input w-full"
              />
            </fieldset>

            <button
              type="button"
              className="btn btn-outline gap-1"
              disabled={!puedeAgregarProducto}
              onClick={agregarProducto}
            >
              <Plus className="size-4" />
              Agregar
            </button>
          </div>

          {productosAgregados.length > 0 && (
            <ul className="border-base-300 mt-3 divide-y divide-base-300 overflow-hidden rounded-lg border">
              {productosAgregados.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                >
                  <span>{item.nombre}</span>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-sm badge-soft">
                      {item.unidades} uds
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-circle"
                      aria-label={`Quitar ${item.nombre}`}
                      onClick={() => quitarProducto(index)}
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <fieldset className="fieldset mt-5 p-0">
            <label className="label" htmlFor="observaciones">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              className="textarea w-full"
              placeholder="Opcional"
              rows={3}
              value={observaciones}
              onChange={(event) => setObservaciones(event.target.value)}
            />
          </fieldset>

          <div className="modal-action">
            <button type="submit" className="btn btn-ghost">
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!puedeConfirmar}
              onClick={() =>
                showToast('success', 'Vale de salida solicitado correctamente')
              }
            >
              Confirmar entrega
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
