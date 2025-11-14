import { useAuthStore } from "@/modules/auth/hooks/useAuth";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { SidebarTrigger, useSidebar } from "@/shared/ui/sidebar";
import { ModeToggle } from "@/widgets/toggle-theme";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";

export function AppHeader() {
  const { user, logout } = useAuthStore();
  const { state } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Card className="flex flex-row items-center justify-between md:px-6 px-4 md:py-4 py-3 border-b border-border md:mx-6 mx-4 md:mt-6 mt-4">
      <div className="flex items-center gap-3">
        {state === "collapsed" && <SidebarTrigger />}
        <div className="sm:hidden block">
          <SidebarTrigger />
        </div>
        <div className="flex items-center gap-2">
          <User className="size-5 text-primary" />
          <span className="font-medium text-foreground">
            {user?.name || 'Usuário'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="size-4" />
          <span>Sair</span>
        </Button>
      </div>
    </Card>
  );
}

