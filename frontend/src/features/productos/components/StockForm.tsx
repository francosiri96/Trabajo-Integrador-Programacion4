import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import type { ProductoStockUpdate } from '../types/producto'

interface StockFormProps {
  valoresIniciales: ProductoStockUpdate
  onGuardar: (datos: ProductoStockUpdate) => Promise<void>
}

export function StockForm({ valoresIniciales, onGuardar }: StockFormProps) {
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
