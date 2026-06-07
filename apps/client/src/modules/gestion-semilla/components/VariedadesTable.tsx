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

import { VariedadActions } from "./GestionSemillaActions"
import { VariedadCreateDialog } from "./VariedadDialog"
import { useVariedades } from "../hooks/useGestionSemilla"
import { useProductosAll } from "../hooks/useGestionSemilla"
import type { Variedad } from "../types/gestion-semilla.types"

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

const columns: ColumnDef<Variedad>[] = [
  {
    accessorKey: "producto",
    header: "Semilla",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.producto.nombre}</span>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Variedad",
    cell: ({ row }) => <span>{row.getValue("nombre")}</span>,
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
    id: "actions",
    header: "",
    cell: ({ row }) => <VariedadActions variedad={row.original} />,
  },
]

export function VariedadesTable() {
  const [searchInput, setSearchInput] = useState("")
  const [productoFiltro, setProductoFiltro] = useState<number | undefined>(
    undefined
  )
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const search = useDebounce(searchInput, 400)
  const resetPage = useCallback(
    () => setPagination((p) => ({ ...p, pageIndex: 0 })),
    []
  )

  const { data: productos = [] } = useProductosAll(false)

  const { data, isLoading, isFetching } = useVariedades({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    productoId: productoFiltro,
  })

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
    if (lastPage <= 5) return Array.from({ length: lastPage }, (_, i) => i + 1)
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

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-40 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar variedades..."
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

        <Select
          value={productoFiltro ? String(productoFiltro) : "todos"}
          onValueChange={(val) => {
            setProductoFiltro(val === "todos" ? undefined : Number(val))
            resetPage()
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todas las semillas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las semillas</SelectItem>
            {productos.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <VariedadCreateDialog />

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
                  className="h-20 text-center text-muted-foreground"
                >
                  {search || productoFiltro
                    ? "No se encontraron resultados."
                    : "No hay variedades registradas."}
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              {meta.total === 0
                ? "Sin resultados"
                : `${(currentPage - 1) * pagination.pageSize + 1}–${Math.min(currentPage * pagination.pageSize, meta.total)} de ${meta.total}`}
            </p>

            <div className="flex items-center gap-2">
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
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">por página</span>
            </div>
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
                    <PaginationItem key={`e-${idx}`}>
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
