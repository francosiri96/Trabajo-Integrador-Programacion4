import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../../store/cartStore'
import { useCrearPedido } from '../hooks/usePedidos'
import { CheckoutForm } from '../components/CheckoutForm'
import type { DatosCheckout } from '../components/CheckoutForm'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Card } from '../../../shared/ui/Card'
import { EstadoError } from '../../../shared/components/EstadoError'
import { formatearPrecio } from '../../../shared/utils/formato'

export function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const vaciar = useCartStore((s) => s.vaciar)
  const crearPedido = useCrearPedido()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  if (items.length === 0) {
    return <Navigate to="/carrito" replace />
  }

  const confirmar = async (datos: DatosCheckout) => {
    setError('')
    try {
      await crearPedido.mutateAsync({
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        forma_pago: datos.forma_pago,
        direccion_entrega: datos.direccion_entrega.trim(),
        notas: datos.notas.trim() || null,
      })
      vaciar()
      navigate('/mis-pedidos')
    } catch (e) {
      setError(handleApiError(e))
    }
  }

  return (
    <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
      <Card>
        <h1 className="text-xl font-bold mb-4">Datos de entrega</h1>
        {error && <EstadoError mensaje={error} />}
        <CheckoutForm onConfirmar={confirmar} />
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-4">Tu pedido</h2>
        <ul className="divide-y text-sm">
          {items.map((item) => (
            <li key={item.producto_id} className="py-2 flex justify-between">
              <span>
                {item.cantidad} x {item.nombre}
              </span>
              <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="text-right text-lg mt-4">
          Total: <strong>{formatearPrecio(total())}</strong>
        </p>
      </Card>
    </div>
  )
}
