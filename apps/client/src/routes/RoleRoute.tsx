import { Navigate, Outlet } from "react-router-dom"
import { useIsAuthenticated, useUserRol } from "@/store/auth.store"
import type { Rol } from "@/store/auth.store"

interface RoleRouteProps {
  allowed: Rol[]
}

/**
 * Protege rutas por rol.
 * - Sin sesión          → /auth/login
 * - Sesión pero sin rol → /unauthorized
 */
export function RoleRoute({ allowed }: RoleRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const rol = useUserRol()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (!rol || !allowed.includes(rol)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
