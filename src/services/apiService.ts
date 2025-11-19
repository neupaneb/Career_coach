// API service for Career Coach AI
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem('career_coach_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle abort (timeout)
      if (error.name === 'AbortError') {
        console.error('API request timeout:', endpoint);
        throw new Error('Request timeout. Please check your connection.');
      }
      
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('career_coach_token', response.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('career_coach_token', response.token);
    }

    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('career_coach_token');
    localStorage.removeItem('career_coach_user');
  }

  // User profile methods
  async getCurrentUser() {
    return this.request('/user/me');
  }

  async updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    title?: string;
    bio?: string;
    location?: string;
    experience?: string;
    skills?: string[];
    careerGoals?: string[];
  }) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async addSkill(skill: string) {
    return this.request('/user/skills', {
      method: 'POST',
      body: JSON.stringify({ skill }),
    });
  }

  async removeSkill(skill: string) {
    return this.request('/user/skills', {
      method: 'DELETE',
      body: JSON.stringify({ skill }),
    });
  }

  // Job methods
  async saveJob(jobId: string) {
    return this.request('/user/save-job', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  async removeSavedJob(jobId: string) {
    return this.request('/user/saved-job', {
      method: 'DELETE',
      body: JSON.stringify({ jobId }),
    });
  }

  async applyToJob(jobId: string) {
    return this.request('/user/apply-job', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  async getSavedJobs() {
    return this.request('/user/saved-jobs');
  }

  async getAppliedJobs() {
    return this.request('/user/applied-jobs');
  }

  // Career methods
  async getJobRecommendations() {
    return this.request('/career/recommendations');
  }

  async getAllJobs() {
    return this.request('/career/jobs');
  }

  async getJobById(jobId: string) {
    return this.request(`/career/jobs/${jobId}`);
  }

  async getTrendingSkills() {
    return this.request('/career/trending-skills');
  }

  // Resume upload
  async uploadResume(formData: FormData) {
    const url = `${API_BASE_URL}/user/upload-resume`;
    // Get fresh token from localStorage in case it was updated
    const token = localStorage.getItem('career_coach_token') || this.token;
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - browser will set it automatically with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        // Token might be invalid, clear it
        this.token = null;
        localStorage.removeItem('career_coach_token');
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

export const apiService = new ApiService();
export default apiService;



