import { useState } from 'react'
import { Calendar, FileText, Search, SearchX } from 'lucide-react'
import EstadoBadge, { type EstadoVale } from '../components/EstadoBadge'
import VerMaterialesModal from '../components/VerMaterialesModal'
import Pagination from '../components/Pagination'

type Registro = {
  vsm: string
  tipo: string
  retirante: string
  legajo: string
  solicitante: string
  almacen: string
  facturado: string
  cc: string
  fecha: string
  estado: EstadoVale
}

const estados: EstadoVale[] = [
  'Entregado',
  'Entregado',
  'Pendiente',
  'No autorizada',
  'Entregado',
  'Pendiente',
]

const registros: Registro[] = estados.map((estado) => ({
  vsm: '#1500',
  tipo: 'EPP',
  retirante: 'Juarez Bruno Tomas',
  legajo: 'Leg. 29369',
  solicitante: 'frodriguez',
  almacen: 'INC',
  facturado: 'No facturado',
  cc: '123',
  fecha: '24/06/2026',
  estado,
}))

const columns = [
  'VSM',
  'TIPO',
  'RETIRANTE',
  'SOLICITANTE',
  'ALMACÉN',
  'CC',
  'FECHA',
  'ESTADO',
]

function fechaArgAIso(fecha: string) {
  const [dia, mes, anio] = fecha.split('/')
  return `${anio}-${mes}-${dia}`
}

const filtrosVacios = {
  search: '',
  estado: 'todos',
  fechaDesde: '',
  fechaHasta: '',
}

export default function Registros() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [aplicado, setAplicado] = useState(filtrosVacios)
  const [pagina, setPagina] = useState(1)

  const buscar = () => setAplicado({ search, estado, fechaDesde, fechaHasta })

  const limpiarFiltros = () => {
    setSearch('')
    setEstado('todos')
    setFechaDesde('')
    setFechaHasta('')
    setAplicado(filtrosVacios)
  }

  const busqueda = aplicado.search.trim().toLowerCase()

  const registrosFiltrados = registros.filter((registro) => {
    const coincideBusqueda =
      busqueda === '' ||
      registro.vsm.toLowerCase().includes(busqueda) ||
      registro.retirante.toLowerCase().includes(busqueda) ||
      registro.solicitante.toLowerCase().includes(busqueda) ||
      registro.cc.toLowerCase().includes(busqueda)
    const coincideEstado =
      aplicado.estado === 'todos' || registro.estado === aplicado.estado
    const fechaIso = fechaArgAIso(registro.fecha)
    const coincideDesde =
      aplicado.fechaDesde === '' || fechaIso >= aplicado.fechaDesde
    const coincideHasta =
      aplicado.fechaHasta === '' || fechaIso <= aplicado.fechaHasta
    return coincideBusqueda && coincideEstado && coincideDesde && coincideHasta
  })

  return (
    <div className="card bg-base-100 rounded-box border border-base-300 p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <label className="input w-full xl:max-w-sm">
          <Search className="size-4 opacity-60" />
          <input
            type="search"
            className="grow"
            placeholder="Buscar por solicitante, retirante, VSM, o CC..."
            value={search}
            onChange={(event) => {
              const value = event.target.value
              setSearch(value)
              if (value === '')
                setAplicado((current) => ({ ...current, search: '' }))
            }}
            onKeyDown={(event) => event.key === 'Enter' && buscar()}
          />
        </label>

        <div className="flex flex-wrap items-end gap-3">
          <fieldset className="fieldset p-0">
            <label className="label" htmlFor="registros-estado">
              Estado
            </label>
            <select
              id="registros-estado"
              className="select w-40"
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Entregado">Entregado</option>
              <option value="No autorizada">No autorizada</option>
            </select>
          </fieldset>

          <fieldset className="fieldset p-0">
            <label className="label" htmlFor="registros-desde">
              Fechas desde
            </label>
            <label className="input" htmlFor="registros-desde">
              <Calendar className="size-4 opacity-60" />
              <input
                id="registros-desde"
                type="date"
                className="grow"
                value={fechaDesde}
                onChange={(event) => setFechaDesde(event.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="fieldset p-0">
            <label className="label" htmlFor="registros-hasta">
              Fechas hasta
            </label>
            <label className="input" htmlFor="registros-hasta">
              <Calendar className="size-4 opacity-60" />
              <input
                id="registros-hasta"
                type="date"
                className="grow"
                value={fechaHasta}
                onChange={(event) => setFechaHasta(event.target.value)}
              />
            </label>
          </fieldset>

          <button type="button" className="btn btn-primary" onClick={buscar}>
            Buscar
          </button>
          <button
            type="button"
            className="link link-hover text-sm"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="mt-4 max-w-full overflow-x-auto rounded-box border border-base-300">
        <table className="table table-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-0">
                  <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                    <SearchX className="text-base-content/30 size-8" />
                    <p className="font-medium">No se encontraron registros</p>
                    <p className="text-base-content/60 max-w-sm text-sm">
                      No hay resultados para "
                      {aplicado.search || 'esta búsqueda'}" con el estado y
                      rango de fechas seleccionados. Probá con otro VSM,
                      retirante o CC, o ajustá los filtros.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((registro, index) => (
                <tr key={index} className="hover:bg-base-200">
                  <td>
                    <button
                      type="button"
                      className="link link-hover font-medium text-base-content/70"
                      onClick={() =>
                        (
                          document.getElementById(
                            'ver_materiales_modal',
                          ) as HTMLDialogElement | null
                        )?.showModal()
                      }
                    >
                      {registro.vsm}
                    </button>
                  </td>
                  <td>
                    <span className="badge badge-accent badge-sm">
                      {registro.tipo}
                    </span>
                  </td>
                  <td>
                    <div className="font-medium">{registro.retirante}</div>
                    <div className="text-xs opacity-60">
                      {registro.legajo}
                    </div>
                  </td>
                  <td>{registro.solicitante}</td>
                  <td>
                    <div>{registro.almacen}</div>
                    <div className="text-xs opacity-60">
                      {registro.facturado}
                    </div>
                  </td>
                  <td>{registro.cc}</td>
                  <td>{registro.fecha}</td>
                  <td>
                    <EstadoBadge estado={registro.estado} />
                  </td>
                  <td>
                    {registro.estado === 'Entregado' ? (
                      <button
                        type="button"
                        className="btn btn-ghost gap-1"
                        onClick={() =>
                          (
                            document.getElementById(
                              'ver_materiales_modal',
                            ) as HTMLDialogElement | null
                          )?.showModal()
                        }
                      >
                        <FileText className="size-4" />
                        Ver informe de pañol
                      </button>
                    ) : (
                      <span className="text-base-content/40">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm opacity-70">
          <span>1-6 de 100</span>
          <span>Filas</span>
          <select className="select w-20" defaultValue="12">
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>

        <Pagination page={pagina} onPageChange={setPagina} />
      </div>

      <VerMaterialesModal />
    </div>
  )
}
