import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Outlet } from "react-router"
import { AppHeader } from "./app-header"

export default function AppLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 md:p-6 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}