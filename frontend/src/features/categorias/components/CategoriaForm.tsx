import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import type { CategoriaForm as DatosCategoria } from '../types/categoria'

interface CategoriaFormProps {
  valoresIniciales: DatosCategoria
  onGuardar: (datos: DatosCategoria) => Promise<void>
}

export function CategoriaForm({ valoresIniciales, onGuardar }: CategoriaFormProps) {
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
          onChange: ({ value }) => {
            const largo = value.trim().length
            if (largo < 2) return 'El nombre debe tener al menos 2 caracteres'
            if (largo > 100) return 'El nombre no puede superar los 100 caracteres'
            return undefined
          },
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
