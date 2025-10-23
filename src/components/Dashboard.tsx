import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { CareerRecommendations } from './CareerRecommendations';
import { UserProfile } from './UserProfile';
import { SkillTracker } from './SkillTracker';
import { Settings } from './Settings';
import { SavedJobs } from './SavedJobs';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { logout } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CareerRecommendations />
            </div>
            <div className="space-y-6">
              <UserProfile onLogout={handleLogout} />
              <div className="lg:hidden">
                <SkillTracker />
              </div>
            </div>
          </div>
        );
      case 'career-paths':
        return (
          <div className="max-w-4xl">
            <h2 className="mb-6">Career Paths</h2>
            <CareerRecommendations />
          </div>
        );
      case 'skills':
        return (
          <div className="max-w-4xl">
            <h2 className="mb-6">Skills Development</h2>
            <SkillTracker />
          </div>
        );
      case 'saved-jobs':
        return (
          <div className="max-w-4xl">
            <h2 className="mb-6">Saved Jobs</h2>
            <SavedJobs />
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-2xl">
            <h2 className="mb-6">My Profile</h2>
            <UserProfile onLogout={handleLogout} />
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl">
            <h2 className="mb-6">Settings</h2>
            <Settings />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }} 
              isMobile 
            />
          </SheetContent>
        </Sheet>
        
        {/* Main Content */}
        <div className="flex-1">
          <TopNavbar 
            onMenuClick={() => setIsMobileMenuOpen(true)}
            showMenuButton={true}
          />
          
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}