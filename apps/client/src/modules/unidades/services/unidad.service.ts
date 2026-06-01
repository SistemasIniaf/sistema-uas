import { api } from "@/lib/axios"
import type {
  Unidad,
  UnidadDetalle,
  UnidadesQueryParams,
  PaginatedResult,
  CreateUnidadPayload,
  UpdateUnidadPayload,
} from "../types/unidad.types"

export const unidadService = {
  /**
   * Lista paginada con filtros — para DataTable.
   * GET /unidades?page=1&limit=10&search=...&soloActivos=true
   */
  findAll: async (
    params: UnidadesQueryParams
  ): Promise<PaginatedResult<Unidad>> => {
    const { data } = await api.get<PaginatedResult<Unidad>>("/unidades", {
      params,
    })
    return data
  },

  /**
   * Lista completa sin paginar — para <Select> y <Combobox>.
   * GET /unidades/all?soloActivos=true
   */
  findAllNoPaginated: async (soloActivos = true): Promise<Unidad[]> => {
    const { data } = await api.get<Unidad[]>("/unidades/all", {
      params: { soloActivos },
    })
    return data
  },

  /** Detalle de una unidad con sus usuarios. */
  findOne: async (id: number): Promise<UnidadDetalle> => {
    const { data } = await api.get<UnidadDetalle>(`/unidades/${id}`)
    return data
  },

  create: async (payload: CreateUnidadPayload): Promise<Unidad> => {
    const { data } = await api.post<Unidad>("/unidades", payload)
    return data
  },

  update: async (id: number, payload: UpdateUnidadPayload): Promise<Unidad> => {
    const { data } = await api.patch<Unidad>(`/unidades/${id}`, payload)
    return data
  },

  toggleActivo: async (
    id: number
  ): Promise<Pick<Unidad, "id" | "nombre" | "activo">> => {
    const { data } = await api.patch(`/unidades/${id}/toggle`)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/unidades/${id}`)
  },
}
