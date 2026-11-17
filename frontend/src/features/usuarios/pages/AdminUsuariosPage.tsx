import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useActivarUsuario, useDesactivarUsuario, useUsuarios } from '../hooks/useUsuarios'
import type { Usuario } from '../types/usuario'
import { useAuthStore } from '../../../store/authStore'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Button } from '../../../shared/ui/Button'
import { Tabla } from '../../../shared/components/Tabla'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { EstadoError } from '../../../shared/components/EstadoError'

export function AdminUsuariosPage() {
  const usuarioActual = useAuthStore((s) => s.usuario)
  const { data, isLoading, isError, error } = useUsuarios()
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()
  const [errorAccion, setErrorAccion] = useState('')

  const cambiarEstado = async (usuario: Usuario) => {
    setErrorAccion('')
    try {
      if (usuario.disabled) {
        await activar.mutateAsync(usuario.id)
      } else {
        await desactivar.mutateAsync(usuario.id)
      }
    } catch (e) {
      setErrorAccion(handleApiError(e))
    }
  }

  const columnas: ColumnDef<Usuario>[] = [
    { accessorKey: 'username', header: 'Usuario' },
    { accessorKey: 'full_name', header: 'Nombre' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Rol' },
    {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) =>
        row.original.disabled ? (
          <span className="text-red-600">Desactivado</span>
        ) : (
          <span className="text-green-600">Activo</span>
        ),
    },
    {
      id: 'acciones',
      header: '',
      cell: ({ row }) => {
        const usuario = row.original
        // El admin no puede desactivarse a sí mismo
        if (usuario.id === usuarioActual?.id) return null
        return (
          <Button
            variante={usuario.disabled ? 'primario' : 'peligro'}
            disabled={activar.isPending || desactivar.isPending}
            onClick={() => cambiarEstado(usuario)}
          >
            {usuario.disabled ? 'Activar' : 'Desactivar'}
          </Button>
        )
      },
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

      {isError && <EstadoError mensaje={handleApiError(error)} />}
      {errorAccion && <EstadoError mensaje={errorAccion} />}
      {isLoading && <Skeleton className="h-64" />}
      {data && data.length === 0 && <EstadoVacio mensaje="No hay usuarios." />}
      {data && data.length > 0 && <Tabla datos={data} columnas={columnas} />}
    </div>
  )
}
