import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/form/FormInput"
import { FormInputPassword } from "@/components/form/FormInputPassword"
import { FormSelect } from "@/components/form/FormSelect"
import { FormCheckbox } from "@/components/form/FormCheckbox"
import { FieldGroup } from "@/components/ui/field"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

import { updateUsuarioSchema } from "../lib/usuario.schema"
import { useUpdateUsuario } from "../hooks/useUsuarioMutations"
import { useUnidadesAll } from "@/modules/unidades/hooks/useUnidades"
import { ROL_LABELS, ROL_ENUM } from "../types/usuario.types"

import type { UpdateUsuarioFormInput } from "../lib/usuario.schema"
import type { Usuario } from "../types/usuario.types"
import type { SelectOption } from "@/components/form/FormSelect"

const rolOptions = ROL_ENUM.map((rol) => ({
  value: rol,
  label: ROL_LABELS[rol],
}))

interface Props {
  usuario: Usuario
  onClose: () => void
}

export function UsuarioEditForm({ usuario, onClose }: Props) {
  const { data: unidades = [], isLoading: isLoadingUnidades } =
    useUnidadesAll(false)

  if (isLoadingUnidades) {
    return (
      <div className="space-y-4 py-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <UsuarioEditFormReady
      usuario={usuario}
      unidades={unidades}
      onClose={onClose}
    />
  )
}

interface ReadyProps {
  usuario: Usuario
  unidades: { id: number; nombre: string; activo: boolean }[]
  onClose: () => void
}

function UsuarioEditFormReady({ usuario, unidades, onClose }: ReadyProps) {
  const { mutate: update, isPending } = useUpdateUsuario({ onSuccess: onClose })

  const unidadOptions: SelectOption[] = unidades
    .filter((u) => u.activo)
    .map((u) => ({ value: String(u.id), label: u.nombre }))

  const unidadAsignadaInactiva = unidades.find(
    (u) => u.id === usuario.unidadId && !u.activo
  )
  if (unidadAsignadaInactiva) {
    unidadOptions.push({
      value: String(unidadAsignadaInactiva.id),
      label: `${unidadAsignadaInactiva.nombre} (inactiva)`,
    })
  }

  const form = useForm<UpdateUsuarioFormInput>({
    resolver: zodResolver(updateUsuarioSchema),
    defaultValues: {
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      password: "",
      rol: usuario.rol,
      unidadId:
        usuario.unidadId != null
          ? (String(usuario.unidadId) as unknown as number)
          : undefined,
      activo: usuario.activo,
    },
  })

  const rolActual = useWatch({ control: form.control, name: "rol" })
  const esAdministrador = rolActual === "administrador"

  function onSubmit(data: UpdateUsuarioFormInput) {
    const payload: Record<string, unknown> = {}

    if (data.nombre) payload.nombre = data.nombre
    if (data.usuario) payload.usuario = data.usuario
    if (data.password) payload.password = data.password
    if (data.rol) payload.rol = data.rol
    if (data.activo !== undefined) payload.activo = data.activo

    if (data.rol === "administrador") {
      payload.unidadId = null
    } else if (data.unidadId != null) {
      payload.unidadId = Number(data.unidadId)
    }

    update({ id: usuario.id, payload })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormInput
          name="nombre"
          label="Nombre completo"
          control={form.control}
          disabled={isPending}
        />
        <FormInput
          name="usuario"
          label="Usuario"
          control={form.control}
          disabled={isPending}
        />
        <FormInputPassword
          name="password"
          label="Nueva contraseña"
          control={form.control}
          disabled={isPending}
          required={false}
          description="Déjala vacía para no cambiarla"
        />
        <FormSelect
          name="rol"
          label="Rol"
          placeholder="Selecciona un rol"
          options={rolOptions}
          control={form.control}
          disabled={isPending}
        />
        {!esAdministrador && (
          <FormSelect
            name="unidadId"
            label="Unidad"
            placeholder="Selecciona una unidad"
            options={unidadOptions}
            control={form.control as never}
            disabled={isPending}
            description={
              unidadAsignadaInactiva
                ? "La unidad asignada está inactiva. Asigna una unidad activa."
                : undefined
            }
          />
        )}
        <FormCheckbox
          name="activo"
          label="Usuario activo"
          control={form.control}
          disabled={isPending}
          required={false}
        />
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              form.reset()
              onClose()
            }}
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </DialogFooter>
    </form>
  )
}
