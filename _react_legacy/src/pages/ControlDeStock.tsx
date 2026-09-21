import { useState } from 'react'
import { Calendar, Package, Search, SearchX, TriangleAlert } from 'lucide-react'
import Pagination from '../components/Pagination'

type TabKey = 'por-fecha' | 'existencia-sap'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'por-fecha', label: 'Por fecha' },
  { key: 'existencia-sap', label: 'Existencia SAP' },
]

type Movimiento = {
  codigo: string
  descripcion: string
  almacen: string
  cantidadEntregada: string
  fecha: string
}

const movimientos: Movimiento[] = Array.from({ length: 6 }, () => ({
  codigo: '151400051',
  descripcion: 'GUANTE EXAM. NITRILO T.M LIB POLVO AZUL',
  almacen: 'G001',
  cantidadEntregada: '47631 uds',
  fecha: '11/08/2026',
}))

const columnsPorFecha = [
  'CÓDIGO',
  'DESCRIPCIÓN',
  'ALMACÉN',
  'CANTIDAD ENTREGADA',
  'FECHA',
]

type Articulo = {
  codigo: string
  descripcion: string
  centro: string
  almacen: string
  stockSap: string
}

const articulos: Articulo[] = Array.from({ length: 6 }, () => ({
  codigo: '151400051',
  descripcion: 'GUANTE EXAM. NITRILO T.M LIB POLVO AZUL',
  centro: '10000',
  almacen: 'G001',
  stockSap: '148000',
}))

const columnsExistencia = ['CÓDIGO', 'DESCRIPCIÓN', 'CENTRO', 'ALMACÉN', 'STOCK SAP']

function formatFecha(date: Date) {
  return date.toISOString().slice(0, 10)
}

function fechaArgAIso(fecha: string) {
  const [dia, mes, anio] = fecha.split('/')
  return `${anio}-${mes}-${dia}`
}

const presets = [
  { key: 'hoy', label: 'Hoy', dias: 0 },
  { key: 'semana', label: 'Última semana', dias: 7 },
  { key: 'mes', label: 'Último mes', dias: 30 },
] as const

