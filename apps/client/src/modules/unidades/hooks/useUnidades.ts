import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { unidadService } from "../services/unidad.service"
import type { UnidadesQueryParams } from "../types/unidad.types"

// ── Query keys ────────────────────────────────────────────────────────────────

export const unidadesKeys = {
  all: ["unidades"] as const,
  lists: () => [...unidadesKeys.all, "list"] as const,
  list: (params: UnidadesQueryParams) =>
    [...unidadesKeys.lists(), params] as const,
  allNoPaginated: (soloActivos?: boolean) =>
    [...unidadesKeys.all, "all", { soloActivos }] as const,
  detail: (id: number) => [...unidadesKeys.all, id] as const,
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Lista paginada con filtros.
 * Usa `keepPreviousData` para evitar el parpadeo al cambiar de página.
 */
export function useUnidades(params: UnidadesQueryParams) {
  return useQuery({
    queryKey: unidadesKeys.list(params),
    queryFn: () => unidadService.findAll(params),
    placeholderData: keepPreviousData,
  })
}

/**
 * Lista completa sin paginar — para selects y dropdowns.
 * Por defecto solo trae las activas.
 */
export function useUnidadesAll(soloActivos = true) {
  return useQuery({
    queryKey: unidadesKeys.allNoPaginated(soloActivos),
    queryFn: () => unidadService.findAllNoPaginated(soloActivos),
    staleTime: 1000 * 60 * 10, // 10 min — cambia poco
  })
}

/** Detalle de una unidad con su lista de usuarios. */
export function useUnidad(id: number) {
  return useQuery({
    queryKey: unidadesKeys.detail(id),
    queryFn: () => unidadService.findOne(id),
    enabled: id > 0,
  })
}
