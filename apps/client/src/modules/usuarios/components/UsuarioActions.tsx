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

import { UsuarioEditDialog } from "./UsuarioDialog"
import {
  useToggleUsuario,
  useDeleteUsuario,
} from "../hooks/useUsuarioMutations"
import type { Usuario } from "../types/usuario.types"

interface UsuarioActionsProps {
  usuario: Usuario
}

export function UsuarioActions({ usuario }: UsuarioActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: toggle, isPending: isToggling } = useToggleUsuario()
  const { mutate: remove, isPending: isDeleting } = useDeleteUsuario()

  function handleToggle() {
    toggle(usuario.id, { onSuccess: () => setToggleOpen(false) })
  }

  function handleDelete() {
    remove(usuario.id, { onSuccess: () => setDeleteOpen(false) })
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
            {usuario.activo ? "Desactivar" : "Activar"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Dialog editar ── */}
      <UsuarioEditDialog
        usuario={usuario}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* ── Dialog confirmar toggle ── */}
      <Dialog open={toggleOpen} onOpenChange={setToggleOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {usuario.activo ? "Desactivar usuario" : "Activar usuario"}
            </DialogTitle>
            <DialogDescription>
              {usuario.activo ? (
                <>
                  ¿Estás seguro de que deseas desactivar a{" "}
                  <span className="font-medium text-foreground">
                    {usuario.nombre}
                  </span>
                  ? No podrá iniciar sesión hasta que sea reactivado.
                </>
              ) : (
                <>
                  ¿Deseas activar a{" "}
                  <span className="font-medium text-foreground">
                    {usuario.nombre}
                  </span>
                  ? Podrá volver a iniciar sesión en el sistema.
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
              variant={usuario.activo ? "destructive" : "default"}
              onClick={handleToggle}
              disabled={isToggling}
            >
              {isToggling
                ? "Procesando..."
                : usuario.activo
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
            <DialogTitle>Eliminar usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="font-medium text-foreground">
                {usuario.nombre}
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