export default function ControlDeStock() {
  const [activeTab, setActiveTab] = useState<TabKey>('por-fecha')
  const [search, setSearch] = useState('')
  const [almacen, setAlmacen] = useState('todos')
  const [fechaHasta, setFechaHasta] = useState('2026-08-11')
  const [fechaDesde, setFechaDesde] = useState('2026-08-11')
  const [presetActivo, setPresetActivo] = useState<string | null>(null)
  const [soloConStock, setSoloConStock] = useState(false)
  const [pagina, setPagina] = useState(1)

  const rangoInvalido =
    fechaDesde !== '' && fechaHasta !== '' && fechaDesde > fechaHasta

  const aplicarPreset = (key: string, dias: number) => {
    const hoy = new Date()
    const desde = new Date(hoy)
    desde.setDate(hoy.getDate() - dias)
    setFechaDesde(formatFecha(desde))
    setFechaHasta(formatFecha(hoy))
    setPresetActivo(key)
  }

  const cambiarFechaDesde = (value: string) => {
    setFechaDesde(value)
    setPresetActivo(null)
  }

  const cambiarFechaHasta = (value: string) => {
    setFechaHasta(value)
    setPresetActivo(null)
  }

  const [aplicadoPorFecha, setAplicadoPorFecha] = useState({
    search: '',
    fechaDesde: '2026-08-11',
    fechaHasta: '2026-08-11',
  })
  const [aplicadoExistencia, setAplicadoExistencia] = useState({
    search: '',
    almacen: 'todos',
    soloConStock: false,
  })

  const consultarPorFecha = () =>
    setAplicadoPorFecha({ search, fechaDesde, fechaHasta })

  const consultarExistencia = () =>
    setAplicadoExistencia({ search, almacen, soloConStock })

  const limpiarFiltros = () => {
    setSearch('')
    setAlmacen('todos')
    setFechaHasta('')
    setFechaDesde('')
    setPresetActivo(null)
    setSoloConStock(false)
    setAplicadoPorFecha({ search: '', fechaDesde: '', fechaHasta: '' })
    setAplicadoExistencia({ search: '', almacen: 'todos', soloConStock: false })
  }

  const movimientosFiltrados = movimientos.filter((movimiento) => {
    const busqueda = aplicadoPorFecha.search.trim().toLowerCase()
    const coincideBusqueda =
      busqueda === '' ||
      movimiento.codigo.toLowerCase().includes(busqueda) ||
      movimiento.descripcion.toLowerCase().includes(busqueda)
    const fechaIso = fechaArgAIso(movimiento.fecha)
    const coincideDesde =
      aplicadoPorFecha.fechaDesde === '' ||
      fechaIso >= aplicadoPorFecha.fechaDesde
    const coincideHasta =
      aplicadoPorFecha.fechaHasta === '' ||
      fechaIso <= aplicadoPorFecha.fechaHasta
    return coincideBusqueda && coincideDesde && coincideHasta
  })

  const articulosFiltrados = articulos.filter((articulo) => {
    const busqueda = aplicadoExistencia.search.trim().toLowerCase()
    const coincideBusqueda =
      busqueda === '' ||
      articulo.codigo.toLowerCase().includes(busqueda) ||
      articulo.descripcion.toLowerCase().includes(busqueda)
    const coincideAlmacen =
      aplicadoExistencia.almacen === 'todos' ||
      articulo.almacen === aplicadoExistencia.almacen
    const coincideStock =
      !aplicadoExistencia.soloConStock ||
      Number(articulo.stockSap.replace(/\D/g, '')) > 0
    return coincideBusqueda && coincideAlmacen && coincideStock
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-neutral text-neutral-content rounded-2xl border border-base-300 p-6 shadow-sm">
          <div className="text-primary flex items-center gap-2">
            <Package className="size-[18px]" />
            <span>Artículos</span>
          </div>
          <p className="mt-1 text-4xl font-extrabold">16</p>
        </div>

        <div className="bg-neutral text-neutral-content rounded-2xl border border-base-300 p-6 shadow-sm">
          <div className="text-primary flex items-center gap-2">
            <TriangleAlert className="size-[18px]" />
            <span>Unidades en Stock</span>
          </div>
          <p className="mt-1 text-4xl font-extrabold">3</p>
          <p className="text-sm opacity-60">
            Consultado en SAP el 17/09/2026 12:24
          </p>
        </div>
      </div>

      <div className="card bg-base-100 rounded-box border border-base-300 p-4 shadow-sm sm:p-6">
        <div role="tablist" className="tabs tabs-box w-fit">
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
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'existencia-sap' && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="input w-full sm:max-w-sm">
              <Search className="size-4 opacity-60" />
              <input
                type="search"
                className="grow"
                placeholder="Buscar articulo por código o descripción..."
                value={search}
                onChange={(event) => {
                  const value = event.target.value
                  setSearch(value)
                  if (value === '')
                    setAplicadoExistencia((current) => ({
                      ...current,
                      search: '',
                    }))
                }}
                onKeyDown={(event) =>
                  event.key === 'Enter' && consultarExistencia()
                }
              />
            </label>

            <fieldset className="fieldset w-full p-0 sm:w-64">
              <label className="label" htmlFor="filtro-almacen">
                Filtrar por almacén
              </label>
              <select
                id="filtro-almacen"
                className="select w-full !pr-16"
                value={almacen}
                onChange={(event) => setAlmacen(event.target.value)}
              >
                <option value="todos">Todos los almacenes</option>
                <option value="G001">G001</option>
                <option value="GCAR">GCAR</option>
              </select>
            </fieldset>

            <label className="label gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={soloConStock}
                onChange={(event) => setSoloConStock(event.target.checked)}
              />
              Solo con stock
            </label>

            <div className="flex items-center gap-3 sm:ml-auto">
              <button
                type="button"
                className="btn btn-primary"
                onClick={consultarExistencia}
              >
                Consultar
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
        )}

        {activeTab === 'por-fecha' && (
          <div className="bg-base-200 border-base-300 mt-4 rounded-lg border p-4">
            <p className="text-base-content/70 flex items-center gap-2 text-sm font-medium">
              <Calendar className="size-4" />
              Consulta a SAP por rango de fechas
            </p>

            <label className="input mt-3 w-full sm:max-w-sm">
              <Search className="size-4 opacity-60" />
              <input
                type="search"
                className="grow"
                placeholder="Buscar por código de material..."
                value={search}
                onChange={(event) => {
                  const value = event.target.value
                  setSearch(value)
                  if (value === '')
                    setAplicadoPorFecha((current) => ({
                      ...current,
                      search: '',
                    }))
                }}
                onKeyDown={(event) =>
                  event.key === 'Enter' && consultarPorFecha()
                }
              />
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  className={`btn btn-primary ${presetActivo === preset.key ? '' : 'btn-outline'}`}
                  onClick={() => aplicarPreset(preset.key, preset.dias)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="flex flex-wrap items-end gap-3">
                <fieldset className="fieldset p-0">
                  <label className="label" htmlFor="fecha-desde">
                    Fechas desde
                  </label>
                  <label
                    className={`input ${rangoInvalido ? 'input-error' : ''}`}
                    htmlFor="fecha-desde"
                  >
                    <Calendar className="size-4 opacity-60" />
                    <input
                      id="fecha-desde"
                      type="date"
                      className="grow"
                      value={fechaDesde}
                      onChange={(event) =>
                        cambiarFechaDesde(event.target.value)
                      }
                    />
                  </label>
                </fieldset>

                <fieldset className="fieldset p-0">
                  <label className="label" htmlFor="fecha-hasta">
                    Fechas hasta
                  </label>
                  <label
                    className={`input ${rangoInvalido ? 'input-error' : ''}`}
                    htmlFor="fecha-hasta"
                  >
                    <Calendar className="size-4 opacity-60" />
                    <input
                      id="fecha-hasta"
                      type="date"
                      className="grow"
                      value={fechaHasta}
                      onChange={(event) =>
                        cambiarFechaHasta(event.target.value)
                      }
                    />
                  </label>
                </fieldset>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={rangoInvalido}
                  onClick={consultarPorFecha}
                >
                  Consultar SAP
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

            {rangoInvalido && (
              <p className="text-error mt-2 text-sm">
                "Fechas desde" no puede ser posterior a "Fechas hasta".
              </p>
            )}
          </div>
        )}

        <div className="mt-4 max-w-full overflow-x-auto rounded-box border border-base-300">
          {activeTab === 'por-fecha' ? (
            <table className="table table-sm">
              <thead>
                <tr>
                  {columnsPorFecha.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={columnsPorFecha.length} className="p-0">
                      <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                        <SearchX className="text-base-content/30 size-8" />
                        <p className="font-medium">
                          No se encontraron movimientos
                        </p>
                        <p className="text-base-content/60 max-w-sm text-sm">
                          No hay resultados para "
                          {aplicadoPorFecha.search || 'esta búsqueda'}" en el
                          rango de fechas consultado. Probá con otro código o
                          ampliá el rango.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  movimientosFiltrados.map((movimiento, index) => (
                    <tr key={index} className="hover:bg-base-200">
                      <td className="text-primary font-medium">
                        {movimiento.codigo}
                      </td>
                      <td>{movimiento.descripcion}</td>
                      <td>{movimiento.almacen}</td>
                      <td>{movimiento.cantidadEntregada}</td>
                      <td>{movimiento.fecha}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="table table-sm">
              <thead>
                <tr>
                  {columnsExistencia.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articulosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={columnsExistencia.length} className="p-0">
                      <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                        <SearchX className="text-base-content/30 size-8" />
                        <p className="font-medium">
                          No se encontraron artículos
                        </p>
                        <p className="text-base-content/60 max-w-sm text-sm">
                          No hay resultados para "
                          {aplicadoExistencia.search || 'esta búsqueda'}" con
                          los filtros consultados. Probá con otro código,
                          almacén, o desmarcá "Solo con stock".
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  articulosFiltrados.map((articulo, index) => (
                    <tr key={index} className="hover:bg-base-200">
                      <td className="text-primary font-medium">
                        {articulo.codigo}
                      </td>
                      <td>{articulo.descripcion}</td>
                      <td>{articulo.centro}</td>
                      <td>{articulo.almacen}</td>
                      <td>{articulo.stockSap}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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
      </div>
    </div>
  )
}
