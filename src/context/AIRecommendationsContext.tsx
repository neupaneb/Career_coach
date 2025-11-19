import { createContext, useContext, useState, ReactNode } from 'react';

interface RecommendedRole {
  title: string;
  description: string;
  matchScore: string;
}

interface AIRecommendations {
  recommendedRoles: RecommendedRole[];
  skillsToDevelop: Array<{
    skill: string;
    priority: string;
    reason: string;
  }>;
  learningPaths: Array<{
    path: string;
    resources: string[];
    timeline: string;
  }>;
  advice: string;
}

interface AIRecommendationsContextType {
  recommendations: AIRecommendations | null;
  setRecommendations: (recommendations: AIRecommendations | null) => void;
}

const AIRecommendationsContext = createContext<AIRecommendationsContextType | undefined>(undefined);

export function AIRecommendationsProvider({ children }: { children: ReactNode }) {
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);

  return (
    <AIRecommendationsContext.Provider value={{ recommendations, setRecommendations }}>
      {children}
    </AIRecommendationsContext.Provider>
  );
}

export function useAIRecommendations() {
  const context = useContext(AIRecommendationsContext);
  if (context === undefined) {
    throw new Error('useAIRecommendations must be used within an AIRecommendationsProvider');
  }
  return context;
}

