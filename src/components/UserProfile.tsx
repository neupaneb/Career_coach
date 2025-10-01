import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { MapPin, Calendar, Trophy, LogOut } from 'lucide-react';

const userSkills = [
  'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git', 'AWS'
];

const achievements = [
  { title: 'Frontend Master', description: 'Completed advanced React course', date: '2024-01-15' },
  { title: 'Problem Solver', description: 'Solved 100+ coding challenges', date: '2024-02-20' },
  { title: 'Team Player', description: 'Led 3 successful projects', date: '2024-03-10' }
];

interface UserProfileProps {
  onLogout: () => void;
}

export function UserProfile({ onLogout }: UserProfileProps) {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xl">BN</span>
              </div>
              <div>
                <h3>Bibek Nuepane</h3>
                <p className="text-muted-foreground">Frontend Developer</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Nashville, TN
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined Jan 2024
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="flex items-center gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p>Career Progress</p>
                <span className="text-sm text-muted-foreground">Level 8</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">78% to next level</p>
            </div>
            
            <div>
              <p className="mb-3">Top Skills</p>
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 6).map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                ))}
                <Badge variant="outline">+{userSkills.length - 6} more</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <CardTitle>Recent Achievements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="border-l-4 border-blue-600 pl-4">
                <h4>{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(achievement.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}