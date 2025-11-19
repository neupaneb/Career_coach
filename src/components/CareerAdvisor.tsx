import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Sparkles, Briefcase, BookOpen, TrendingUp, CheckCircle, AlertCircle, Heart } from 'lucide-react';
import { getCareerAdvice, CareerAdviceResponse } from '../api/ai';
import { useAIRecommendations } from '../context/AIRecommendationsContext';
import { useApp } from '../context/AppContext';

export function CareerAdvisor() {
  const { setRecommendations } = useAIRecommendations();
  const { addSavedJob } = useApp();
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [adviceData, setAdviceData] = useState<CareerAdviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedRoles, setSavedRoles] = useState<Set<number>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAdviceData(null);

    try {
      const response = await getCareerAdvice({
        skills,
        experience,
        goals,
      });
      setAdviceData(response);
      // Store recommendations in context for Career Paths page
      if (response.recommendedRoles) {
        setRecommendations({
          recommendedRoles: response.recommendedRoles,
          skillsToDevelop: response.skillsToDevelop || [],
          learningPaths: response.learningPaths || [],
          advice: response.advice
        });
      }
    } catch (err: any) {
      console.error('Career advice error:', err);
      const errorMessage = err.message || 'Failed to generate career advice. Please try again.';
      
      // Provide more helpful error messages
      if (errorMessage.includes('Failed to connect') || errorMessage.includes('fetch')) {
        setError('Cannot connect to the server. Please make sure the backend server is running on port 5001.');
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        setError('Access denied. Please restart the backend server to apply CORS fixes.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMatchScoreColor = (score: string) => {
    switch (score.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold text-slate-900">AI Career Advisor</CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            Get personalized career advice powered by Gemini AI. Share your skills, experience, and goals to receive tailored recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-base font-semibold text-slate-700">
                Your Skills
              </Label>
              <Textarea
                id="skills"
                placeholder="e.g., React, TypeScript, Node.js, MongoDB, Express.js, RESTful APIs..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
                rows={4}
                className="resize-y min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-base font-semibold text-slate-700">
                Experience Level
              </Label>
              <Textarea
                id="experience"
                placeholder="e.g., 3 years of full-stack development, worked on multiple React projects, experience with MongoDB..."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                rows={4}
                className="resize-y min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals" className="text-base font-semibold text-slate-700">
                Career Goals
              </Label>
              <Textarea
                id="goals"
                placeholder="e.g., Become a senior full-stack developer, work at a tech startup, learn cloud technologies..."
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                required
                rows={4}
                className="resize-y min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-slate-900 font-semibold py-6 text-base rounded-lg relative z-10 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Advice...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Career Advice
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {adviceData && (
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Career Advice */}
          <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <CardTitle className="text-xl font-bold text-slate-900">Personalized Career Advice</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{adviceData.advice}</p>
            </CardContent>
          </Card>

          {/* Recommended Roles */}
          {adviceData.recommendedRoles && adviceData.recommendedRoles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Recommended Roles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adviceData.recommendedRoles.map((role, index) => (
                  <Card key={index} className="bg-white border-slate-200 hover:shadow-lg transition-shadow relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-bold text-slate-900">{role.title}</CardTitle>
                        <Badge className={getMatchScoreColor(role.matchScore)}>
                          {role.matchScore} Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{role.description}</p>
                      <Button
                        size="sm"
                        variant={savedRoles.has(index) ? "outline" : "default"}
                        onClick={() => {
                          const savedJob = {
                            id: Date.now() + index, // Generate unique ID
                            title: role.title,
                            company: 'AI Recommended',
                            location: 'Various',
                            salary: 'Competitive',
                            skills: [],
                            type: 'Full-time',
                            postedDays: 0,
                            savedDate: new Date().toISOString().split('T')[0]
                          };
                          addSavedJob(savedJob);
                          setSavedRoles(prev => new Set([...prev, index]));
                        }}
                        className="w-full"
                      >
                        <Heart className={`h-4 w-4 mr-2 ${savedRoles.has(index) ? 'fill-current' : ''}`} />
                        {savedRoles.has(index) ? 'Saved' : 'Save as Job Interest'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Skills to Develop */}
          {adviceData.skillsToDevelop && adviceData.skillsToDevelop.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Skills to Develop
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adviceData.skillsToDevelop.map((skill, index) => (
                  <Card key={index} className="bg-white border-slate-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900">{skill.skill}</CardTitle>
                        <Badge className={getPriorityColor(skill.priority)}>
                          {skill.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-sm">{skill.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Learning Paths */}
          {adviceData.learningPaths && adviceData.learningPaths.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Learning Paths
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adviceData.learningPaths.map((path, index) => (
                  <Card key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-slate-900">{path.path}</CardTitle>
                      <CardDescription className="text-slate-600">
                        Timeline: {path.timeline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Resources:</p>
                        <ul className="space-y-1">
                          {path.resources.map((resource, resIndex) => (
                            <li key={resIndex} className="flex items-center gap-2 text-sm text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

