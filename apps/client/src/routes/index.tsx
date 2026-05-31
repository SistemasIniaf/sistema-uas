import { createBrowserRouter } from "react-router-dom"

import { AuthRoute } from "./AuthRoute"
import { ProtectedRoute } from "./ProtectedRoute"

import { LoginPage } from "@/modules/auth/pages/LoginPage"
import { DashboardLayout } from "@/modules/dashboard/layouts/DashboardLayout"
import { DashboardHomePage } from "@/modules/dashboard/pages/DashboardHomePage"
import { UsuariosPage } from "@/modules/usuarios/pages/UsuariosPage"
import UnidadesPage from "@/modules/unidades/pages/UnidadesPage"

export const router = createBrowserRouter([
  // ── Rutas públicas ───────────────────────────
  {
    element: <AuthRoute />,
    children: [
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
    ],
  },

  // ── Rutas privadas ───────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardHomePage />,
          },
          {
            path: "usuarios",
            element: <UsuariosPage />,
          },
          {
            path: "unidades",
            element: <UnidadesPage />,
          },
        ],
      },
    ],
  },
])
