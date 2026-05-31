import { create } from "zustand"
import { persist } from "zustand/middleware"

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type Rol =
  | "administrador"
  | "responsable_almacen"
  | "solicitador"
  | "aprobador"
  | "auditor"

export interface AuthUsuario {
  id: number
  nombre: string
  usuario: string
  rol: Rol
  unidad: {
    id: number
    nombre: string
    sigla: string
  } | null
}

interface AuthState {
  token: string | null
  user: AuthUsuario | null
  isAuthenticated: boolean

  // Acciones
  login: (token: string, user: AuthUsuario) => void
  logout: () => void
  setUser: (user: AuthUsuario) => void
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => set({ token, user, isAuthenticated: true }),

      logout: () => set({ token: null, user: null, isAuthenticated: false }),

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage", // clave en localStorage
      // Solo persiste token y user, no las funciones
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// ── Selectores ────────────────────────────────────────────────────────────────
// Evitan re-renders innecesarios al suscribirse solo al campo que necesitas

export const useToken = () => useAuthStore((s) => s.token)
export const useUser = () => useAuthStore((s) => s.user)
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useUserRol = () => useAuthStore((s) => s.user?.rol)
