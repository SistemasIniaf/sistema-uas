import { createBrowserRouter } from "react-router-dom"

import { AuthRoute } from "./AuthRoute"
import { ProtectedRoute } from "./ProtectedRoute"
import { RoleRoute } from "./RoleRoute"

import { LoginPage } from "@/modules/auth/pages/LoginPage"
import { DashboardLayout } from "@/modules/dashboard/layouts/DashboardLayout"
import { DashboardHomePage } from "@/modules/dashboard/pages/DashboardHomePage"
import { UsuariosPage } from "@/modules/usuarios/pages/UsuariosPage"
import UnidadesPage from "@/modules/unidades/pages/UnidadesPage"
import { UnauthorizedPage } from "@/modules/common/pages/UnauthorizedPage"

export const router = createBrowserRouter([
  // ── Rutas públicas ────────────────────────────────────────────────────────
  {
    element: <AuthRoute />,
    children: [
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
    ],
  },

  // ── Página de acceso denegado (autenticado pero sin permiso) ──────────────
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // ── Rutas privadas ────────────────────────────────────────────────────────
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

          // Solo administrador puede acceder a estas secciones
          {
            element: <RoleRoute allowed={["administrador"]} />,
            children: [
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
    ],
  },
])
