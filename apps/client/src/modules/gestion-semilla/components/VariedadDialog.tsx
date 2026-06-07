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

import { VariedadCreateForm } from "./VariedadCreateForm"
import { VariedadEditForm } from "./VariedadEditForm"
import type { Variedad } from "../types/gestion-semilla.types"

// ── Create Dialog ─────────────────────────────────────────────────────────────

interface VariedadCreateDialogProps {
  defaultProductoId?: number
}

export function VariedadCreateDialog({
  defaultProductoId,
}: VariedadCreateDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Nueva Variedad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crear variedad</DialogTitle>
          <DialogDescription>
            Registra una nueva variedad para una semilla.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <VariedadCreateForm
            defaultProductoId={defaultProductoId}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Edit Dialog ───────────────────────────────────────────────────────────────

interface VariedadEditDialogProps {
  variedad: Variedad
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VariedadEditDialog({
  variedad,
  open,
  onOpenChange,
}: VariedadEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar variedad</DialogTitle>
          <DialogDescription>
            Modifica los datos de{" "}
            <span className="font-medium text-foreground">
              {variedad.nombre}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        {open && (
          <VariedadEditForm
            variedad={variedad}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
