import { useState, useCallback } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table"
import { SearchIcon, XIcon } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { UsuarioActions } from "./UsuarioActions"
import { useUsuarios } from "../hooks/useUsuarios"
import { ROL_ENUM, ROL_LABELS } from "../types/usuario.types"
import type { Usuario, Rol } from "../types/usuario.types"

// ── Helpers de estilo por rol ─────────────────────────────────────────────────

const ROL_BADGE_CLASS: Record<Rol, string> = {
  administrador:
    "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  responsable:
    "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  operador:
    "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
  auditor:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
}

// ── Columnas ──────────────────────────────────────────────────────────────────

const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nombre")}</span>
    ),
  },
  {
    accessorKey: "usuario",
    header: "Usuario",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.getValue("usuario")}
      </span>
    ),
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => {
      const rol = row.getValue("rol") as Rol
      return (
        <Badge variant="outline" className={ROL_BADGE_CLASS[rol]}>
          {ROL_LABELS[rol]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "unidad",
    header: "Unidad",
    cell: ({ row }) => {
      const unidad = row.original.unidad
      if (!unidad) {
        return <span className="text-xs text-muted-foreground">—</span>
      }
      return <span className="text-sm">{unidad.nombre}</span>
    },
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) =>
      row.getValue("activo") ? (
        <Badge
          variant="outline"
          className="border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
        >
          Activo
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-muted-foreground/30 bg-muted/30 text-muted-foreground"
        >
          Inactivo
        </Badge>
      ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <UsuarioActions usuario={row.original} />,
  },
]

// ── Opciones de rol para el filtro ────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

// ── Componente principal ──────────────────────────────────────────────────────

export function UsuariosTable() {
  // ── Estado local ──────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("")
  const [rolFiltro, setRolFiltro] = useState<Rol | undefined>(undefined)
  const [soloActivos, setSoloActivos] = useState<boolean | undefined>(undefined)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const search = useDebounce(searchInput, 400)

  const resetPage = useCallback(
    () => setPagination((p) => ({ ...p, pageIndex: 0 })),
    []
  )

  // ── Query ─────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useUsuarios({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    rol: rolFiltro,
    soloActivos,
  })

  // ── Tabla ─────────────────────────────────────────────────────────────────
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta.lastPage ?? -1,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
  })

  const meta = data?.meta
  const isEmpty = !isLoading && table.getRowModel().rows.length === 0
  const currentPage = pagination.pageIndex + 1
  const lastPage = meta?.lastPage ?? 1

  function getPageNumbers(): (number | "ellipsis")[] {
    if (lastPage <= 5) {
      return Array.from({ length: lastPage }, (_, i) => i + 1)
    }
    const pages: (number | "ellipsis")[] = [1]
    if (currentPage > 3) pages.push("ellipsis")
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(lastPage - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < lastPage - 2) pages.push("ellipsis")
    pages.push(lastPage)
    return pages
  }

  const hayFiltrosActivos =
    !!search || rolFiltro !== undefined || soloActivos !== undefined

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Buscador */}
        <div className="relative max-w-sm min-w-48 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o usuario..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              resetPage()
            }}
            className="pr-8 pl-8"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("")
                resetPage()
              }}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {/* Filtro por rol */}
        <Select
          value={rolFiltro ?? "todos"}
          onValueChange={(val) => {
            setRolFiltro(val === "todos" ? undefined : (val as Rol))
            resetPage()
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos los roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            {ROL_ENUM.map((rol) => (
              <SelectItem key={rol} value={rol}>
                {ROL_LABELS[rol]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro de estado */}
        <Select
          value={
            soloActivos === undefined
              ? "todos"
              : soloActivos
                ? "activos"
                : "inactivos"
          }
          onValueChange={(val) => {
            setSoloActivos(val === "todos" ? undefined : val === "activos")
            resetPage()
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="activos">Solo activos</SelectItem>
            <SelectItem value="inactivos">Solo inactivos</SelectItem>
          </SelectContent>
        </Select>

        {isFetching && !isLoading && (
          <span className="ml-auto animate-pulse text-xs text-muted-foreground">
            Actualizando...
          </span>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isEmpty ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {hayFiltrosActivos
                    ? "No se encontraron resultados para los filtros aplicados."
                    : "No hay usuarios registrados."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={!row.original.activo ? "opacity-60" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      {meta && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="shrink-0 text-sm text-muted-foreground">
            {meta.total === 0
              ? "Sin resultados"
              : `${(currentPage - 1) * pagination.pageSize + 1}–${Math.min(
                  currentPage * pagination.pageSize,
                  meta.total
                )} de ${meta.total} usuario${meta.total !== 1 ? "s" : ""}`}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Por página</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) =>
                setPagination({ pageIndex: 0, pageSize: Number(val) })
              }
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {lastPage > 1 && (
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        pageIndex: Math.max(0, p.pageIndex - 1),
                      }))
                    }
                    aria-disabled={!table.getCanPreviousPage()}
                    className={
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, idx) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() =>
                          setPagination((p) => ({
                            ...p,
                            pageIndex: (page as number) - 1,
                          }))
                        }
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        pageIndex: Math.min(lastPage - 1, p.pageIndex + 1),
                      }))
                    }
                    aria-disabled={!table.getCanNextPage()}
                    className={
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  )
}
