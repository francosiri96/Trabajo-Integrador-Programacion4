import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from '../hooks/useCategorias'
import { CategoriaForm } from '../components/CategoriaForm'
import type { Categoria, CategoriaForm as DatosCategoria } from '../types/categoria'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { Tabla } from '../../../shared/components/Tabla'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { EstadoError } from '../../../shared/components/EstadoError'

export function AdminCategoriasPage() {
  const { data, isLoading, isError, error } = useCategorias()
  const crear = useCrearCategoria()
  const actualizar = useActualizarCategoria()
  const eliminar = useEliminarCategoria()

  const [modalAbierto, setModalAbierto] = useState(false)
  // null = se está creando una nueva
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [errorForm, setErrorForm] = useState('')
  const [errorAccion, setErrorAccion] = useState('')

  const abrirNueva = () => {
    setEditando(null)
    setErrorForm('')
    setModalAbierto(true)
  }

  const abrirEditar = (categoria: Categoria) => {
    setEditando(categoria)
    setErrorForm('')
    setModalAbierto(true)
  }

  const guardar = async (datos: DatosCategoria) => {
    setErrorForm('')
    try {
      if (editando) {
        await actualizar.mutateAsync({ id: editando.id, data: datos })
      } else {
        await crear.mutateAsync(datos)
      }
      setModalAbierto(false)
    } catch (e) {
      setErrorForm(handleApiError(e))
    }
  }

  const darDeBaja = async (categoria: Categoria) => {
    if (!window.confirm(`¿Dar de baja la categoría "${categoria.nombre}"?`)) return
    setErrorAccion('')
    try {
      await eliminar.mutateAsync(categoria.id)
    } catch (e) {
      setErrorAccion(handleApiError(e))
    }
  }

  const columnas: ColumnDef<Categoria>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'descripcion', header: 'Descripción' },
    {
      id: 'acciones',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
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
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={abrirNueva}>Nueva categoría</Button>
      </div>

      {isError && <EstadoError mensaje={handleApiError(error)} />}
      {errorAccion && <EstadoError mensaje={errorAccion} />}
      {isLoading && <Skeleton className="h-64" />}
      {data && data.length === 0 && <EstadoVacio mensaje="No hay categorías cargadas." />}
      {data && data.length > 0 && <Tabla datos={data} columnas={columnas} />}

      <Modal
        titulo={editando ? 'Editar categoría' : 'Nueva categoría'}
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
      >
        {errorForm && <EstadoError mensaje={errorForm} />}
        <CategoriaForm
          // key para que el formulario se reinicie al cambiar de categoría
          key={editando?.id ?? 'nueva'}
          valoresIniciales={{
            nombre: editando?.nombre ?? '',
            descripcion: editando?.descripcion ?? '',
          }}
          onGuardar={guardar}
        />
      </Modal>
    </div>
  )
}
