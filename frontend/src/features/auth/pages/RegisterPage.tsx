import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { registrar } from '../api/auth'
import { useAuthStore } from '../../../store/authStore'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Input } from '../../../shared/ui/Input'
import { EstadoError } from '../../../shared/components/EstadoError'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: { username: '', full_name: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      setError('')
      try {
        await registrar(value)
        // Después de registrarse queda logueado directamente
        await login(value.username, value.password)
        navigate('/')
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  return (
    <div className="max-w-sm mx-auto mt-8">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
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
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 3 ? 'El usuario debe tener al menos 3 caracteres' : undefined,
            }}
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
            name="full_name"
            validators={{ onChange: ({ value }) => (value.trim() ? undefined : 'Ingresá tu nombre') }}
          >
            {(field) => (
              <Input
                id="full_name"
                label="Nombre completo"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: ({ value }) => (EMAIL_REGEX.test(value) ? undefined : 'Email inválido') }}
          >
            {(field) => (
              <Input
                id="email"
                type="email"
                label="Email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : undefined,
            }}
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
                {enviando ? 'Creando cuenta...' : 'Registrarme'}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-orange-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </Card>
    </div>
  )
}
