import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import type { Categoria } from '../../categorias/types/categoria'
import type { ProductoForm as DatosProducto } from '../types/producto'

interface ProductoFormProps {
  valoresIniciales: DatosProducto
  categorias: Categoria[]
  onGuardar: (datos: DatosProducto) => Promise<void>
}

export function ProductoForm({ valoresIniciales, categorias, onGuardar }: ProductoFormProps) {
  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: async ({ value }) => {
      await onGuardar(value)
    },
  })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) => (value.trim() === '' ? 'El nombre es obligatorio' : undefined),
        }}
      >
        {(field) => (
          <Input
            id="nombre"
            label="Nombre"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]}
          />
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <Input
            id="descripcion"
            label="Descripción"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <form.Field
        name="categoria_id"
        validators={{
          onChange: ({ value }) => (value === 0 ? 'Elegí una categoría' : undefined),
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="categoria_id" className="text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="categoria_id"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value={0}>Seleccionar...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {field.state.meta.errors[0] && (
              <span className="text-xs text-red-600">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="precio_base"
          validators={{
            onChange: ({ value }) => (value < 0 ? 'El precio no puede ser negativo' : undefined),
          }}
        >
          {(field) => (
            <Input
              id="precio_base"
              label="Precio"
              type="number"
              min={0}
              step="0.01"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              error={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <form.Field
          name="stock"
          validators={{
            onChange: ({ value }) => (value < 0 ? 'El stock no puede ser negativo' : undefined),
          }}
        >
          {(field) => (
            <Input
              id="stock"
              label="Stock"
              type="number"
              min={0}
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              error={field.state.meta.errors[0]}
            />
          )}
        </form.Field>
      </div>

      <form.Field name="imagen_url">
        {(field) => (
          <Input
            id="imagen_url"
            label="URL de la imagen"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
            />
            Disponible para la venta
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(enviando) => (
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
