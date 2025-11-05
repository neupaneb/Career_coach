import { Search, Bell, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';

interface TopNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopNavbar({ onMenuClick, showMenuButton = false }: TopNavbarProps) {
  const { user } = useApp();
  
  const userInitials = user 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '?';
  
  const userName = user 
    ? `${user.firstName} ${user.lastName}`
    : 'Guest';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-30 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick}
              className="relative z-10 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search careers, skills, or courses..."
              className="pl-10 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative z-10 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center p-0 text-xs font-semibold">
              3
            </Badge>
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={userName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-white text-sm font-semibold">{userInitials}</span>
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{user?.title || 'Member'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}