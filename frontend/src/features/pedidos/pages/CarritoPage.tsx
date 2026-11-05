import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../../store/cartStore'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { formatearPrecio } from '../../../shared/utils/formato'

export function CarritoPage() {
  const items = useCartStore((s) => s.items)
  const quitar = useCartStore((s) => s.quitar)
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad)
  const vaciar = useCartStore((s) => s.vaciar)
  const total = useCartStore((s) => s.total)
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <EstadoVacio mensaje="Tu carrito está vacío.">
        <Link to="/" className="text-orange-600 hover:underline">
          Ver el catálogo
        </Link>
      </EstadoVacio>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>

      <Card>
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.producto_id} className="py-3 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-40">
                <p className="font-medium">{item.nombre}</p>
                <p className="text-sm text-gray-500">{formatearPrecio(item.precio_unitario)} c/u</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variante="secundario"
                  className="px-3"
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.cantidad}</span>
                <Button
                  variante="secundario"
                  className="px-3"
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                >
                  +
                </Button>
              </div>

              <span className="w-28 text-right font-medium">
                {formatearPrecio(item.precio_unitario * item.cantidad)}
              </span>
              <button onClick={() => quitar(item.producto_id)} className="text-sm text-red-600 hover:underline">
                Quitar
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center border-t pt-4 mt-2">
          <button onClick={vaciar} className="text-sm text-gray-500 hover:underline">
            Vaciar carrito
          </button>
          <div className="flex items-center gap-4">
            <span className="text-lg">
              Total: <strong>{formatearPrecio(total())}</strong>
            </span>
            <Button onClick={() => navigate('/checkout')}>Confirmar pedido</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
