// ── Enums ─────────────────────────────────────────────────────────────────────

export const ROL_ENUM = [
  "administrador",
  "responsable_almacen",
  "solicitador",
  "aprobador",
  "auditor",
] as const

export type Rol = (typeof ROL_ENUM)[number]

export const ROL_LABELS: Record<Rol, string> = {
  administrador: "Administrador",
  responsable_almacen: "Responsable de Almacén",
  solicitador: "Solicitador",
  aprobador: "Aprobador",
  auditor: "Auditor",
}

// ── Entidad ───────────────────────────────────────────────────────────────────

export interface UnidadResumen {
  id: number
  nombre: string
  sigla: string
}

export interface Usuario {
  id: number
  nombre: string
  usuario: string
  rol: Rol
  activo: boolean
  unidadId: number | null
  createdAt: string
  updatedAt: string
  unidad: UnidadResumen | null
}

// ── Paginación ────────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    lastPage: number
  }
}

// ── Query params ──────────────────────────────────────────────────────────────

export interface UsuariosQueryParams {
  page?: number
  limit?: number
  search?: string
  rol?: Rol
  soloActivos?: boolean
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateUsuarioPayload {
  nombre: string
  usuario: string
  password: string
  rol: Rol
  unidadId?: number
  activo?: boolean
}

export type UpdateUsuarioPayload = Partial<
  Omit<CreateUsuarioPayload, "password">
> & {
  password?: string
}
