import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UsuarioCreateForm } from "./UsuarioForm"
import { UsuarioEditForm } from "./UsuarioEditForm"
import type { Usuario } from "../types/usuario.types"

// ── Crear ─────────────────────────────────────────────────────────────────────

export function UsuarioCreateDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Nuevo usuario
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
          <DialogDescription>
            Completa los datos para registrar un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>
        {open && <UsuarioCreateForm onClose={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  )
}

// ── Editar ────────────────────────────────────────────────────────────────────

interface UsuarioEditDialogProps {
  usuario: Usuario
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsuarioEditDialog({
  usuario,
  open,
  onOpenChange,
}: UsuarioEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos de{" "}
            <span className="font-medium text-foreground">
              {usuario.nombre}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {/*
          UsuarioEditForm se monta SOLO cuando open=true y se desmonta al cerrar.
          Gracias a eso, cada apertura crea una instancia nueva con defaultValues
          frescos — no hay ningún estado stale que limpiar.
        */}
        {open && (
          <UsuarioEditForm
            usuario={usuario}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
