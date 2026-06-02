import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { usuarioService } from "../services/usuario.service"
import type { UsuariosQueryParams, Rol } from "../types/usuario.types"

// ── Query keys ────────────────────────────────────────────────────────────────

export const usuariosKeys = {
  all: ["usuarios"] as const,
  lists: () => [...usuariosKeys.all, "list"] as const,
  list: (params: UsuariosQueryParams) =>
    [...usuariosKeys.lists(), params] as const,
  allNoPaginated: (activo?: boolean, rol?: Rol) =>
    [...usuariosKeys.all, "all", { activo, rol }] as const,
  detail: (id: number) => [...usuariosKeys.all, id] as const,
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Lista paginada con filtros.
 * Usa `keepPreviousData` para evitar el parpadeo al cambiar de página.
 */
export function useUsuarios(params: UsuariosQueryParams) {
  return useQuery({
    queryKey: usuariosKeys.list(params),
    queryFn: () => usuarioService.findAll(params),
    placeholderData: keepPreviousData,
  })
}

/**
 * Lista completa sin paginar — para selects y dropdowns.
 * Por defecto solo trae los activos.
 * Se puede filtrar por rol (ej: solo aprobadores).
 */
export function useUsuariosAll(activo = true, rol?: Rol) {
  return useQuery({
    queryKey: usuariosKeys.allNoPaginated(activo, rol),
    queryFn: () => usuarioService.findAllNoPaginated(activo, rol),
    staleTime: 1000 * 60 * 10,
  })
}

/** Detalle de un usuario específico. */
export function useUsuario(id: number) {
  return useQuery({
    queryKey: usuariosKeys.detail(id),
    queryFn: () => usuarioService.findOne(id),
    enabled: id > 0,
  })
}
