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

import { UnidadActions } from "./UnidadActions"
import { useUnidades } from "../hooks/useUnidades"
import type { Unidad } from "../types/unidad.types"

// ── Columnas ──────────────────────────────────────────────────────────────────

const columns: ColumnDef<Unidad>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nombre")}</span>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => {
      const desc = row.getValue("descripcion") as string | null
      return desc ? (
        <span className="max-w-xs truncate text-sm text-muted-foreground">
          {desc}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground/50">—</span>
      )
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
          Activa
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-muted-foreground/30 bg-muted/30 text-muted-foreground"
        >
          Inactiva
        </Badge>
      ),
  },
  {
    id: "_count.usuarios",
    header: "Usuarios",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count.usuarios}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <UnidadActions unidad={row.original} />,
  },
]

// ── Componente principal ──────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export function UnidadesTable() {
  // ── Estado local ──────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("")
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
  const { data, isLoading, isFetching } = useUnidades({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Buscador */}
        <div className="relative max-w-sm min-w-48 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o descripción..."
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
            <SelectItem value="activos">Solo activas</SelectItem>
            <SelectItem value="inactivos">Solo inactivas</SelectItem>
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
                  {search || soloActivos !== undefined
                    ? "No se encontraron resultados para los filtros aplicados."
                    : "No hay unidades registradas."}
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
                )} de ${meta.total} unidade${meta.total !== 1 ? "s" : ""}`}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Por página</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) => {
                setPagination({ pageIndex: 0, pageSize: Number(val) })
              }}
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
