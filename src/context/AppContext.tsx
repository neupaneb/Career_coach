import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  location: string;
  bio: string;
  profilePicture?: string;
  experience: string;
  skills: string[];
  careerGoals: string[];
  createdAt: string;
  updatedAt: string;
}

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  type: string;
  postedDays: number;
  savedDate: string;
}

interface AppContextType {
  user: User | null;
  savedJobs: SavedJob[];
  appliedJobs: number[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  addSavedJob: (job: SavedJob) => void;
  removeSavedJob: (jobId: number) => void;
  addAppliedJob: (jobId: number) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  USER: 'career_coach_user',
  SAVED_JOBS: 'career_coach_saved_jobs',
  APPLIED_JOBS: 'career_coach_applied_jobs',
  USERS: 'career_coach_users' // For demo purposes, store all users
};

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const validateUserData = (userData: Partial<User>): string[] => {
  const errors: string[] = [];
  
  if (userData.firstName && userData.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (userData.lastName && userData.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }
  
  if (userData.email && !validateEmail(userData.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (userData.password && !validatePassword(userData.password)) {
    errors.push('Password must be at least 6 characters');
  }
  
  return errors;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data from API on mount
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const loadUserData = async () => {
      try {
        if (apiService.isAuthenticated()) {
          setIsLoading(true);
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Request timeout')), 5000);
          });

          const response = await Promise.race([
            apiService.getCurrentUser(),
            timeoutPromise
          ]) as any;

          if (isMounted && response?.user) {
            setUser(response.user);
            
            // Load saved and applied jobs with timeout
            try {
              const [savedResponse, appliedResponse] = await Promise.all([
                Promise.race([
                  apiService.getSavedJobs(),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]),
                Promise.race([
                  apiService.getAppliedJobs(),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ])
              ]) as any[];
              
              if (isMounted) {
                setSavedJobs(savedResponse?.savedJobs || []);
                setAppliedJobs(appliedResponse?.appliedJobs || []);
              }
            } catch (jobError) {
              console.warn('Failed to load jobs, using localStorage:', jobError);
            }
          }
        } else {
          // Not authenticated, try localStorage
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
          const storedSavedJobs = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
          const storedAppliedJobs = localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS);
          
          if (isMounted) {
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
              } catch (e) {
                console.error('Failed to parse stored user:', e);
              }
            }
            if (storedSavedJobs) {
              try {
                setSavedJobs(JSON.parse(storedSavedJobs));
              } catch (e) {
                console.error('Failed to parse stored saved jobs:', e);
              }
            }
            if (storedAppliedJobs) {
              try {
                setAppliedJobs(JSON.parse(storedAppliedJobs));
              } catch (e) {
                console.error('Failed to parse stored applied jobs:', e);
              }
            }
          }
        }
      } catch (error: any) {
        console.error('Error loading user data from API, falling back to localStorage:', error);
        // Fall back to localStorage if API is not available
        if (isMounted) {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
          const storedSavedJobs = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
          const storedAppliedJobs = localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS);
          
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('Failed to parse stored user:', e);
            }
          }
          if (storedSavedJobs) {
            try {
              setSavedJobs(JSON.parse(storedSavedJobs));
            } catch (e) {
              console.error('Failed to parse stored saved jobs:', e);
            }
          }
          if (storedAppliedJobs) {
            try {
              setAppliedJobs(JSON.parse(storedAppliedJobs));
            } catch (e) {
              console.error('Failed to parse stored applied jobs:', e);
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    loadUserData();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.login(email, password);
      
      if (response.success) {
        setUser(response.user);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      console.error('API login failed, falling back to localStorage:', error);
      // Fall back to localStorage for demo purposes
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate user data
      const validationErrors = validateUserData(userData);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return false;
      }

      const response = await apiService.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password
      });
      
      if (response.success) {
        setUser(response.user);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      console.error('API registration failed, falling back to localStorage:', error);
      // Fall back to localStorage for demo purposes
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === userData.email)) {
        setError('User with this email already exists');
        return false;
      }
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setSavedJobs([]);
    setAppliedJobs([]);
  };

  const addSavedJob = async (job: SavedJob) => {
    try {
      await apiService.saveJob(job.id.toString());
      setSavedJobs(prev => {
        const exists = prev.find(j => j.id === job.id);
        if (!exists) {
          return [...prev, job];
        }
        return prev;
      });
    } catch (error: any) {
      console.error('API save job failed, falling back to localStorage:', error);
      // Fall back to localStorage
      setSavedJobs(prev => {
        const exists = prev.find(j => j.id === job.id);
        if (!exists) {
          const newSavedJobs = [...prev, job];
          localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(newSavedJobs));
          return newSavedJobs;
        }
        return prev;
      });
    }
  };

  const removeSavedJob = async (jobId: number) => {
    try {
      await apiService.removeSavedJob(jobId.toString());
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error: any) {
      console.error('API remove saved job failed, falling back to localStorage:', error);
      // Fall back to localStorage
      setSavedJobs(prev => {
        const newSavedJobs = prev.filter(job => job.id !== jobId);
        localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(newSavedJobs));
        return newSavedJobs;
      });
    }
  };

  const addAppliedJob = async (jobId: number) => {
    try {
      await apiService.applyToJob(jobId.toString());
      if (!appliedJobs.includes(jobId)) {
        setAppliedJobs(prev => [...prev, jobId]);
      }
    } catch (error: any) {
      console.error('API apply to job failed, falling back to localStorage:', error);
      // Fall back to localStorage
      if (!appliedJobs.includes(jobId)) {
        setAppliedJobs(prev => {
          const newAppliedJobs = [...prev, jobId];
          localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(newAppliedJobs));
          return newAppliedJobs;
        });
      }
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (user) {
      const validationErrors = validateUserData(updates);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      try {
        const response = await apiService.updateProfile(updates);
        setUser(response.user);
      } catch (error: any) {
        console.error('API update profile failed, falling back to localStorage:', error);
        // Fall back to localStorage
        const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      savedJobs,
      appliedJobs,
      isLoading,
      error,
      setUser,
      addSavedJob,
      removeSavedJob,
      addAppliedJob,
      updateUserProfile,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}