import { useState } from 'react'
import {
  ChevronDown,
  Eye,
  Filter,
  MoreVertical,
  Pencil,
  Plus,
  Printer,
  Search,
  SearchX,
  Trash2,
  X,
} from 'lucide-react'
import VerMaterialesModal from '../components/VerMaterialesModal'
import EntregarMaterialesModal from '../components/EntregarMaterialesModal'
import EstadoBadge, { type EstadoVale } from '../components/EstadoBadge'
import Pagination from '../components/Pagination'

type Vale = {
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

const estadosPorTab: Record<string, Vale['estado'][]> = {
  todos: [
    'Pendiente',
    'Entregado',
    'No autorizada',
    'Pendiente',
    'Entregado',
    'Pendiente',
  ],
  pendientes: Array(6).fill('Pendiente'),
  entregados: Array(6).fill('Entregado'),
  'no-autorizadas': Array(6).fill('No autorizada'),
}

function getVales(tab: string): Vale[] {
  return estadosPorTab[tab].map((estado) => ({
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
}

const tabs = [
  { key: 'todos', label: 'Todos', count: 12 },
  { key: 'pendientes', label: 'Pendientes', count: 16 },
  { key: 'entregados', label: 'Entregados', count: 10 },
  { key: 'no-autorizadas', label: 'No autorizadas', count: 12 },
]

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

const filtroDefaults = {
  tipoEntrega: 'Todos',
  retirante: 'Todos',
  solicitante: 'Todos',
  empresa: 'Todas',
  centroCostos: 'Todos',
}

const filtroLabels: Record<keyof typeof filtroDefaults, string> = {
  tipoEntrega: 'Tipo de entrega',
  retirante: 'Retirante',
  solicitante: 'Solicitante',
  empresa: 'Empresa',
  centroCostos: 'Centro de costos',
}

export default function ValesDeSalida() {
  const [activeTab, setActiveTab] = useState('pendientes')
  const [filters, setFilters] = useState<{ key: string; label: string }[]>([])
  const [filtroForm, setFiltroForm] = useState(filtroDefaults)
  const [search, setSearch] = useState('')
  const [busquedaAplicada, setBusquedaAplicada] = useState('')
  const [pagina, setPagina] = useState(1)
  const vales = getVales(activeTab)

  const buscar = () => setBusquedaAplicada(search)

  const busqueda = busquedaAplicada.trim().toLowerCase()
  const valesFiltrados = vales.filter((vale) => {
    if (busqueda === '') return true
    return (
      vale.vsm.toLowerCase().includes(busqueda) ||
      vale.retirante.toLowerCase().includes(busqueda) ||
      vale.solicitante.toLowerCase().includes(busqueda) ||
      vale.cc.toLowerCase().includes(busqueda)
    )
  })

  const cerrarPanelFiltros = () =>
    (
      document.getElementById('filtros-panel') as HTMLElement | null
    )?.hidePopover()

  const limpiarFiltros = () => {
    setFiltroForm(filtroDefaults)
    setFilters([])
  }

  const aplicarFiltros = () => {
    setFilters(
      (Object.keys(filtroForm) as (keyof typeof filtroDefaults)[])
        .filter((key) => filtroForm[key] !== filtroDefaults[key])
        .map((key) => ({
          key,
          label: `${filtroLabels[key]}: ${filtroForm[key]}`,
        })),
    )
    cerrarPanelFiltros()
  }

  return (
    <div className="card bg-base-100 rounded-box border border-base-300 p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full gap-2 sm:max-w-md">
          <label className="input w-full">
            <Search className="size-4 opacity-60" />
            <input
              type="search"
              className="grow"
              placeholder="Buscar por solicitante, retirante, VSM, o CC..."
              value={search}
              onChange={(event) => {
                const value = event.target.value
                setSearch(value)
                if (value === '') setBusquedaAplicada('')
              }}
              onKeyDown={(event) => event.key === 'Enter' && buscar()}
            />
          </label>
          <button type="button" className="btn btn-primary" onClick={buscar}>
            Buscar
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-outline btn-primary gap-2"
            popoverTarget="filtros-panel"
            style={{ anchorName: '--filtros-panel' } as React.CSSProperties}
          >
            <Filter className="size-4" />
            {filters.length > 0 ? `Filtros - ${filters.length}` : 'Filtros'}
            <ChevronDown className="size-4" />
          </button>
          <div
            className="dropdown dropdown-end bg-base-200 text-base-content rounded-box z-1 mt-2 w-72 p-4 shadow-md"
            popover="auto"
            id="filtros-panel"
            style={{ positionAnchor: '--filtros-panel' } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">Filtros</span>
              <button
                type="button"
                className="link link-hover text-sm"
                onClick={limpiarFiltros}
              >
                Limpiar
              </button>
            </div>

            <fieldset className="fieldset mt-2 p-0">
              <label className="label" htmlFor="filtro-tipo-entrega">
                Tipo de entrega
              </label>
              <select
                id="filtro-tipo-entrega"
                className="select w-full"
                value={filtroForm.tipoEntrega}
                onChange={(event) =>
                  setFiltroForm((current) => ({
                    ...current,
                    tipoEntrega: event.target.value,
                  }))
                }
              >
                <option>Todos</option>
                <option>EPP</option>
                <option>Herramientas</option>
                <option>Insumos</option>
              </select>
            </fieldset>

            <fieldset className="fieldset mt-2 p-0">
              <label className="label" htmlFor="filtro-retirante">
                Retirante
              </label>
              <select
                id="filtro-retirante"
                className="select w-full"
                value={filtroForm.retirante}
                onChange={(event) =>
                  setFiltroForm((current) => ({
                    ...current,
                    retirante: event.target.value,
                  }))
                }
              >
                <option>Todos</option>
                <option>Juarez Bruno Tomas</option>
              </select>
            </fieldset>

            <fieldset className="fieldset mt-2 p-0">
              <label className="label" htmlFor="filtro-solicitante">
                Solicitante
              </label>
              <select
                id="filtro-solicitante"
                className="select w-full"
                value={filtroForm.solicitante}
                onChange={(event) =>
                  setFiltroForm((current) => ({
                    ...current,
                    solicitante: event.target.value,
                  }))
                }
              >
                <option>Todos</option>
                <option>frodriguez</option>
              </select>
            </fieldset>

            <fieldset className="fieldset mt-2 p-0">
              <label className="label" htmlFor="filtro-empresa">
                Empresa
              </label>
              <select
                id="filtro-empresa"
                className="select w-full"
                value={filtroForm.empresa}
                onChange={(event) =>
                  setFiltroForm((current) => ({
                    ...current,
                    empresa: event.target.value,
                  }))
                }
              >
                <option>Todas</option>
                <option>Rioplatense</option>
              </select>
            </fieldset>

            <fieldset className="fieldset mt-2 p-0">
              <label className="label" htmlFor="filtro-cc">
                Centro de costos
              </label>
              <select
                id="filtro-cc"
                className="select w-full"
                value={filtroForm.centroCostos}
                onChange={(event) =>
                  setFiltroForm((current) => ({
                    ...current,
                    centroCostos: event.target.value,
                  }))
                }
              >
                <option>Todos</option>
                <option>123</option>
              </select>
            </fieldset>

            <button
              type="button"
              className="btn btn-primary mt-4 w-full"
              onClick={aplicarFiltros}
            >
              Aplicar
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary gap-2"
            onClick={() =>
              (
                document.getElementById(
                  'solicitar_vale_modal',
                ) as HTMLDialogElement | null
              )?.showModal()
            }
          >
            <Plus className="size-4" />
            Solicitar vale
          </button>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-box mt-4 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            className={`tab ${
              activeTab === tab.key
                ? 'tab-active bg-base-300 text-primary border-primary border-b-2 font-semibold'
                : ''
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {filters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <span key={filter.key} className="badge badge-soft gap-1 py-4">
              <button
                type="button"
                aria-label={`Quitar filtro ${filter.label}`}
                onClick={() =>
                  setFilters((current) =>
                    current.filter((item) => item.key !== filter.key),
                  )
                }
              >
                <X className="size-3" />
              </button>
              {filter.label}
            </span>
          ))}
          <button
            type="button"
            className="link link-hover text-sm"
            onClick={() => setFilters([])}
          >
            Limpiar todo
          </button>
        </div>
      )}

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
            {valesFiltrados.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-0">
                  <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                    <SearchX className="text-base-content/30 size-8" />
                    <p className="font-medium">No se encontraron vales</p>
                    <p className="text-base-content/60 max-w-sm text-sm">
                      No hay resultados para "{busquedaAplicada}" en esta
                      pestaña.
                      Probá con otro VSM, retirante, solicitante o CC.
                    </p>
                  </div>
                </td>
              </tr>
            )}
            {valesFiltrados.map((vale, index) => (
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
                    {vale.vsm}
                  </button>
                </td>
                <td>
                  <span className="badge badge-accent badge-sm">
                    {vale.tipo}
                  </span>
                </td>
                <td>
                  <div className="font-medium">{vale.retirante}</div>
                  <div className="text-xs opacity-60">{vale.legajo}</div>
                </td>
                <td>{vale.solicitante}</td>
                <td>
                  <div>{vale.almacen}</div>
                  <div className="text-xs opacity-60">{vale.facturado}</div>
                </td>
                <td>{vale.cc}</td>
                <td>{vale.fecha}</td>
                <td>
                  <EstadoBadge estado={vale.estado} />
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="btn btn-neutral"
                      disabled={vale.estado === 'Entregado'}
                      onClick={() =>
                        (
                          document.getElementById(
                            'entregar_materiales_modal',
                          ) as HTMLDialogElement | null
                        )?.showModal()
                      }
                    >
                      Entregar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-square hover:bg-black/10"
                      aria-label="Más acciones"
                      popoverTarget={`acciones-vale-${index}`}
                      style={
                        {
                          anchorName: `--acciones-vale-${index}`,
                        } as React.CSSProperties
                      }
                    >
                      <MoreVertical className="size-4" />
                    </button>
                    <ul
                      className="dropdown dropdown-end menu bg-base-100 text-base-content rounded-box z-1 mt-2 w-48 p-2 shadow-md"
                      popover="auto"
                      id={`acciones-vale-${index}`}
                      style={
                        {
                          positionAnchor: `--acciones-vale-${index}`,
                        } as React.CSSProperties
                      }
                    >
                      <li>
                        <button
                          type="button"
                          onClick={() =>
                            (
                              document.getElementById(
                                'ver_materiales_modal',
                              ) as HTMLDialogElement | null
                            )?.showModal()
                          }
                        >
                          <Eye className="size-4" />
                          Ver comprobante
                        </button>
                      </li>
                      <li>
                        <button type="button" onClick={() => window.print()}>
                          <Printer className="size-4" />
                          Imprimir
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() =>
                            (
                              document.getElementById(
                                'solicitar_vale_modal',
                              ) as HTMLDialogElement | null
                            )?.showModal()
                          }
                        >
                          <Pencil className="size-4" />
                          Editar vale
                        </button>
                      </li>
                      <li>
                        <button type="button" className="text-error">
                          <Trash2 className="size-4" />
                          Borrar comprobante
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
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
      <EntregarMaterialesModal />
    </div>
  )
}
