import { CheckCircle2, Printer, X } from 'lucide-react'

type Item = {
  cantidadSolicitada: number
  descripcion: string
  codigoArticulo: string
  cantidadEntregada: number
  reciboConforme: string
}

const items: Item[] = [
  {
    cantidadSolicitada: 1,
    descripcion: 'Faja lumbar',
    codigoArticulo: 'EPP-6634',
    cantidadEntregada: 0,
    reciboConforme: '',
  },
  {
    cantidadSolicitada: 2,
    descripcion: 'Arnés de altura',
    codigoArticulo: 'EPP-7702',
    cantidadEntregada: 2,
    reciboConforme: '',
  },
  {
    cantidadSolicitada: 3,
    descripcion: 'Casco de seguridad',
    codigoArticulo: 'EPP-1842',
    cantidadEntregada: 3,
    reciboConforme: '',
  },
]

export default function VerMaterialesModal() {
  return (
    <dialog id="ver_materiales_modal" className="modal">
      <div className="modal-box w-full max-w-2xl p-0 overflow-hidden">
        <div className="bg-primary text-primary-content flex items-start justify-between px-6 py-4">
          <div>
            <p className="text-xs tracking-wide opacity-80">RETIRA</p>
            <p className="text-xl font-medium">Valenzuela Alberto Javier</p>
            <p className="text-sm opacity-80">Leg.2558</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge badge-success gap-1 text-white">
              <CheckCircle2 className="size-3.5" />
              Entregado
            </span>
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
        </div>

        <form
          method="dialog"
          className="max-h-[70vh] overflow-y-auto px-6 py-5"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold">
              VALE DE SALIDA DE MATERIALES (VSM)
            </h4>
            <div className="text-right">
              <p className="text-sm font-semibold">Rioplatense</p>
              <p className="text-base-content/60 text-xs">FRIGORÍFICO</p>
            </div>
          </div>

          <div className="mt-3 max-w-full overflow-x-auto rounded-box border border-base-300">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>Cod. CBTE.</th>
                  <th>N. CBTE.</th>
                  <th>Tipo fact.</th>
                  <th>Fecha CBTE.</th>
                  <th>N° documento SAP</th>
                  <th>CC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>N° 1494</td>
                  <td>Facturado</td>
                  <td>24/06/2026</td>
                  <td>4900000822</td>
                  <td>640</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 max-w-full overflow-x-auto rounded-box border border-base-300">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>Cant. solicitada</th>
                  <th>Descripción</th>
                  <th>Código artículo</th>
                  <th>Cant. entregada</th>
                  <th>Recibí conforme</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.codigoArticulo}>
                    <td>{item.cantidadSolicitada}</td>
                    <td>{item.descripcion}</td>
                    <td className="text-info">{item.codigoArticulo}</td>
                    <td>{item.cantidadEntregada}</td>
                    <td>{item.reciboConforme}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 max-w-full overflow-x-auto rounded-box border border-base-300">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>Solicita</th>
                  <th>Autoriza</th>
                  <th>Control</th>
                  <th>Despacho</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ledesma Jorge Omar</td>
                  <td>pfernandez</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline btn-secondary gap-2"
            >
              <Printer className="size-4" />
              Imprimir
            </button>
            <button type="submit" className="btn btn-primary">
              Listo
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
