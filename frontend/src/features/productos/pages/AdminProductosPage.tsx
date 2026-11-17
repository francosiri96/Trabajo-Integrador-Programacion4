import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  useActualizarProducto,
  useActualizarStock,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from '../hooks/useProductos'
import { ProductoForm } from '../components/ProductoForm'
import { StockForm } from '../components/StockForm'
import type { Producto, ProductoForm as DatosProducto, ProductoStockUpdate } from '../types/producto'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { Tabla } from '../../../shared/components/Tabla'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { EstadoError } from '../../../shared/components/EstadoError'
import { formatearPrecio } from '../../../shared/utils/formato'

const PRODUCTO_VACIO: DatosProducto = {
  nombre: '',
  descripcion: '',
  precio_base: 0,
  imagen_url: '',
  stock: 0,
  disponible: true,
  categoria_id: 0,
}

export function AdminProductosPage() {
  // El panel trae hasta 100 productos y pagina en el cliente
  const { data, isLoading, isError, error } = useProductos({ skip: 0, limit: 100 })
  const { data: categorias } = useCategorias()
  const crear = useCrearProducto()
  const actualizar = useActualizarProducto()
  const actualizarStock = useActualizarStock()
  const eliminar = useEliminarProducto()

  const [modalProducto, setModalProducto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [productoStock, setProductoStock] = useState<Producto | null>(null)
  const [errorForm, setErrorForm] = useState('')
  const [errorAccion, setErrorAccion] = useState('')

  const abrirNuevo = () => {
    setEditando(null)
    setErrorForm('')
    setModalProducto(true)
  }

  const abrirEditar = (producto: Producto) => {
    setEditando(producto)
    setErrorForm('')
    setModalProducto(true)
  }

  const abrirStock = (producto: Producto) => {
    setProductoStock(producto)
    setErrorForm('')
  }

  const guardarProducto = async (datos: DatosProducto) => {
    setErrorForm('')
    try {
      if (editando) {
        await actualizar.mutateAsync({ id: editando.id, data: datos })
      } else {
        await crear.mutateAsync(datos)
      }
      setModalProducto(false)
    } catch (e) {
      setErrorForm(handleApiError(e))
    }
  }

  const guardarStock = async (datos: ProductoStockUpdate) => {
    if (!productoStock) return
    setErrorForm('')
    try {
      await actualizarStock.mutateAsync({ id: productoStock.id, data: datos })
      setProductoStock(null)
    } catch (e) {
      setErrorForm(handleApiError(e))
    }
  }

  const darDeBaja = async (producto: Producto) => {
    if (!window.confirm(`¿Dar de baja el producto "${producto.nombre}"?`)) return
    setErrorAccion('')
    try {
      await eliminar.mutateAsync(producto.id)
    } catch (e) {
      setErrorAccion(handleApiError(e))
    }
  }

  const columnas: ColumnDef<Producto>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      id: 'categoria',
      header: 'Categoría',
      cell: ({ row }) => row.original.categoria.nombre,
    },
    {
      id: 'precio',
      header: 'Precio',
      cell: ({ row }) => formatearPrecio(row.original.precio_base),
    },
    { accessorKey: 'stock', header: 'Stock' },
    {
      id: 'disponible',
      header: 'Disponible',
      cell: ({ row }) => (row.original.disponible ? 'Sí' : 'No'),
    },
    {
      id: 'acciones',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button variante="secundario" onClick={() => abrirStock(row.original)}>
            Stock
          </Button>
          <Button variante="secundario" onClick={() => abrirEditar(row.original)}>
            Editar
          </Button>
          <Button variante="peligro" disabled={eliminar.isPending} onClick={() => darDeBaja(row.original)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={abrirNuevo}>Nuevo producto</Button>
      </div>

      {isError && <EstadoError mensaje={handleApiError(error)} />}
      {errorAccion && <EstadoError mensaje={errorAccion} />}
      {isLoading && <Skeleton className="h-64" />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No hay productos cargados." />}
      {data && data.items.length > 0 && <Tabla datos={data.items} columnas={columnas} />}

      <Modal
        titulo={editando ? 'Editar producto' : 'Nuevo producto'}
        abierto={modalProducto}
        onCerrar={() => setModalProducto(false)}
      >
        {errorForm && <EstadoError mensaje={errorForm} />}
        <ProductoForm
          key={editando?.id ?? 'nuevo'}
          categorias={categorias ?? []}
          valoresIniciales={
            editando
              ? {
                  nombre: editando.nombre,
                  descripcion: editando.descripcion ?? '',
                  precio_base: editando.precio_base,
                  imagen_url: editando.imagen_url ?? '',
                  stock: editando.stock,
                  disponible: editando.disponible,
                  categoria_id: editando.categoria_id,
                }
              : PRODUCTO_VACIO
          }
          onGuardar={guardarProducto}
        />
      </Modal>

      <Modal
        titulo={`Stock de ${productoStock?.nombre ?? ''}`}
        abierto={productoStock !== null}
        onCerrar={() => setProductoStock(null)}
      >
        {errorForm && <EstadoError mensaje={errorForm} />}
        {productoStock && (
          <StockForm
            key={productoStock.id}
            valoresIniciales={{ stock: productoStock.stock, disponible: productoStock.disponible }}
            onGuardar={guardarStock}
          />
        )}
      </Modal>
    </div>
  )
}
