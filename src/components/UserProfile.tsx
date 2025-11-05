import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { MapPin, Calendar, Trophy, LogOut, Edit, Save, X, Plus, Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProfilePictureUpload } from './ProfilePictureUpload';

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
  const { user, updateUserProfile, isLoading, error } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  if (!user) return null;

  const validateForm = (formData: Partial<typeof user>) => {
    const errors: {[key: string]: string} = {};
    
    if (formData.firstName && formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (formData.lastName && formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm(user)) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUserProfile(user);
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
    // Reset form data to original values
    setNewSkill('');
    setNewGoal('');
  };

  const addSkill = () => {
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      updateUserProfile({
        skills: [...user.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateUserProfile({
      skills: user.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addGoal = () => {
    if (newGoal.trim() && !user.careerGoals.includes(newGoal.trim())) {
      updateUserProfile({
        careerGoals: [...user.careerGoals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const removeGoal = (goalToRemove: string) => {
    updateUserProfile({
      careerGoals: user.careerGoals.filter(goal => goal !== goalToRemove)
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="relative z-10">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {saveSuccess && (
        <Alert variant="default" className="relative z-10">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Overview</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <ProfilePictureUpload
              currentPicture={user.profilePicture}
              onUpload={(imageUrl) => updateUserProfile({ profilePicture: imageUrl })}
              isLoading={isSaving}
            />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-xl font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                )}
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="w-32">
                        <Input
                          value={user.firstName}
                          onChange={(e) => updateUserProfile({ firstName: e.target.value })}
                          placeholder="First Name"
                          className={formErrors.firstName ? 'border-red-500' : ''}
                        />
                        {formErrors.firstName && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div className="w-32">
                        <Input
                          value={user.lastName}
                          onChange={(e) => updateUserProfile({ lastName: e.target.value })}
                          placeholder="Last Name"
                          className={formErrors.lastName ? 'border-red-500' : ''}
                        />
                        {formErrors.lastName && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <Input
                      value={user.title}
                      onChange={(e) => updateUserProfile({ title: e.target.value })}
                      placeholder="Job Title"
                    />
                    <div className="flex gap-2">
                      <Select value={user.experience} onValueChange={(value) => updateUserProfile({ experience: value })}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={user.location}
                        onChange={(e) => updateUserProfile({ location: e.target.value })}
                        placeholder="Location"
                        className="w-40"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p className="text-muted-foreground">{user.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined Jan 2024
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="flex items-center gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive relative z-10"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
          
          {isEditing && (
            <div className="mb-6">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={user.bio}
                onChange={(e) => updateUserProfile({ bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="mt-1"
              />
            </div>
          )}
          
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
              <div className="flex items-center justify-between mb-3">
                <p>Skills</p>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add skill"
                      className="w-32"
                    />
                    <Button size="sm" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800 flex items-center gap-1"
                  >
                    {skill}
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-transparent relative z-10"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
                {user.skills.length > 6 && (
                  <Badge variant="outline">+{user.skills.length - 6} more</Badge>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p>Career Goals</p>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add goal"
                      className="w-32"
                    />
                    <Button size="sm" onClick={addGoal}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {user.careerGoals.map((goal) => (
                  <Badge 
                    key={goal} 
                    variant="outline" 
                    className="flex items-center gap-1"
                  >
                    {goal}
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-transparent relative z-10"
                        onClick={() => removeGoal(goal)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave} className="flex items-center gap-2" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-yellow-50/30">
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