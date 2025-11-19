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
import { MapPin, Calendar, LogOut, Edit, Save, X, Plus, Loader2, CheckCircle, Briefcase, FolderKanban, GraduationCap, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { ResumeUpload } from './ResumeUpload';

// Removed hardcoded data - using real user data from context

interface UserProfileProps {
  onLogout: () => void;
  onNavigate?: (tab: string) => void;
}

export function UserProfile({ onLogout, onNavigate }: UserProfileProps) {
  const { user, updateUserProfile, isLoading, error } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isGeneratingJobs, setIsGeneratingJobs] = useState(false);
  const [selectedCareerGoal, setSelectedCareerGoal] = useState<string>('');

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

  const addGoal = async () => {
    const trimmedGoal = newGoal.trim();
    if (!trimmedGoal) {
      setError('Please enter a career goal.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const currentGoals = user.careerGoals || [];
    if (currentGoals.includes(trimmedGoal)) {
      setError('This career goal already exists.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const newGoals = [...currentGoals, trimmedGoal];
      console.log('Adding career goal:', trimmedGoal);
      console.log('New goals array:', newGoals);
      
      await updateUserProfile({
        careerGoals: newGoals
      });
      
      setNewGoal('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Error adding career goal:', err);
      setError('Failed to add career goal. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const removeGoal = (goalToRemove: string) => {
    updateUserProfile({
      careerGoals: (user.careerGoals || []).filter(goal => goal !== goalToRemove)
    });
  };

  const addProject = () => {
    if (newProject.trim() && !(user.projects || []).includes(newProject.trim())) {
      updateUserProfile({
        projects: [...(user.projects || []), newProject.trim()]
      });
      setNewProject('');
    }
  };

  const removeProject = (projectToRemove: string) => {
    updateUserProfile({
      projects: (user.projects || []).filter(project => project !== projectToRemove)
    });
  };

  const addEducation = () => {
    if (newEducation.trim() && !(user.education || []).includes(newEducation.trim())) {
      updateUserProfile({
        education: [...(user.education || []), newEducation.trim()]
      });
      setNewEducation('');
    }
  };

  const removeEducation = (educationToRemove: string) => {
    updateUserProfile({
      education: (user.education || []).filter(edu => edu !== educationToRemove)
    });
  };

  const handleGenerateJobs = async () => {
    // Check if user has skills - required for generation
    if (!user.skills || user.skills.length === 0) {
      setError('Please add at least one skill to your profile first. You can upload a resume to extract skills automatically.');
      return;
    }

    // Career goal is required
    if (!selectedCareerGoal) {
      setError('Please select a career goal to generate job recommendations.');
      return;
    }

    setIsGeneratingJobs(true);
    try {
      // Use profile data (skills, experience, projects, education) + selected career goal
      // Mark that recommendations have been generated
      localStorage.setItem('job_recommendations_generated', 'true');
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (onNavigate) {
          onNavigate('home');
          // Force refresh by dispatching a custom event
          window.dispatchEvent(new CustomEvent('refreshRecommendations'));
        }
      }, 500);
    } catch (err) {
      console.error('Error generating jobs:', err);
      setError('Failed to generate jobs. Please try again.');
    } finally {
      setIsGeneratingJobs(false);
    }
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
            <CardTitle>Profile</CardTitle>
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
        </CardHeader>
        <CardContent>
          {/* Profile Overview - Simplified: Photo, Name, Bio, Education */}
          <div className="space-y-4">
            {/* Profile Picture and Name */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-2xl font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
                {isEditing && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={user.firstName}
                        onChange={(e) => updateUserProfile({ firstName: e.target.value })}
                        placeholder="First Name"
                        className="w-32"
                      />
                      <Input
                        value={user.lastName}
                        onChange={(e) => updateUserProfile({ lastName: e.target.value })}
                        placeholder="Last Name"
                        className="w-32"
                      />
                    </div>
                    <ProfilePictureUpload
                      currentPicture={user.profilePicture}
                      onUpload={(imageUrl) => updateUserProfile({ profilePicture: imageUrl })}
                      isLoading={isSaving}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="text-sm font-semibold">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={user.bio}
                  onChange={(e) => updateUserProfile({ bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm text-slate-700">{user.bio || 'No bio added yet'}</p>
              )}
            </div>

            {/* Education (University) */}
            <div>
              <Label className="text-sm font-semibold">Education</Label>
              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addEducation();
                        }
                      }}
                      placeholder="Add education/university"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addEducation} disabled={!newEducation.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(user.education && user.education.length > 0) ? user.education.map((edu) => (
                      <Badge key={edu} variant="outline" className="flex items-center gap-1">
                        {edu}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeEducation(edu)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )) : (
                      <p className="text-sm text-slate-500 italic">No education added yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  {(user.education && user.education.length > 0) ? (
                    <div className="flex flex-wrap gap-2">
                      {user.education.map((edu) => (
                        <Badge key={edu} variant="outline">
                          {edu}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No education added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Cancel Editing
              </Button>
            </div>
          )}
          
          {!isEditing && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Removed hardcoded career progress - can be calculated from real data if needed */}
            
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
                <p className="font-medium">Career Goals</p>
                <div className="flex gap-2">
                  <Input
                    id="new-goal-input"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGoal();
                      }
                    }}
                    placeholder="Add career goal"
                    className="w-40"
                  />
                  <Button size="sm" onClick={addGoal} disabled={!newGoal.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(user.careerGoals && user.careerGoals.length > 0) ? user.careerGoals.map((goal) => (
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
                )) : (
                  <p className="text-sm text-slate-500 italic">No career goals added yet</p>
                )}
              </div>
            </div>
      
            {/* Experience Summary Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  <p>Experience Summary</p>
                </div>
          </div>
              {isEditing ? (
                <Textarea
                  value={user.experienceSummary || ''}
                  onChange={(e) => updateUserProfile({ experienceSummary: e.target.value })}
                  placeholder="Describe your work experience..."
                  rows={4}
                  className="resize-y"
                />
              ) : (
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                  {user.experienceSummary || 'No experience summary added yet.'}
                </p>
              )}
            </div>

            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-purple-600" />
                  <p>Projects</p>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      placeholder="Add project"
                      className="w-40"
                    />
                    <Button size="sm" onClick={addProject}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {(user.projects || []).map((project) => (
                  <div key={project} className="flex items-start justify-between p-2 bg-purple-50 rounded border border-purple-100">
                    <p className="text-sm text-slate-700 flex-1">{project}</p>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-transparent"
                        onClick={() => removeProject(project)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {(user.projects || []).length === 0 && (
                  <p className="text-sm text-slate-500 italic">No projects added yet.</p>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-600" />
                  <p>Education</p>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      placeholder="Add education"
                      className="w-40"
                    />
                    <Button size="sm" onClick={addEducation}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {(user.education || []).map((edu) => (
                  <div key={edu} className="flex items-start justify-between p-2 bg-amber-50 rounded border border-amber-100">
                    <p className="text-sm text-slate-700 flex-1">{edu}</p>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-transparent"
                        onClick={() => removeEducation(edu)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
              </div>
            ))}
                {(user.education || []).length === 0 && (
                  <p className="text-sm text-slate-500 italic">No education added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Job Generation Section */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <p className="font-semibold text-slate-900">Generate Job Recommendations</p>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Select a career goal and generate personalized job recommendations based on your profile data (skills, experience, projects, education from resume).
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label htmlFor="career-goal-select" className="text-sm font-semibold text-slate-900 mb-2 block">
                  Select Career Goal: <span className="text-red-500">*</span>
                </Label>
                {user.careerGoals && user.careerGoals.length > 0 ? (
                  <Select
                    value={selectedCareerGoal}
                    onValueChange={setSelectedCareerGoal}
                  >
                    <SelectTrigger id="career-goal-select" className="w-full">
                      <SelectValue placeholder="Choose a career goal..." />
                    </SelectTrigger>
                    <SelectContent>
                      {user.careerGoals.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-amber-600">
                      ⚠️ No career goals found. Please add a career goal above first.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('new-goal-input');
                        if (input) {
                          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          input.focus();
                        }
                      }}
                    >
                      Add Career Goal
                    </Button>
                  </div>
                )}
              </div>

              <Button
                onClick={handleGenerateJobs}
                disabled={isGeneratingJobs || !user.skills || user.skills.length === 0 || !selectedCareerGoal}
                className="w-full bg-blue-500 hover:bg-blue-600 text-slate-900 font-semibold py-6 rounded-lg"
              >
                {isGeneratingJobs ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Job Recommendations
                  </>
                )}
              </Button>

              {(!user.skills || user.skills.length === 0) && (
                <p className="text-xs text-amber-600">
                  ⚠️ Add skills to your profile first. Upload a resume to extract skills automatically.
                </p>
              )}
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
      
          {/* Resume Upload Section */}
          <div className="mt-6">
            <ResumeUpload />
          </div>
    </div>
  );
}