"use client"

import { useNavigate } from "react-router-dom"
import { LogOutIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getInitials, getAvatarColor, getAvatarUrl } from "@/lib/avatar"
import { useAuthStore } from "@/store/auth.store"

interface NavUserProps {
  user: { name: string; rol: string; avatar?: string }
}

export function NavUser({ user }: NavUserProps) {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const avatarUrl = getAvatarUrl(user.name, user.avatar)

  function handleLogout() {
    logout()
    navigate("/auth/login", { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-9 items-center gap-2 rounded-lg px-2 hover:bg-muted"
        >
          <div className="hidden flex-col items-end text-right sm:flex">
            <span className="text-sm leading-none font-medium">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">{user.rol}</span>
          </div>
          <Avatar className="size-8">
            <AvatarImage src={avatarUrl} alt={user.name} />
            <AvatarFallback
              className={`text-xs text-white ${getAvatarColor(user.name)}`}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar className="size-8">
              <AvatarImage src={avatarUrl} alt={user.name} />
              <AvatarFallback
                className={`text-xs text-white ${getAvatarColor(user.name)}`}
              >
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.rol}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Mi perfil
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOutIcon />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
