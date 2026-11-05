import { useEffect } from 'react'
import { AppRouter } from './routes/AppRouter'
import { useAuthStore } from './store/authStore'

function App() {
  const checkSession = useAuthStore((s) => s.checkSession)

  // Al abrir la app se confirma con el backend si la cookie sigue siendo válida
  useEffect(() => {
    checkSession()
  }, [checkSession])

  return <AppRouter />
}

export default App
