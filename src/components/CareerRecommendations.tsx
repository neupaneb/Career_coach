import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { TrendingUp, Star, Clock, MapPin, Heart, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const recommendations = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    match: 92,
    salary: '$120k - $150k',
    skills: ['React', 'TypeScript', 'Next.js'],
    type: 'Full-time',
    postedDays: 2
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    location: 'Remote',
    match: 87,
    salary: '$90k - $120k',
    skills: ['Figma', 'Design Systems', 'User Research'],
    type: 'Full-time',
    postedDays: 1
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    match: 78,
    salary: '$110k - $140k',
    skills: ['Product Strategy', 'Analytics', 'Agile'],
    type: 'Full-time',
    postedDays: 5
  }
];

const skillSuggestions = [
  { skill: 'Machine Learning', demand: 'High', growth: '+25%' },
  { skill: 'Cloud Architecture', demand: 'High', growth: '+30%' },
  { skill: 'Data Analysis', demand: 'Medium', growth: '+15%' },
  { skill: 'Mobile Development', demand: 'Medium', growth: '+20%' }
];

export function CareerRecommendations() {
  const { savedJobs, appliedJobs, addSavedJob, addAppliedJob, error } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [localAppliedJobs, setLocalAppliedJobs] = useState<number[]>([]);

  const handleSaveJob = async (jobId: number) => {
    setIsLoading(true);
    setActionSuccess(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const job = recommendations.find(j => j.id === jobId);
      if (job) {
        const savedJob = {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          skills: job.skills,
          type: job.type,
          postedDays: job.postedDays,
          savedDate: new Date().toISOString().split('T')[0]
        };
        addSavedJob(savedJob);
        setActionSuccess(`Job "${job.title}" saved successfully!`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error saving job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyJob = async (jobId: number) => {
    setIsLoading(true);
    setActionSuccess(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!localAppliedJobs.includes(jobId)) {
        setLocalAppliedJobs([...localAppliedJobs, jobId]);
        addAppliedJob(jobId);
        const job = recommendations.find(j => j.id === jobId);
        if (job) {
          setActionSuccess(`Application submitted for "${job.title}"!`);
          setTimeout(() => setActionSuccess(null), 3000);
        }
      }
    } catch (err) {
      console.error('Error applying to job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isJobSaved = (jobId: number) => savedJobs.some(job => job.id === jobId);
  const isJobApplied = (jobId: number) => localAppliedJobs.includes(jobId);
  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {actionSuccess && (
        <Alert variant="default">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{actionSuccess}</AlertDescription>
        </Alert>
      )}
      <Card className="shadow-sm">
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
          {recommendations.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="mb-1">{job.title}</h4>
                  <p className="text-muted-foreground">{job.company}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {job.match}% match
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.postedDays}d ago
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {job.salary}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className={`${
                    isJobApplied(job.id) 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={() => handleApplyJob(job.id)}
                  disabled={isJobApplied(job.id) || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : isJobApplied(job.id) ? (
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
                  onClick={() => handleSaveJob(job.id)}
                  disabled={isLoading}
                  className={`${
                    isJobSaved(job.id) 
                      ? 'border-red-500 text-red-600 hover:bg-red-50' 
                      : ''
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Heart className={`h-4 w-4 mr-1 ${isJobSaved(job.id) ? 'fill-current' : ''}`} />
                  )}
                  {isJobSaved(job.id) ? 'Saved' : 'Save Job'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Trending Skills to Learn</CardTitle>
          <CardDescription>
            AI-recommended skills to boost your career prospects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillSuggestions.map((item) => (
              <div key={item.skill} className="border rounded-lg p-4">
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
                <Button size="sm" variant="outline" className="w-full">
                  Start Learning
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}