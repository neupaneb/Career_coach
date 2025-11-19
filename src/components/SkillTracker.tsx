import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function SkillTracker() {
  const { user } = useApp();

  if (!user) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Please log in to view your skills.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <CardTitle>Your Skills</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {user.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 text-sm py-1 px-3"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No skills added yet.</p>
              <p className="text-sm mt-2">Add skills to your profile to get personalized recommendations.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {user.careerGoals && user.careerGoals.length > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50/30">
          <CardHeader>
            <CardTitle>Career Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.careerGoals.map((goal) => (
                <Badge 
                  key={goal} 
                  variant="outline" 
                  className="text-sm py-1 px-3"
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}