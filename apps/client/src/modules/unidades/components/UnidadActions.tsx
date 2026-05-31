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

import { UnidadEditDialog } from "./UnidadDialog"
import { useToggleUnidad, useDeleteUnidad } from "../hooks/useUnidadMutations"
import type { Unidad } from "../types/unidad.types"

interface UnidadActionsProps {
  unidad: Unidad
}

export function UnidadActions({ unidad }: UnidadActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: toggle, isPending: isToggling } = useToggleUnidad()
  const { mutate: remove, isPending: isDeleting } = useDeleteUnidad()

  function handleToggle() {
    toggle(unidad.id, { onSuccess: () => setToggleOpen(false) })
  }

  function handleDelete() {
    remove(unidad.id, { onSuccess: () => setDeleteOpen(false) })
  }

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
            <PencilIcon />
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setToggleOpen(true)}>
            <PowerIcon />
            {unidad.activo ? "Desactivar" : "Activar"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={unidad._count.usuarios > 0}
          >
            <Trash2Icon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Dialog editar ── */}
      <UnidadEditDialog
        unidad={unidad}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* ── Dialog confirmar toggle ── */}
      <Dialog open={toggleOpen} onOpenChange={setToggleOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {unidad.activo ? "Desactivar unidad" : "Activar unidad"}
            </DialogTitle>
            <DialogDescription>
              {unidad.activo ? (
                <>
                  ¿Estás seguro de que deseas desactivar{" "}
                  <span className="font-medium text-foreground">
                    {unidad.nombre}
                  </span>
                  ? No podrá asignarse a nuevos usuarios.
                </>
              ) : (
                <>
                  ¿Deseas activar{" "}
                  <span className="font-medium text-foreground">
                    {unidad.nombre}
                  </span>
                  ? Volverá a estar disponible para asignar usuarios.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setToggleOpen(false)}
              disabled={isToggling}
            >
              Cancelar
            </Button>
            <Button
              variant={unidad.activo ? "destructive" : "default"}
              onClick={handleToggle}
              disabled={isToggling}
            >
              {isToggling
                ? "Procesando..."
                : unidad.activo
                  ? "Sí, desactivar"
                  : "Sí, activar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog confirmar eliminación ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar unidad</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar{" "}
              <span className="font-medium text-foreground">
                {unidad.nombre}
              </span>
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
