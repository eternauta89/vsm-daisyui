import { useState } from 'react'
import { CheckCircle2, PenLine, Search, SearchX } from 'lucide-react'
import CapturarFirmaModal from '../components/CapturarFirmaModal'
import Pagination from '../components/Pagination'

type Solicitud = {
  vsm: string
  retirante: string
  legajo: string
  solicitante: string
  cc: string
  fechaSolicitud: string
  firmado: boolean
}

const solicitudesIniciales: Solicitud[] = [
  {
    vsm: '#1500',
    retirante: 'Juarez Bruno Tomas',
    legajo: 'Leg. 29369',
    solicitante: 'frodriguez',
    cc: '123',
    fechaSolicitud: '24/06/2026',
    firmado: false,
  },
  {
    vsm: '#1501',
    retirante: 'Valenzuela Alberto Javier',
    legajo: 'Leg. 2558',
    solicitante: 'frodriguez',
    cc: '123',
    fechaSolicitud: '24/06/2026',
    firmado: true,
  },
  {
    vsm: '#1502',
    retirante: 'Ledesma Jorge Omar',
    legajo: 'Leg. 4021',
    solicitante: 'pfernandez',
    cc: '640',
    fechaSolicitud: '23/06/2026',
    firmado: false,
  },
  {
    vsm: '#1503',
    retirante: 'Juarez Bruno Tomas',
    legajo: 'Leg. 29369',
    solicitante: 'frodriguez',
    cc: '123',
    fechaSolicitud: '23/06/2026',
    firmado: false,
  },
]

const columns = [
  'ID',
  'RETIRANTE',
  'SOLICITANTE',
  'CC',
  'FECHA DE SOLICITUD',
  'ESTADO',
]

export default function FirmasDigitales() {
  const [search, setSearch] = useState('')
  const [busquedaAplicada, setBusquedaAplicada] = useState('')
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales)
  const [seleccionada, setSeleccionada] = useState(solicitudesIniciales[0])
  const [pagina, setPagina] = useState(1)

  const buscar = () => setBusquedaAplicada(search)

  const busqueda = busquedaAplicada.trim().toLowerCase()
  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (busqueda === '') return true
    return (
      solicitud.vsm.toLowerCase().includes(busqueda) ||
      solicitud.retirante.toLowerCase().includes(busqueda) ||
      solicitud.solicitante.toLowerCase().includes(busqueda) ||
      solicitud.cc.toLowerCase().includes(busqueda)
    )
  })

  const abrirCaptura = (solicitud: Solicitud) => {
    setSeleccionada(solicitud)
    ;(
      document.getElementById(
        'capturar_firma_modal',
      ) as HTMLDialogElement | null
    )?.showModal()
  }

  const marcarFirmada = () => {
    setSolicitudes((current) =>
      current.map((item) =>
        item.vsm === seleccionada.vsm ? { ...item, firmado: true } : item,
      ),
    )
  }

  return (
    <div className="card bg-base-100 rounded-box border border-base-300 p-4 shadow-sm sm:p-6">
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

      <div className="mt-4 max-w-full overflow-x-auto rounded-box border border-base-300">
        <table className="table table-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-0">
                  <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                    <SearchX className="text-base-content/30 size-8" />
                    <p className="font-medium">No se encontraron firmas</p>
                    <p className="text-base-content/60 max-w-sm text-sm">
                      No hay resultados para "{busquedaAplicada}". Probá con
                      otro VSM, retirante, solicitante o CC.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              solicitudesFiltradas.map((solicitud) => (
                <tr key={solicitud.vsm} className="hover:bg-base-200">
                  <td className="text-primary font-medium">
                    {solicitud.vsm}
                  </td>
                  <td>
                    <div className="font-medium">{solicitud.retirante}</div>
                    <div className="text-xs opacity-60">
                      {solicitud.legajo}
                    </div>
                  </td>
                  <td>{solicitud.solicitante}</td>
                  <td>{solicitud.cc}</td>
                  <td>{solicitud.fechaSolicitud}</td>
                  <td>
                    {solicitud.firmado ? (
                      <span className="badge badge-success gap-1 text-white">
                        <CheckCircle2 className="size-3.5" />
                        Firmado
                      </span>
                    ) : (
                      <span className="badge badge-warning badge-soft">
                        Sin firmar
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary gap-1"
                      disabled={solicitud.firmado}
                      onClick={() => abrirCaptura(solicitud)}
                    >
                      <PenLine className="size-4" />
                      Capturar firma
                    </button>
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

      <CapturarFirmaModal
        vsm={seleccionada.vsm}
        retirante={seleccionada.retirante}
        legajo={seleccionada.legajo}
        onFirmado={marcarFirmada}
      />
    </div>
  )
}
