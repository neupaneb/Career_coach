import { Home, MapPin, BookOpen, User, Settings, Heart } from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobile?: boolean;
}

const menuItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'career-paths', icon: MapPin, label: 'Career Paths' },
  { id: 'skills', icon: BookOpen, label: 'Skills' },
  { id: 'saved-jobs', icon: Heart, label: 'Saved Jobs' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ activeTab, onTabChange, isMobile = false }: SidebarProps) {
  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border",
      isMobile ? "w-full" : "w-64 h-screen"
    )}>
      <div className="p-6">
        <h2 className="text-sidebar-primary">Career Coach AI</h2>
      </div>
      
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}