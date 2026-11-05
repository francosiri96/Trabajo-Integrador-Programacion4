import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Input } from '../../../shared/ui/Input'
import { EstadoError } from '../../../shared/components/EstadoError'

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      setError('')
      try {
        await login(value.username, value.password)
        const usuario = useAuthStore.getState().usuario
        navigate(usuario?.role === 'admin' ? '/admin/resumen' : '/')
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  return (
    <div className="max-w-sm mx-auto mt-8">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        {error && <EstadoError mensaje={error} />}

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="username"
            validators={{ onChange: ({ value }) => (value.trim() ? undefined : 'Ingresá tu usuario') }}
          >
            {(field) => (
              <Input
                id="username"
                label="Usuario"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: ({ value }) => (value ? undefined : 'Ingresá tu contraseña') }}
          >
            {(field) => (
              <Input
                id="password"
                type="password"
                label="Contraseña"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(enviando) => (
              <Button type="submit" disabled={enviando}>
                {enviando ? 'Ingresando...' : 'Ingresar'}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-orange-600 hover:underline">
            Registrate
          </Link>
        </p>
      </Card>
    </div>
  )
}
