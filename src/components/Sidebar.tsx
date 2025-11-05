import { Home, MapPin, BookOpen, User, Heart } from 'lucide-react';
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
];

export function Sidebar({ activeTab, onTabChange, isMobile = false }: SidebarProps) {
  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-xl flex flex-col",
      isMobile ? "w-full h-full" : "w-64 h-screen sticky top-0"
    )}>
      {/* Title Section */}
      <div className="px-6 py-6 border-b border-slate-700/80">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
          Career Coach AI
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-normal leading-relaxed">
          Your career companion
        </p>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              type="button"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out text-left relative z-10 text-base",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800",
                "active:scale-[0.98]",
                isActive
                  ? "bg-blue-600 text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-700/60 hover:text-white font-medium hover:translate-x-1"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors duration-300",
                  isActive ? "text-white" : "text-slate-400"
                )} 
                aria-hidden="true"
              />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}