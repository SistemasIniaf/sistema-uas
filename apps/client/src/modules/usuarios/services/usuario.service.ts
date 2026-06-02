import { api } from "@/lib/axios"
import type {
  Usuario,
  UsuariosQueryParams,
  PaginatedResult,
  CreateUsuarioPayload,
  UpdateUsuarioPayload,
  Rol,
} from "../types/usuario.types"

export const usuarioService = {
  /**
   * Lista paginada con filtros — para DataTable.
   * GET /usuarios?page=1&limit=10&search=...&rol=auditor&activo=true
   */
  findAll: async (
    params: UsuariosQueryParams
  ): Promise<PaginatedResult<Usuario>> => {
    const { data } = await api.get<PaginatedResult<Usuario>>("/usuarios", {
      params,
    })
    return data
  },

  /**
   * Lista completa sin paginar — para <Select> y <Combobox>.
   * GET /usuarios/all?activo=true&rol=aprobador
   */
  findAllNoPaginated: async (activo = true, rol?: Rol): Promise<Usuario[]> => {
    const { data } = await api.get<Usuario[]>("/usuarios/all", {
      params: { activo, rol },
    })
    return data
  },

  findOne: async (id: number): Promise<Usuario> => {
    const { data } = await api.get<Usuario>(`/usuarios/${id}`)
    return data
  },

  create: async (payload: CreateUsuarioPayload): Promise<Usuario> => {
    const { data } = await api.post<Usuario>("/usuarios", payload)
    return data
  },

  update: async (
    id: number,
    payload: UpdateUsuarioPayload
  ): Promise<Usuario> => {
    const { data } = await api.patch<Usuario>(`/usuarios/${id}`, payload)
    return data
  },

  toggleActivo: async (
    id: number
  ): Promise<Pick<Usuario, "id" | "nombre" | "usuario" | "activo">> => {
    const { data } = await api.patch(`/usuarios/${id}/toggle`)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`)
  },
}
