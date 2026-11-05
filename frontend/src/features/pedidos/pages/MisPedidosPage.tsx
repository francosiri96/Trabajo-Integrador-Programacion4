import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCancelarPedido, usePedidos } from '../hooks/usePedidos'
import { DetallePedido } from '../components/DetallePedido'
import type { Pedido } from '../types/pedido'
import { handleApiError } from '../../../shared/api/handleApiError'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Modal } from '../../../shared/ui/Modal'
import { Paginacion } from '../../../shared/components/Paginacion'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { EstadoError } from '../../../shared/components/EstadoError'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'

const POR_PAGINA = 10

export function MisPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const [seleccionado, setSeleccionado] = useState<Pedido | null>(null)
  const [errorCancelar, setErrorCancelar] = useState('')

  const { data, isLoading, isError, error } = usePedidos({ skip: pagina * POR_PAGINA, limit: POR_PAGINA })
  const cancelar = useCancelarPedido()

  const cancelarPedido = async (pedido: Pedido) => {
    if (!window.confirm(`¿Cancelar el pedido #${pedido.id}?`)) return
    setErrorCancelar('')
    try {
      await cancelar.mutateAsync(pedido.id)
    } catch (e) {
      setErrorCancelar(handleApiError(e))
    }
  }

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis pedidos</h1>

      {isError && <EstadoError mensaje={handleApiError(error)} />}
      {errorCancelar && <EstadoError mensaje={errorCancelar} />}

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}

      {data && data.items.length === 0 && (
        <EstadoVacio mensaje="Todavía no hiciste ningún pedido.">
          <Link to="/" className="text-orange-600 hover:underline">
            Ir al catálogo
          </Link>
        </EstadoVacio>
      )}

      <div className="flex flex-col gap-3">
        {data?.items.map((pedido) => (
          <Card key={pedido.id} className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-40">
              <p className="font-semibold">Pedido #{pedido.id}</p>
              <p className="text-sm text-gray-500">{formatearFecha(pedido.created_at)}</p>
            </div>
            <BadgeEstado estado={pedido.estado} />
            <span className="font-medium w-28 text-right">{formatearPrecio(pedido.total)}</span>
            <div className="flex gap-2">
              <Button variante="secundario" onClick={() => setSeleccionado(pedido)}>
                Ver detalle
              </Button>
              {pedido.estado === 'PENDIENTE' && (
                <Button variante="peligro" disabled={cancelar.isPending} onClick={() => cancelarPedido(pedido)}>
                  Cancelar
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />

      <Modal
        titulo={`Pedido #${seleccionado?.id ?? ''}`}
        abierto={seleccionado !== null}
        onCerrar={() => setSeleccionado(null)}
      >
        {seleccionado && <DetallePedido pedido={seleccionado} />}
      </Modal>
    </div>
  )
}
