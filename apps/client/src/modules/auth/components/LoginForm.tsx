import { toast } from "sonner"
import { isAxiosError } from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"

import { FormInput } from "@/components/form/FormInput"
import { FormInputPassword } from "@/components/form/FormInputPassword"

import { useLogin } from "../hooks/useLogin"
import { loginSchema } from "../lib/login.schema"

import type { LoginFormInput } from "../lib/login.schema"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: login, isPending } = useLogin({
    onError: (error) => {
      resetField("password")

      const errorMessage = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Error al iniciar sesión")
        : null

      toast.error(errorMessage)
    },
  })

  const { control, handleSubmit, resetField } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuario: "",
      password: "",
    },
  })

  function onSubmit(data: LoginFormInput) {
    login(data)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-extrabold">SISTEMA</h1>
                <p className="text-balance text-muted-foreground">
                  Inicia sesión con tu cuenta.
                </p>
              </div>

              <FormInput
                name="usuario"
                label="Usuario"
                control={control}
                disabled={isPending}
              />
              <FormInputPassword
                name="password"
                label="Contraseña"
                control={control}
                disabled={isPending}
              />

              <Field className="mt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Sistema de gestión de almacén
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/banner.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
