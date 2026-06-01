import * as React from "react"
import { Package, MonitorCog } from "lucide-react"

import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser, useUserRol } from "@/store/auth.store"

// Definición completa del nav con los roles permitidos por sección
const allNavItems = [
  {
    title: "Administrar",
    url: "#",
    icon: <MonitorCog />,
    isActive: true,
    allowedRoles: ["administrador"] as const,
    items: [
      { title: "Usuarios", url: "/usuarios" },
      { title: "Unidades", url: "/unidades" },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser()
  const rol = useUserRol()

  // Filtra los grupos de navegación según el rol del usuario
  const navItems = allNavItems.filter(
    (item) => rol && item.allowedRoles.includes(rol as never)
  )

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">INIAF - ALMACEN</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navItems.length > 0 ? <NavMain items={navItems} /> : null}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.nombre ?? "",
            rol: user?.rol ?? "",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
