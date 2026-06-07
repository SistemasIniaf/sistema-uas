import * as React from "react"
import { Package, MonitorCog, Sprout } from "lucide-react"

import { NavMain } from "./NavMain"
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
import { useUserRol } from "@/store/auth.store"

const allNavItems = [
  {
    title: "Administración",
    url: "#",
    icon: <MonitorCog />,
    isActive: true,
    allowedRoles: ["administrador"] as const,
    items: [
      { title: "Usuarios", url: "/usuarios" },
      { title: "Unidades", url: "/unidades" },
    ],
  },
  {
    title: "Operaciones",
    url: "#",
    icon: <Sprout />,
    isActive: true,
    allowedRoles: [
      "administrador",
      "responsable",
      "operador",
      "auditor",
    ] as const,
    items: [{ title: "Gestión de semilla", url: "/gestion-semilla" }],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const rol = useUserRol()

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

      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
