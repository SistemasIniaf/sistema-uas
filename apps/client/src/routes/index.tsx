import { createBrowserRouter } from "react-router-dom"

import { AuthRoute } from "./AuthRoute"
import { ProtectedRoute } from "./ProtectedRoute"
import { RoleRoute } from "./RoleRoute"

import { LoginPage } from "@/modules/auth/pages/LoginPage"
import { DashboardLayout } from "@/modules/dashboard/layouts/DashboardLayout"
import { DashboardHomePage } from "@/modules/dashboard/pages/DashboardHomePage"
import { UsuariosPage } from "@/modules/usuarios/pages/UsuariosPage"
import UnidadesPage from "@/modules/unidades/pages/UnidadesPage"
import GestionSemillaPage from "@/modules/gestion-semilla/pages/GestionSemillaPage"
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

  // ── Página de acceso denegado ─────────────────────────────────────────────
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

          // Solo administrador
          {
            element: <RoleRoute allowed={["administrador"]} />,
            children: [
              { path: "usuarios", element: <UsuariosPage /> },
              { path: "unidades", element: <UnidadesPage /> },
            ],
          },

          // Todos los roles autenticados
          {
            element: (
              <RoleRoute
                allowed={[
                  "administrador",
                  "responsable",
                  "operador",
                  "auditor",
                ]}
              />
            ),
            children: [
              { path: "gestion-semilla", element: <GestionSemillaPage /> },
            ],
          },
        ],
      },
    ],
  },
])
