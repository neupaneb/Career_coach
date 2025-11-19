import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X, Star, Briefcase, FolderKanban, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';

interface ExtractedData {
  skills: string[];
  experience: string;
  projects: string[];
  education?: string[];
  summary?: string;
}

export function ResumeUpload() {
  const { user, updateUserProfile } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load extracted data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resume_extracted_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setExtractedData(parsed);
      } catch (e) {
        console.error('Failed to load saved resume data:', e);
      }
    }
  }, []);

  // Save extracted data to localStorage
  useEffect(() => {
    if (extractedData) {
      localStorage.setItem('resume_extracted_data', JSON.stringify(extractedData));
    } else {
      localStorage.removeItem('resume_extracted_data');
    }
  }, [extractedData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
        setError('Please upload a PDF file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setExtractedData(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      console.log('📤 Uploading resume...', file.name);
      const response = await apiService.uploadResume(formData);
      
      console.log('📥 Resume upload response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Resume parsed successfully!');
        console.log('📊 Extracted data:', {
          skills: response.data.skills?.length || 0,
          projects: response.data.projects?.length || 0,
          hasExperience: !!response.data.experience,
          education: response.data.education?.length || 0
        });
        
      setExtractedData(response.data);
      // Save to localStorage for persistence
      localStorage.setItem('resume_extracted_data', JSON.stringify(response.data));
      setSuccess(`✅ Resume parsed successfully! Found ${response.data.skills?.length || 0} skills, ${response.data.projects?.length || 0} projects, and experience summary. Review and apply below.`);
      } else {
        setError(response.message || 'Failed to parse resume');
      }
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setError(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyExtractedData = async () => {
    if (!extractedData) return;

    try {
      const updates: any = {};
      
      if (extractedData.skills && extractedData.skills.length > 0) {
        // Merge with existing skills, avoiding duplicates
        const existingSkills = user?.skills || [];
        const newSkills = [...new Set([...existingSkills, ...extractedData.skills])];
        updates.skills = newSkills;
      }

      if (extractedData.experience) {
        updates.experienceSummary = extractedData.experience;
      }

      if (extractedData.projects && extractedData.projects.length > 0) {
        const existingProjects = user?.projects || [];
        const newProjects = [...new Set([...existingProjects, ...extractedData.projects])];
        updates.projects = newProjects;
      }

      if (extractedData.education && extractedData.education.length > 0) {
        const existingEducation = user?.education || [];
        const newEducation = [...new Set([...existingEducation, ...extractedData.education])];
        updates.education = newEducation;
      }

      await updateUserProfile(updates);
      setSuccess('✅ Profile updated successfully! Extracted skills, experience, projects, and education have been added to your profile.');
      // Keep extracted data visible for review, but clear file
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Optionally clear extracted data after a delay
      setTimeout(() => {
        setExtractedData(null);
        localStorage.removeItem('resume_extracted_data');
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-purple-600" />
          <CardTitle className="text-xl font-bold">Upload & Parse Resume</CardTitle>
        </div>
        <CardDescription className="text-base mt-2">
          Upload your PDF resume to automatically extract skills, experience, projects, and education using AI-powered parsing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {!extractedData ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors bg-slate-50/50">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <Upload className="h-16 w-16 mx-auto mb-4 text-purple-500" />
                <p className="text-base font-semibold text-slate-800 mb-2">
                  {file ? `📄 ${file.name}` : '📤 Click to upload or drag and drop your resume'}
                </p>
                <p className="text-sm text-slate-600 mb-4">PDF format only • Maximum 5MB</p>
                <div className="text-sm text-slate-700 space-y-2 mt-6 pt-4 border-t border-slate-300">
                  <p className="font-bold text-slate-900">✨ What will be extracted:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs font-medium border border-blue-200">💻 Skills</span>
                    <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md text-xs font-medium border border-green-200">💼 Experience</span>
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-md text-xs font-medium border border-purple-200">🚀 Projects</span>
                    <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-md text-xs font-medium border border-amber-200">🎓 Education</span>
                  </div>
                </div>
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <span className="text-sm text-slate-700">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {file && (
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-slate-900 font-semibold py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Parsing Resume with AI...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Extract Skills, Experience & Projects
                  </>
                )}
              </Button>
            )}
            
            {!file && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500">Select a PDF file above to begin extraction</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg text-slate-900">Extracted Information</h4>
                <p className="text-xs text-slate-500 mt-1">Review the extracted data below and apply to your profile</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setExtractedData(null);
                  setFile(null);
                  localStorage.removeItem('resume_extracted_data');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>

            {extractedData.skills && extractedData.skills.length > 0 ? (
              <div className="border rounded-lg p-4 bg-blue-50/50">
                <p className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  Skills Found ({extractedData.skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-slate-50">
                <p className="text-sm text-slate-500">No skills extracted from resume</p>
              </div>
            )}

            {extractedData.experience && (
              <div className="border rounded-lg p-4 bg-green-50/50">
                <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  Experience Summary
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{extractedData.experience}</p>
              </div>
            )}

            {extractedData.projects && extractedData.projects.length > 0 ? (
              <div className="border rounded-lg p-4 bg-purple-50/50">
                <p className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-purple-600" />
                  Projects Found ({extractedData.projects.length})
                </p>
                <div className="space-y-2">
                  {extractedData.projects.map((project, idx) => (
                    <div key={idx} className="text-sm text-slate-700 bg-white p-3 rounded border border-purple-100">
                      <span className="font-medium text-purple-700">Project {idx + 1}:</span> {project}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-slate-50">
                <p className="text-sm text-slate-500">No projects extracted from resume</p>
              </div>
            )}

            {extractedData.education && extractedData.education.length > 0 && (
              <div className="border rounded-lg p-4 bg-amber-50/50">
                <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-600" />
                  Education ({extractedData.education.length})
                </p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {extractedData.education.map((edu, idx) => (
                    <li key={idx}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}

            {extractedData.summary && (
              <div className="border rounded-lg p-4 bg-indigo-50/50">
                <p className="text-sm font-semibold text-slate-900 mb-2">Professional Summary</p>
                <p className="text-sm text-slate-700 leading-relaxed">{extractedData.summary}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                onClick={handleApplyExtractedData}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-slate-900 font-semibold py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Apply to Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setExtractedData(null);
                  setFile(null);
                  localStorage.removeItem('resume_extracted_data');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

