import { Search, Bell, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface TopNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopNavbar({ onMenuClick, showMenuButton = false }: TopNavbarProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search careers, skills, or courses..."
              className="pl-10 bg-input-background border-border"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-primary-foreground flex items-center justify-center p-0">
              3
            </Badge>
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-primary-foreground">B</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm">Bibek Nuepane</p>
              <p className="text-xs text-muted-foreground">Pro Member</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}