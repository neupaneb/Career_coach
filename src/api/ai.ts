// AI API service for Career Coach AI
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5001/api';

export interface CareerAdviceRequest {
  skills: string;
  experience: string;
  goals: string;
}

export interface RecommendedRole {
  title: string;
  description: string;
  matchScore: string;
}

export interface SkillToDevelop {
  skill: string;
  priority: string;
  reason: string;
}

export interface LearningPath {
  path: string;
  resources: string[];
  timeline: string;
}

export interface CareerAdviceResponse {
  success: boolean;
  message?: string;
  advice: string;
  recommendedRoles: RecommendedRole[];
  skillsToDevelop: SkillToDevelop[];
  learningPaths: LearningPath[];
}

export const getCareerAdvice = async (data: CareerAdviceRequest): Promise<CareerAdviceResponse> => {
  const url = `${API_BASE_URL}/ai/recommend`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Failed to connect to the server. Please make sure the backend server is running on port 5001.');
    }
    throw error;
  }
};

