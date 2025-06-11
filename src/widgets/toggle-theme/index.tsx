import { useTheme } from '@/shared/hooks/useTheme';
import { Button } from '@/shared/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderIcon = () => {
    if (theme === 'light') {
      return <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />;
    }
    return <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />;
   
  };

  return (
    <Button
      variant="default"
      size="icon"
      className="relative"
      onClick={handleClick}
    >
      {renderIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
