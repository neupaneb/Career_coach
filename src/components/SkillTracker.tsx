import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Target, CheckCircle, Clock } from 'lucide-react';

const skillProgress = [
  { skill: 'React', level: 'Advanced', progress: 85, target: 95 },
  { skill: 'TypeScript', level: 'Intermediate', progress: 70, target: 85 },
  { skill: 'Node.js', level: 'Intermediate', progress: 60, target: 80 },
  { skill: 'Python', level: 'Beginner', progress: 25, target: 60 },
  { skill: 'AWS', level: 'Beginner', progress: 30, target: 70 }
];

const learningMilestones = [
  {
    title: 'Complete React Advanced Course',
    progress: 75,
    dueDate: '2024-04-15',
    status: 'in-progress'
  },
  {
    title: 'Build Full-Stack Project',
    progress: 40,
    dueDate: '2024-05-01',
    status: 'in-progress'
  },
  {
    title: 'AWS Certification Prep',
    progress: 100,
    dueDate: '2024-03-20',
    status: 'completed'
  }
];

const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.5 },
  { day: 'Wed', hours: 3.0 },
  { day: 'Thu', hours: 2.0 },
  { day: 'Fri', hours: 1.0 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 3.5 }
];

export function SkillTracker() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <CardTitle>Skill Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skillProgress.map((item) => (
              <div key={item.skill} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h4>{item.skill}</h4>
                    <Badge 
                      variant={item.level === 'Advanced' ? 'default' : 'secondary'}
                      className={item.level === 'Advanced' ? 'bg-green-600' : 
                                item.level === 'Intermediate' ? 'bg-blue-600' : 'bg-gray-600'}
                    >
                      {item.level}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.progress}%
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress value={item.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Current: {item.progress}%</span>
                    <span>Target: {item.target}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            <CardTitle>Learning Milestones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningMilestones.map((milestone, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
                    <h4>{milestone.title}</h4>
                  </div>
                  <Badge 
                    variant={milestone.status === 'completed' ? 'default' : 'secondary'}
                    className={milestone.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}
                  >
                    {milestone.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={milestone.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{milestone.progress}% complete</span>
                    <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Weekly Learning Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <span>Total this week: 17.5 hours</span>
            <span>Goal: 20 hours/week</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}