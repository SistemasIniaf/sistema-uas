// ── Entidad ───────────────────────────────────────────────────────────────────

export interface Unidad {
  id: number
  nombre: string
  sigla: string
  activo: boolean
  _count: { usuarios: number }
}

export interface UnidadDetalle extends Omit<Unidad, "_count"> {
  usuarios: {
    id: number
    nombre: string
    usuario: string
    rol: string
    activo: boolean
  }[]
  createdAt: string
  updatedAt: string
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

export interface UnidadesQueryParams {
  page?: number
  limit?: number
  search?: string
  soloActivos?: boolean
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateUnidadPayload {
  nombre: string
  sigla: string
  activo?: boolean
}

export type UpdateUnidadPayload = Partial<CreateUnidadPayload>
