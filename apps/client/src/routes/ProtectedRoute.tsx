import { Navigate, Outlet } from "react-router-dom"
import { useIsAuthenticated } from "@/store/auth.store"

/**
 * Protege las rutas privadas.
 * Si no hay sesión redirige a /auth/login.
 */
export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}
