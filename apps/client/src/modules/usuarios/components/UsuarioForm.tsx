import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/form/FormInput"
import { FormInputPassword } from "@/components/form/FormInputPassword"
import { FormSelect } from "@/components/form/FormSelect"
import { FieldGroup } from "@/components/ui/field"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"

import { createUsuarioSchema } from "../lib/usuario.schema"
import { useCreateUsuario } from "../hooks/useUsuarioMutations"
import { useUnidadesAll } from "@/modules/unidades/hooks/useUnidades"
import { ROL_LABELS, ROL_ENUM } from "../types/usuario.types"

import type { CreateUsuarioFormInput } from "../lib/usuario.schema"

const rolOptions = ROL_ENUM.map((rol) => ({
  value: rol,
  label: ROL_LABELS[rol],
}))

interface Props {
  onClose: () => void
}

export function UsuarioCreateForm({ onClose }: Props) {
  const { data: unidades = [], isLoading: isLoadingUnidades } =
    useUnidadesAll(true)
  const { mutate: create, isPending } = useCreateUsuario({ onSuccess: onClose })

  const unidadOptions = unidades.map((u) => ({
    value: String(u.id),
    label: u.nombre,
  }))

  const form = useForm<CreateUsuarioFormInput>({
    resolver: zodResolver(createUsuarioSchema),
    defaultValues: {
      nombre: "",
      usuario: "",
      password: "",
      rol: undefined,
      unidadId: undefined,
      activo: true,
    },
  })

  const rolActual = useWatch({ control: form.control, name: "rol" })
  const esAdministrador = rolActual === "administrador"

  function onSubmit(data: CreateUsuarioFormInput) {
    create({
      nombre: data.nombre,
      usuario: data.usuario,
      password: data.password,
      rol: data.rol,
      unidadId: esAdministrador
        ? undefined
        : (data.unidadId as number | undefined),
      activo: data.activo,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormInput
          name="nombre"
          label="Nombre completo"
          placeholder="Ej: Juan Pérez"
          control={form.control}
          disabled={isPending}
        />
        <FormInput
          name="usuario"
          label="Usuario"
          placeholder="Ej: jperez"
          control={form.control}
          disabled={isPending}
        />
        <FormInputPassword
          name="password"
          label="Contraseña"
          control={form.control}
          disabled={isPending}
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
            placeholder={
              isLoadingUnidades ? "Cargando..." : "Selecciona una unidad"
            }
            options={unidadOptions}
            control={form.control as never}
            disabled={isPending || isLoadingUnidades || !rolActual}
          />
        )}
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
          {isPending ? "Registrando..." : "Registrar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
