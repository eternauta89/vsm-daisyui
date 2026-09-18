import { useState } from 'react'
import { Pencil, Search, SearchX } from 'lucide-react'
import Pagination from '../components/Pagination'

type TabKey = 'sin-permiso' | 'con-permiso' | 'por-centro'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'sin-permiso', label: 'Sin permiso' },
  { key: 'con-permiso', label: 'Con permiso' },
  { key: 'por-centro', label: 'Por centro de costo' },
]

const tabCopy: Record<TabKey, { title: string; description: string }> = {
  'sin-permiso': {
    title: 'Materiales sin centro de costos',
    description:
      'Centros de costo sin materiales asignados. Asigná qué materiales pueden retirarse en cada uno.',
  },
  'con-permiso': {
    title: 'Materiales con centro de costo asignado',
    description:
      'Centros con materiales habilitados. Editá qué puede retirarse en cada centro.',
  },
  'por-centro': {
    title: 'Permisos por Centro de Costo',
    description:
      'Listado completo de centros de costo. Elegí un centro para editar los materiales que se pueden retirar.',
  },
}

type MaterialRow = {
  codigo: string
  descripcion: string
  claseSap: string
  centro: string
}

const materiales: MaterialRow[] = Array.from({ length: 6 }, () => ({
  codigo: '151400051',
  descripcion: 'GUANTE EXAM. NITRILO T.M LIB POLVO AZUL',
  claseSap: 'REP. MAQ',
  centro: '10000',
}))

type CentroRow = {
  codigo: string
  nombre: string
  materialesAsignados: number
}

const centros: CentroRow[] = [
  { codigo: '151400051', nombre: 'No Autorizado', materialesAsignados: 244 },
  { codigo: '151400051', nombre: 'Playa de Faena', materialesAsignados: 244 },
  { codigo: '151400051', nombre: 'Playa de Oreo', materialesAsignados: 244 },
  {
    codigo: '151400051',
    nombre: 'Menudencia de Cabeza',
    materialesAsignados: 244,
  },
  { codigo: '151400051', nombre: 'Mondongueria', materialesAsignados: 244 },
  { codigo: '151400051', nombre: 'Cueros', materialesAsignados: 244 },
  { codigo: '151400051', nombre: 'Depostada', materialesAsignados: 244 },
]

export default function PermisoDeRetiro() {
  const [activeTab, setActiveTab] = useState<TabKey>('sin-permiso')
  const [search, setSearch] = useState('')
  const [busquedaAplicada, setBusquedaAplicada] = useState('')
  const [pagina, setPagina] = useState(1)
  const copy = tabCopy[activeTab]

  const buscar = () => setBusquedaAplicada(search)

  const busqueda = busquedaAplicada.trim().toLowerCase()

  const materialesFiltrados = materiales.filter(
    (material) =>
      busqueda === '' ||
      material.codigo.toLowerCase().includes(busqueda) ||
      material.descripcion.toLowerCase().includes(busqueda),
  )

  const centrosFiltrados = centros.filter(
    (centro) =>
      busqueda === '' ||
      centro.codigo.toLowerCase().includes(busqueda) ||
      centro.nombre.toLowerCase().includes(busqueda),
  )

  return (
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

      <h2 className="mt-4 text-xl font-medium">{copy.title}</h2>
      <p className="text-base-content/70 mt-1 text-sm">{copy.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
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
              if (value === '') setBusquedaAplicada('')
            }}
            onKeyDown={(event) => event.key === 'Enter' && buscar()}
          />
        </label>
        <button type="button" className="btn btn-primary" onClick={buscar}>
          Buscar
        </button>
      </div>

      <div className="mt-4 max-w-full overflow-x-auto rounded-box border border-base-300">
        <table className="table table-sm">
          {activeTab === 'por-centro' ? (
            <>
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>DESCRIPCIÓN</th>
                  <th>MATERIALES ASIGNADOS</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {centrosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                        <SearchX className="text-base-content/30 size-8" />
                        <p className="font-medium">
                          No se encontraron centros de costo
                        </p>
                        <p className="text-base-content/60 max-w-sm text-sm">
                          No hay resultados para "{busquedaAplicada}". Probá con otro
                          código o nombre de centro.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  centrosFiltrados.map((centro, index) => (
                    <tr key={index} className="hover:bg-base-200">
                      <td className="text-primary font-medium">
                        {centro.codigo}
                      </td>
                      <td>{centro.nombre}</td>
                      <td>
                        <span className="badge badge-info badge-sm text-white">
                          {centro.materialesAsignados}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn gap-1 border-none bg-[#880d27] text-white hover:bg-[#6e0a1f]"
                        >
                          <Pencil className="size-3.5" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>DESCRIPCIÓN</th>
                  <th>CLASE SAP</th>
                  <th>CENTRO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {materialesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                        <SearchX className="text-base-content/30 size-8" />
                        <p className="font-medium">
                          No se encontraron materiales
                        </p>
                        <p className="text-base-content/60 max-w-sm text-sm">
                          No hay resultados para "{busquedaAplicada}". Probá con otro
                          código o descripción.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  materialesFiltrados.map((material, index) => (
                    <tr key={index} className="hover:bg-base-200">
                      <td className="text-primary font-medium">
                        {material.codigo}
                      </td>
                      <td>{material.descripcion}</td>
                      <td>
                        <span className="badge badge-info badge-sm text-white">
                          {material.claseSap}
                        </span>
                      </td>
                      <td>{material.centro}</td>
                      <td>
                        <button
                          type="button"
                          className="btn gap-1 border-none bg-[#880d27] text-white hover:bg-[#6e0a1f]"
                        >
                          <Pencil className="size-3.5" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </>
          )}
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
    </div>
  )
}
