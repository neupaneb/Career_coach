import { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { CareerRecommendations } from './CareerRecommendations';
import { UserProfile } from './UserProfile';
import { SkillTracker } from './SkillTracker';
import { SavedJobs } from './SavedJobs';
import { Sheet, SheetContent } from './ui/sheet';
import { useApp } from '../context/AppContext';
import { ErrorBoundary } from './ErrorBoundary';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { logout } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    onLogout();
  }, [logout, onLogout]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const renderContent = useMemo(() => {
    try {
      switch (activeTab) {
        case 'home':
          return (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Coach AI</h1>
                <p className="text-sm text-slate-600">Your personalized career dashboard</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ErrorBoundary>
                    <CareerRecommendations />
                  </ErrorBoundary>
                </div>
                <div className="space-y-6">
                  <ErrorBoundary>
                    <UserProfile onLogout={handleLogout} />
                  </ErrorBoundary>
                  <div className="lg:hidden">
                    <ErrorBoundary>
                      <SkillTracker />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'career-paths':
          return (
            <div className="max-w-4xl w-full">
              <div className="mb-8 pb-4 border-b border-slate-200">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Coach AI</h1>
                <h2 className="text-2xl font-semibold text-slate-800 mt-2">Career Paths</h2>
                <p className="text-sm text-slate-600 mt-2">Explore personalized career recommendations</p>
              </div>
              <ErrorBoundary>
                <CareerRecommendations />
              </ErrorBoundary>
            </div>
          );
        case 'skills':
          return (
            <div className="max-w-4xl w-full">
              <div className="mb-8 pb-4 border-b border-slate-200">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Coach AI</h1>
                <h2 className="text-2xl font-semibold text-slate-800 mt-2">Skills Development</h2>
                <p className="text-sm text-slate-600 mt-2">Track your learning progress and milestones</p>
              </div>
              <ErrorBoundary>
                <SkillTracker />
              </ErrorBoundary>
            </div>
          );
        case 'saved-jobs':
          return (
            <div className="max-w-4xl w-full">
              <div className="mb-8 pb-4 border-b border-slate-200">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Coach AI</h1>
                <h2 className="text-2xl font-semibold text-slate-800 mt-2">Saved Jobs</h2>
                <p className="text-sm text-slate-600 mt-2">Your saved job opportunities</p>
              </div>
              <ErrorBoundary>
                <SavedJobs />
              </ErrorBoundary>
            </div>
          );
        case 'profile':
          return (
            <div className="max-w-2xl w-full">
              <div className="mb-8 pb-4 border-b border-slate-200">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Coach AI</h1>
                <h2 className="text-2xl font-semibold text-slate-800 mt-2">My Profile</h2>
                <p className="text-sm text-slate-600 mt-2">Manage your profile information</p>
              </div>
              <ErrorBoundary>
                <UserProfile onLogout={handleLogout} />
              </ErrorBoundary>
            </div>
          );
        default:
          return (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Page not found</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="text-center py-12">
          <p className="text-red-600">An error occurred. Please try refreshing the page.</p>
        </div>
      );
    }
  }, [activeTab, handleLogout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 relative">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block relative z-10">
          <ErrorBoundary>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
          </ErrorBoundary>
        </div>
        
        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} modal={true}>
          <SheetContent side="left" className="p-0 w-64 z-[100]">
            <ErrorBoundary>
              <Sidebar 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                  handleTabChange(tab);
                  setIsMobileMenuOpen(false);
                }} 
                isMobile 
              />
            </ErrorBoundary>
          </SheetContent>
        </Sheet>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0 relative z-0">
          <ErrorBoundary>
            <TopNavbar 
              onMenuClick={() => setIsMobileMenuOpen(true)}
              showMenuButton={true}
            />
          </ErrorBoundary>
          
          <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto relative z-0">
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              {renderContent}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}