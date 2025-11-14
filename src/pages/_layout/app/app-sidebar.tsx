import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/shared/ui/sidebar"

import { LayoutDashboard, CreditCard, Banknote, Receipt, Wallet } from 'lucide-react'
import { useNavigate, useLocation } from "react-router"

const data = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Despesas",
    url: "/expenses",
    icon: Receipt,
  },
  {
    title: "Cartões",
    url: "/cards",
    icon: CreditCard,
  },
  {
    title: "Métodos",
    url: "/methods",
    icon: Banknote,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar collapsible="offcanvas" {...props} variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size='lg'
              className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer"
            >
              <a href="#">
                <Wallet className="text-sidebar-primary size-5" />
                <span className="text-base font-semibold">My Expenses</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {data.map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title} onClick={() => navigate(item.url)}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      size='lg'
                      variant='outline'
                      className="cursor-pointer px-4"
                      isActive={isActive}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarTrigger className="w-full" />
      </SidebarFooter>
    </Sidebar>
  )
}
