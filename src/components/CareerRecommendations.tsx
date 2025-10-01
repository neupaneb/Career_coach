import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, Star, Clock, MapPin } from 'lucide-react';

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
  return (
    <div className="space-y-6">
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Apply Now
                </Button>
                <Button size="sm" variant="outline">
                  Save Job
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