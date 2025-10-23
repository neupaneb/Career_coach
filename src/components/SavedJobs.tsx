import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, ExternalLink, MapPin, Clock, Star, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const savedJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    skills: ['React', 'TypeScript', 'Next.js'],
    type: 'Full-time',
    postedDays: 2,
    savedDate: '2024-01-15'
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    location: 'Remote',
    salary: '$90k - $120k',
    skills: ['Figma', 'Design Systems', 'User Research'],
    type: 'Full-time',
    postedDays: 1,
    savedDate: '2024-01-14'
  }
];

export function SavedJobs() {
  const { savedJobs, removeSavedJob } = useApp();

  const handleRemoveJob = (jobId: number) => {
    removeSavedJob(jobId);
  };

  const handleApplyJob = (jobId: number) => {
    // Handle job application
    console.log('Applying to job:', jobId);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              <CardTitle>Saved Jobs</CardTitle>
            </div>
            <Badge variant="secondary">{savedJobs.length} jobs saved</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {savedJobs.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved jobs yet</h3>
              <p className="text-muted-foreground">
                Start saving jobs you're interested in to keep track of opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="mb-1">{job.title}</h4>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveJob(job.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Saved on {new Date(job.savedDate).toLocaleDateString()}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleApplyJob(job.id)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
