import { useState } from "react"
import {
  MoreHorizontalIcon,
  PencilIcon,
  PowerIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { ProductoEditDialog } from "./ProductoDialog"
import { VariedadEditDialog } from "./VariedadDialog"
import { CategoriaEditDialog } from "./CategoriaDialog"
import {
  useToggleProducto,
  useDeleteProducto,
  useToggleVariedad,
  useDeleteVariedad,
  useToggleCategoria,
  useDeleteCategoria,
} from "../hooks/useGestionSemillaMutations"
import type {
  Producto,
  Variedad,
  Categoria,
} from "../types/gestion-semilla.types"

// ── Shared confirm dialog ─────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  confirmLabel: string
  confirmVariant?: "destructive" | "default"
  isPending: boolean
  onConfirm: () => void
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmVariant = "destructive",
  isPending,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Procesando..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Producto Actions ──────────────────────────────────────────────────────────

export function ProductoActions({ producto }: { producto: Producto }) {
  const [editOpen, setEditOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: toggle, isPending: isToggling } = useToggleProducto()
  const { mutate: remove, isPending: isDeleting } = useDeleteProducto()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setToggleOpen(true)}>
            <PowerIcon /> {producto.activo ? "Desactivar" : "Activar"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={producto._count.variedades > 0}
          >
            <Trash2Icon /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductoEditDialog
        producto={producto}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={toggleOpen}
        onOpenChange={setToggleOpen}
        title={producto.activo ? "Desactivar semilla" : "Activar semilla"}
        description={
          producto.activo ? (
            <>
              ¿Desactivar{" "}
              <span className="font-medium text-foreground">
                {producto.nombre}
              </span>
              ? No se podrán crear nuevas variedades.
            </>
          ) : (
            <>
              ¿Activar{" "}
              <span className="font-medium text-foreground">
                {producto.nombre}
              </span>
              ? Volverá a estar disponible.
            </>
          )
        }
        confirmLabel={producto.activo ? "Sí, desactivar" : "Sí, activar"}
        confirmVariant={producto.activo ? "destructive" : "default"}
        isPending={isToggling}
        onConfirm={() =>
          toggle(producto.id, { onSuccess: () => setToggleOpen(false) })
        }
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar semilla"
        description={
          <>
            ¿Eliminar{" "}
            <span className="font-medium text-foreground">
              {producto.nombre}
            </span>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        isPending={isDeleting}
        onConfirm={() =>
          remove(producto.id, { onSuccess: () => setDeleteOpen(false) })
        }
      />
    </>
  )
}

// ── Variedad Actions ──────────────────────────────────────────────────────────

export function VariedadActions({ variedad }: { variedad: Variedad }) {
  const [editOpen, setEditOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: toggle, isPending: isToggling } = useToggleVariedad()
  const { mutate: remove, isPending: isDeleting } = useDeleteVariedad()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setToggleOpen(true)}>
            <PowerIcon /> {variedad.activo ? "Desactivar" : "Activar"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <VariedadEditDialog
        variedad={variedad}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={toggleOpen}
        onOpenChange={setToggleOpen}
        title={variedad.activo ? "Desactivar variedad" : "Activar variedad"}
        description={
          variedad.activo ? (
            <>
              ¿Desactivar{" "}
              <span className="font-medium text-foreground">
                {variedad.nombre}
              </span>
              ?
            </>
          ) : (
            <>
              ¿Activar{" "}
              <span className="font-medium text-foreground">
                {variedad.nombre}
              </span>
              ?
            </>
          )
        }
        confirmLabel={variedad.activo ? "Sí, desactivar" : "Sí, activar"}
        confirmVariant={variedad.activo ? "destructive" : "default"}
        isPending={isToggling}
        onConfirm={() =>
          toggle(variedad.id, { onSuccess: () => setToggleOpen(false) })
        }
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar variedad"
        description={
          <>
            ¿Eliminar{" "}
            <span className="font-medium text-foreground">
              {variedad.nombre}
            </span>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        isPending={isDeleting}
        onConfirm={() =>
          remove(variedad.id, { onSuccess: () => setDeleteOpen(false) })
        }
      />
    </>
  )
}

// ── Categoria Actions ─────────────────────────────────────────────────────────

export function CategoriaActions({ categoria }: { categoria: Categoria }) {
  const [editOpen, setEditOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: toggle, isPending: isToggling } = useToggleCategoria()
  const { mutate: remove, isPending: isDeleting } = useDeleteCategoria()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setToggleOpen(true)}>
            <PowerIcon /> {categoria.activo ? "Desactivar" : "Activar"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CategoriaEditDialog
        categoria={categoria}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={toggleOpen}
        onOpenChange={setToggleOpen}
        title={categoria.activo ? "Desactivar categoría" : "Activar categoría"}
        description={
          categoria.activo ? (
            <>
              ¿Desactivar{" "}
              <span className="font-medium text-foreground">
                {categoria.nombre}
              </span>
              ?
            </>
          ) : (
            <>
              ¿Activar{" "}
              <span className="font-medium text-foreground">
                {categoria.nombre}
              </span>
              ?
            </>
          )
        }
        confirmLabel={categoria.activo ? "Sí, desactivar" : "Sí, activar"}
        confirmVariant={categoria.activo ? "destructive" : "default"}
        isPending={isToggling}
        onConfirm={() =>
          toggle(categoria.id, { onSuccess: () => setToggleOpen(false) })
        }
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar categoría"
        description={
          <>
            ¿Eliminar{" "}
            <span className="font-medium text-foreground">
              {categoria.nombre}
            </span>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        isPending={isDeleting}
        onConfirm={() =>
          remove(categoria.id, { onSuccess: () => setDeleteOpen(false) })
        }
      />
    </>
  )
}
