import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { AppProvider, useApp } from './context/AppContext';
import { AIRecommendationsProvider } from './context/AIRecommendationsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, isLoading } = useApp();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate initialization time
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading Career Coach AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => {}} />;
  }

  return <Dashboard onLogout={() => {}} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AIRecommendationsProvider>
          <AppContent />
        </AIRecommendationsProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}