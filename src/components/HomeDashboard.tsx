import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Briefcase, Heart, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CareerRecommendations } from './CareerRecommendations';
import { UserProfile } from './UserProfile';
import { SkillTracker } from './SkillTracker';
import apiService from '../services/apiService';

function QuickStatsCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: string }) {
  const IconComponent = icon === "briefcase" ? Briefcase : icon === "heart" ? Heart : Star;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <IconComponent className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

interface HomeDashboardProps {
  onLogout: () => void;
  onNavigate?: (tab: string) => void;
}

export function HomeDashboard({ onLogout, onNavigate }: HomeDashboardProps) {
  const { user, savedJobs } = useApp();
  // Always start with 0 - only update after generation
  const [jobMatchCount, setJobMatchCount] = useState(0);

  useEffect(() => {
    // Check if recommendations have been generated
    const checkAndFetch = () => {
      const hasGenerated = localStorage.getItem('job_recommendations_generated') === 'true';
      
      if (!hasGenerated) {
        setJobMatchCount(0);
        return;
      }

      // Only fetch if generated
      const fetchJobCount = async () => {
        try {
          const response = await apiService.getJobRecommendations();
          if (response.success && response.recommendations) {
            setJobMatchCount(response.recommendations.length);
          } else {
            setJobMatchCount(0);
          }
        } catch (error) {
          console.error('Error fetching job count:', error);
          setJobMatchCount(0);
        }
      };
      fetchJobCount();
    };

    // Initial check
    checkAndFetch();

    // Listen for refresh event
    const handleRefresh = () => {
      checkAndFetch();
    };
    window.addEventListener('refreshRecommendations', handleRefresh);

    return () => {
      window.removeEventListener('refreshRecommendations', handleRefresh);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Coach AI</h1>
        <p className="text-sm text-slate-600">Your personalized career dashboard</p>
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <QuickStatsCard 
          title="Job Matches" 
          value={jobMatchCount.toString()} 
          subtitle="Based on your skills"
          icon="briefcase"
        />
        <QuickStatsCard 
          title="Saved Jobs" 
          value={savedJobs.length.toString()} 
          subtitle="Your favorites"
          icon="heart"
        />
        <QuickStatsCard 
          title="Skills" 
          value={(user?.skills?.length || 0).toString()} 
          subtitle="In your profile"
          icon="star"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CareerRecommendations />
        </div>
        <div className="space-y-6">
          <UserProfile onLogout={onLogout} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

