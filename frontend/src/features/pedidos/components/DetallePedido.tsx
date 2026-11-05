import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import type { Pedido } from '../types/pedido'

interface DetallePedidoProps {
  pedido: Pedido
}

export function DetallePedido({ pedido }: DetallePedidoProps) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">{formatearFecha(pedido.created_at)}</span>
        <BadgeEstado estado={pedido.estado} />
      </div>
      <p>
        <span className="text-gray-500">Dirección:</span> {pedido.direccion_entrega}
      </p>
      <p>
        <span className="text-gray-500">Forma de pago:</span>{' '}
        {pedido.forma_pago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}
      </p>
      {pedido.notas && (
        <p>
          <span className="text-gray-500">Notas:</span> {pedido.notas}
        </p>
      )}

      <table className="w-full mt-2">
        <thead className="text-left text-gray-500 border-b">
          <tr>
            <th className="py-1">Producto</th>
            <th className="py-1 text-right">Precio</th>
            <th className="py-1 text-right">Cant.</th>
            <th className="py-1 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((item) => (
            <tr key={item.producto_id} className="border-b">
              <td className="py-1">{item.nombre_producto}</td>
              <td className="py-1 text-right">{formatearPrecio(item.precio_unitario)}</td>
              <td className="py-1 text-right">{item.cantidad}</td>
              <td className="py-1 text-right">{formatearPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-right text-base">
        Total: <strong>{formatearPrecio(pedido.total)}</strong>
      </p>
    </div>
  )
}
