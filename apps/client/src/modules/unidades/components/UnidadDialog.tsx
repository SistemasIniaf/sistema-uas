import { useState } from "react"
import { PlusIcon, PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UnidadForm } from "./UnidadForm"
import type { Unidad } from "../types/unidad.types"

// ── Crear ─────────────────────────────────────────────────────────────────────

export function UnidadCreateDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Nueva unidad
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crear unidad</DialogTitle>
          <DialogDescription>
            Completa los datos para registrar una nueva unidad.
          </DialogDescription>
        </DialogHeader>

        <UnidadForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

// ── Editar ────────────────────────────────────────────────────────────────────

interface UnidadEditDialogProps {
  unidad: Unidad
  /** Permite controlar el estado desde el menú de acciones de la fila */
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnidadEditDialog({
  unidad,
  open,
  onOpenChange,
}: UnidadEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar unidad</DialogTitle>
          <DialogDescription>
            Modifica los datos de{" "}
            <span className="font-medium text-foreground">{unidad.nombre}</span>
            .
          </DialogDescription>
        </DialogHeader>

        <UnidadForm unidad={unidad} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

// ── Re-export del trigger para usarlo fuera si se necesita ────────────────────
export { PencilIcon }
