import { useResumenPedidos } from '../hooks/usePedidos'
import { TarjetaResumen } from '../components/TarjetaResumen'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EstadoError } from '../../../shared/components/EstadoError'
import { formatearPrecio } from '../../../shared/utils/formato'

export function AdminResumenPage() {
  const { data, isLoading, isError, error } = useResumenPedidos()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Resumen</h1>

      {isError && <EstadoError mensaje={handleApiError(error)} />}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TarjetaResumen titulo="Pedidos de hoy" valor={data.pedidos_hoy} />
          <TarjetaResumen titulo="Pendientes" valor={data.pendientes} color="text-yellow-600" />
          <TarjetaResumen titulo="En preparación" valor={data.en_preparacion} color="text-blue-600" />
          <TarjetaResumen titulo="Entregados" valor={data.entregados} color="text-green-600" />
          <TarjetaResumen titulo="Cancelados" valor={data.cancelados} color="text-red-600" />
          <TarjetaResumen
            titulo="Ingresos (entregados)"
            valor={formatearPrecio(data.ingresos_entregados)}
            color="text-orange-600"
          />
        </div>
      )}
    </div>
  )
}
