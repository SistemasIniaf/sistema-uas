import { Navigate, Outlet } from "react-router-dom"
import { useIsAuthenticated } from "@/store/auth.store"

/**
 * Solo accesible si NO hay sesión activa.
 * Si el usuario ya está autenticado lo redirige al dashboard.
 */
export function AuthRoute() {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
