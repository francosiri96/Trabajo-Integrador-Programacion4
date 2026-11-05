import { useCartStore } from '../../../store/cartStore'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formato'
import type { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const agregar = useCartStore((s) => s.agregar)
  const sePuedeComprar = producto.disponible && producto.stock > 0

  const agregarAlCarrito = () => {
    agregar({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_unitario: producto.precio_base,
    })
  }

  return (
    <Card className="flex flex-col">
      {producto.imagen_url && (
        <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-40 object-cover rounded-md mb-3" />
      )}
      <span className="text-xs text-gray-500">{producto.categoria.nombre}</span>
      <h3 className="font-semibold">{producto.nombre}</h3>
      {producto.descripcion && <p className="text-sm text-gray-600 mt-1">{producto.descripcion}</p>}

      <div className="mt-auto pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold">{formatearPrecio(producto.precio_base)}</span>
          <span className="text-xs text-gray-500">Stock: {producto.stock}</span>
        </div>
        <Button className="w-full" disabled={!sePuedeComprar} onClick={agregarAlCarrito}>
          {sePuedeComprar ? 'Agregar al carrito' : 'No disponible'}
        </Button>
      </div>
    </Card>
  )
}
