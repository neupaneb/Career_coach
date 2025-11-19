import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Briefcase, BookOpen, TrendingUp, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { useAIRecommendations } from '../context/AIRecommendationsContext';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { CareerRecommendations } from './CareerRecommendations';

export function CareerPaths() {
  const { recommendations } = useAIRecommendations();
  const { addSavedJob } = useApp();
  const [savedRoles, setSavedRoles] = useState<Set<number>>(new Set());

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

  return (
    <div className="space-y-6">
      {/* AI Recommendations Section */}
      {recommendations && recommendations.recommendedRoles.length > 0 ? (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl font-bold text-slate-900">AI Career Recommendations</CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Personalized career paths based on your AI Career Advisor analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.advice && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-blue-100">
                  <p className="text-slate-700 leading-relaxed">{recommendations.advice}</p>
                </div>
              )}

              {/* Recommended Roles */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Recommended Career Paths
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.recommendedRoles.map((role, index) => (
                    <Card key={index} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
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
                              id: Date.now() + index,
                              title: role.title,
                              company: 'AI Recommended Career Path',
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
                          {savedRoles.has(index) ? 'Saved' : 'Save Career Path'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Skills to Develop */}
              {recommendations.skillsToDevelop && recommendations.skillsToDevelop.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Skills to Develop
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.skillsToDevelop.map((skill, index) => (
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
              {recommendations.learningPaths && recommendations.learningPaths.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Learning Paths
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.learningPaths.map((path, index) => (
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
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No AI Recommendations Yet</h3>
            <p className="text-slate-600 mb-4">
              Get personalized career recommendations by using the AI Career Advisor.
            </p>
            <p className="text-sm text-slate-500">
              Navigate to "AI Career Advisor" in the sidebar to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Regular Job Recommendations */}
      <div className="mt-8">
        <CareerRecommendations />
      </div>
    </div>
  );
}

