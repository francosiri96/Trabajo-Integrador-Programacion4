import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCambiarEstadoPedido, usePedidos } from '../hooks/usePedidos'
import { DetallePedido } from '../components/DetallePedido'
import type { EstadoPedido, Pedido } from '../types/pedido'
import { handleApiError } from '../../../shared/api/handleApiError'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { Tabla } from '../../../shared/components/Tabla'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { EstadoError } from '../../../shared/components/EstadoError'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'

// A qué estado avanza cada pedido (los terminales no avanzan)
const SIGUIENTE_ESTADO: Record<EstadoPedido, EstadoPedido | null> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'ENTREGADO',
  ENTREGADO: null,
  CANCELADO: null,
}

const ESTADOS: EstadoPedido[] = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO']

export function AdminPedidosPage() {
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | ''>('')
  const [seleccionado, setSeleccionado] = useState<Pedido | null>(null)
  const [errorAccion, setErrorAccion] = useState('')

  const { data, isLoading, isError, error } = usePedidos({
    skip: 0,
    limit: 100,
    estado: filtroEstado === '' ? undefined : filtroEstado,
  })
  const cambiarEstado = useCambiarEstadoPedido()

  const cambiar = async (pedido: Pedido, estado: EstadoPedido) => {
    if (estado === 'CANCELADO' && !window.confirm(`¿Cancelar el pedido #${pedido.id}?`)) return
    setErrorAccion('')
    try {
      await cambiarEstado.mutateAsync({ id: pedido.id, estado })
    } catch (e) {
      setErrorAccion(handleApiError(e))
    }
  }

  const columnas: ColumnDef<Pedido>[] = [
    { accessorKey: 'id', header: '#' },
    {
      id: 'fecha',
      header: 'Fecha',
      cell: ({ row }) => formatearFecha(row.original.created_at),
    },
    { accessorKey: 'usuario_id', header: 'Usuario' },
    {
      id: 'total',
      header: 'Total',
      cell: ({ row }) => formatearPrecio(row.original.total),
    },
    {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => <BadgeEstado estado={row.original.estado} />,
    },
    {
      id: 'acciones',
      header: '',
      cell: ({ row }) => {
        const pedido = row.original
        const siguiente = SIGUIENTE_ESTADO[pedido.estado]
        return (
          <div className="flex gap-2 justify-end">
            <Button variante="secundario" onClick={() => setSeleccionado(pedido)}>
              Ver
            </Button>
            {siguiente && (
              <Button disabled={cambiarEstado.isPending} onClick={() => cambiar(pedido, siguiente)}>
                {siguiente === 'EN_PREPARACION' ? 'Preparar' : 'Entregar'}
              </Button>
            )}
            {siguiente && (
              <Button
                variante="peligro"
                disabled={cambiarEstado.isPending}
                onClick={() => cambiar(pedido, 'CANCELADO')}
              >
                Cancelar
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as EstadoPedido | '')}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      {isError && <EstadoError mensaje={handleApiError(error)} />}
      {errorAccion && <EstadoError mensaje={errorAccion} />}
      {isLoading && <Skeleton className="h-64" />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No hay pedidos para mostrar." />}
      {data && data.items.length > 0 && <Tabla datos={data.items} columnas={columnas} />}

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
