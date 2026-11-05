import { useState } from 'react'
import type { FormEvent } from 'react'
import { useProductos } from '../hooks/useProductos'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { ProductoCard } from '../components/ProductoCard'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Button } from '../../../shared/ui/Button'
import { Paginacion } from '../../../shared/components/Paginacion'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { EstadoError } from '../../../shared/components/EstadoError'

const POR_PAGINA = 8

export function CatalogoPage() {
  const [pagina, setPagina] = useState(0)
  const [textoBusqueda, setTextoBusqueda] = useState('')
  const [search, setSearch] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)

  const { data, isLoading, isError, error } = useProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: search || undefined,
    categoria_id: categoriaId,
  })
  const { data: categorias } = useCategorias()

  const buscar = (e: FormEvent) => {
    e.preventDefault()
    setSearch(textoBusqueda.trim())
    setPagina(0)
  }

  const cambiarCategoria = (valor: string) => {
    setCategoriaId(valor ? Number(valor) : undefined)
    setPagina(0)
  }

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Catálogo</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={buscar} className="flex gap-2 flex-1 min-w-64">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
          />
          <Button type="submit">Buscar</Button>
        </form>

        <select
          value={categoriaId ?? ''}
          onChange={(e) => cambiarCategoria(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">Todas las categorías</option>
          {categorias?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {isError && <EstadoError mensaje={handleApiError(error)} />}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: POR_PAGINA }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      )}

      {data && data.items.length === 0 && <EstadoVacio mensaje="No se encontraron productos." />}

      {data && data.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.items.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  )
}
