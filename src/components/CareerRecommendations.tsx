import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { TrendingUp, Star, Clock, MapPin, Heart, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';

interface JobRecommendation {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  type: string;
  postedDate: string;
  matchPercentage: number;
  description?: string;
  applicationUrl?: string;
}

interface TrendingSkill {
  skill: string;
  demand: string;
  growth: string;
}

export function CareerRecommendations() {
  const { savedJobs, appliedJobs, addSavedJob, addAppliedJob, error } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [localAppliedJobs, setLocalAppliedJobs] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [trendingSkills, setTrendingSkills] = useState<TrendingSkill[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  // Always start with false - only set to true after user generates
  const [hasGenerated, setHasGenerated] = useState(false);

  const fetchData = async () => {
    setIsLoadingData(true);
    setDataError(null);
    
    try {
      // Fetch job recommendations
      const recommendationsResponse = await apiService.getJobRecommendations();
      if (recommendationsResponse.success && recommendationsResponse.recommendations) {
        setRecommendations(recommendationsResponse.recommendations);
      }

      // Fetch trending skills
      const skillsResponse = await apiService.getTrendingSkills();
      if (skillsResponse.success && skillsResponse.trendingSkills) {
        setTrendingSkills(skillsResponse.trendingSkills);
      }
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setDataError(err.message || 'Failed to load recommendations. Please try again later.');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Check if recommendations have been generated and fetch data
  useEffect(() => {
    const generated = localStorage.getItem('job_recommendations_generated') === 'true';
    setHasGenerated(generated);
    
    if (generated) {
      fetchData();
    }

    // Listen for refresh event
    const handleRefresh = () => {
      const isGenerated = localStorage.getItem('job_recommendations_generated') === 'true';
      setHasGenerated(isGenerated);
      if (isGenerated) {
        fetchData();
      }
    };
    window.addEventListener('refreshRecommendations', handleRefresh);

    return () => {
      window.removeEventListener('refreshRecommendations', handleRefresh);
    };
  }, []);

  const handleSaveJob = async (jobId: string) => {
    setIsLoading(true);
    setActionSuccess(null);
    
    try {
      await apiService.saveJob(jobId);
      const job = recommendations.find(j => j._id === jobId);
      if (job) {
        const savedJob = {
          id: parseInt(jobId) || 0,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: `${job.salary.currency} ${job.salary.min}k - ${job.salary.max}k`,
          skills: job.skills,
          type: job.type,
          postedDays: Math.floor((Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)),
          savedDate: new Date().toISOString().split('T')[0]
        };
        addSavedJob(savedJob);
        setActionSuccess(`Job "${job.title}" saved successfully!`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error saving job:', err);
      setActionSuccess(`Failed to save job: ${err.message || 'Unknown error'}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    setIsLoading(true);
    setActionSuccess(null);
    
    try {
      await apiService.applyToJob(jobId);
      
      if (!localAppliedJobs.includes(jobId)) {
        setLocalAppliedJobs([...localAppliedJobs, jobId]);
        addAppliedJob(parseInt(jobId) || 0);
        const job = recommendations.find(j => j._id === jobId);
        if (job) {
          setActionSuccess(`Application submitted for "${job.title}"!`);
          setTimeout(() => setActionSuccess(null), 3000);
        }
      }
    } catch (err: any) {
      console.error('Error applying to job:', err);
      setActionSuccess(`Failed to apply: ${err.message || 'Unknown error'}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    return `${salary.currency} ${salary.min}k - ${salary.max}k`;
  };

  const getDaysAgo = (postedDate: string) => {
    const days = Math.floor((Date.now() - new Date(postedDate).getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days}d ago`;
  };

  const isJobSaved = (jobId: string) => {
    // Check if job is in savedJobs by matching title/company since savedJobs uses numeric IDs
    const job = recommendations.find(j => j._id === jobId);
    return job ? savedJobs.some(saved => saved.title === job.title && saved.company === job.company) : false;
  };
  
  const isJobApplied = (jobId: string) => localAppliedJobs.includes(jobId);
  // Don't show anything if recommendations haven't been generated
  if (!hasGenerated) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Career Recommendations</CardTitle>
          </div>
          <CardDescription>
            Generate job recommendations from your profile to see personalized matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Go to your Profile and click "Generate Job Recommendations" to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {dataError && (
        <Alert variant="destructive">
          <AlertDescription>{dataError}</AlertDescription>
        </Alert>
      )}

      {actionSuccess && (
        <Alert variant="default">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{actionSuccess}</AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Career Recommendations</CardTitle>
          </div>
          <CardDescription>
            Personalized job matches based on your skills and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span className="text-muted-foreground">Loading recommendations...</span>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No job recommendations available at the moment.</p>
              <p className="text-sm mt-2">Make sure your profile has skills added to get personalized recommendations.</p>
            </div>
          ) : (
            recommendations.map((job) => (
              <div key={job._id} className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 bg-white hover:border-blue-300 relative z-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="mb-1">{job.title}</h4>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {job.matchPercentage}% match
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {getDaysAgo(job.postedDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {formatSalary(job.salary)}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills && job.skills.length > 0 ? (
                    job.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No skills listed</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={`relative z-10 ${
                      isJobApplied(job._id) 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => handleApplyJob(job._id)}
                    disabled={isJobApplied(job._id) || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Processing...
                      </>
                    ) : isJobApplied(job._id) ? (
                      <>
                        <Star className="h-4 w-4 mr-1" />
                        Applied
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Apply Now
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSaveJob(job._id)}
                    disabled={isLoading}
                    className={`relative z-10 ${
                      isJobSaved(job._id) 
                        ? 'border-red-500 text-red-600 hover:bg-red-50' 
                        : ''
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Heart className={`h-4 w-4 mr-1 ${isJobSaved(job._id) ? 'fill-current' : ''}`} />
                    )}
                    {isJobSaved(job._id) ? 'Saved' : 'Save Job'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-teal-50/30">
        <CardHeader>
          <CardTitle>Trending Skills to Learn</CardTitle>
          <CardDescription>
            Skills in high demand based on current job market
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
              <span className="text-muted-foreground">Loading trending skills...</span>
            </div>
          ) : trendingSkills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No trending skills data available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingSkills.map((item) => (
              <div key={item.skill} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-white hover:border-teal-300 relative z-0">
                <div className="flex justify-between items-start mb-2">
                  <h4>{item.skill}</h4>
                  <Badge 
                    variant={item.demand === 'High' ? 'default' : 'secondary'}
                    className={item.demand === 'High' ? 'bg-blue-600' : ''}
                  >
                    {item.demand} Demand
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Growth: <span className="text-green-600">{item.growth}</span>
                </p>
                <Button size="sm" variant="outline" className="w-full relative z-10">
                  Start Learning
                </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}