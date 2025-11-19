import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import pdf-parse - it exports PDFParse class
const pdfParseLib = require('pdf-parse');
// pdf-parse exports PDFParse as a class, we need to instantiate it
const PDFParse = pdfParseLib.PDFParse || pdfParseLib;

// Configure multer for file uploads
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a PDF resume.'
      });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    // Extract text from PDF
    const pdfBuffer = req.file.buffer;
    const pdfParser = new PDFParse({ data: pdfBuffer });
    const pdfData = await pdfParser.getText();
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF. Please ensure the PDF contains readable text.'
      });
    }

    // Use Gemini AI to extract structured data from resume
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service is not configured.'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    console.log('📄 Extracting text from PDF...');
    console.log('📝 Resume text length:', resumeText.length);
    console.log('📝 First 500 chars:', resumeText.substring(0, 500));

    const prompt = `You are an expert resume parser. Extract the following information from this resume text and return ONLY valid JSON (no markdown, no explanations, just JSON):

Resume Text:
${resumeText.substring(0, 8000)}

Extract and return JSON in this EXACT format (all fields are required):
{
  "skills": ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
  "experience": "3 years of full-stack development experience working with React, Node.js, and MongoDB. Led multiple projects and collaborated with cross-functional teams.",
  "projects": ["E-commerce platform built with React and Node.js", "Real-time chat application using WebSockets", "RESTful API for mobile app"],
  "education": ["Bachelor of Science in Computer Science", "Master of Science in Software Engineering"],
  "summary": "Experienced software developer with expertise in modern web technologies"
}

IMPORTANT:
- Extract ALL technical skills mentioned (programming languages, frameworks, tools, technologies)
- Extract work experience as a 2-3 sentence summary
- Extract ALL projects mentioned (project name and brief description)
- Extract education degrees/certifications
- Extract professional summary if available
- Return ONLY the JSON object, no markdown code blocks, no explanations

JSON:`;

    try {
      console.log('🤖 Calling Gemini AI for resume parsing...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('📥 AI Response received, length:', text.length);
      console.log('📥 First 500 chars of AI response:', text.substring(0, 500));

      // Parse JSON from response
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
      }
      
      // Try to find JSON object in the text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      let extractedData;
      try {
        extractedData = JSON.parse(jsonText);
        console.log('✅ Successfully parsed JSON from AI response');
        console.log('📊 Extracted skills:', extractedData.skills?.length || 0);
        console.log('📊 Extracted projects:', extractedData.projects?.length || 0);
      } catch (parseError: any) {
        console.error('❌ JSON parse error:', parseError.message);
        console.log('📄 Raw AI response:', jsonText.substring(0, 1000));
        // Fallback: try to extract basic info using regex patterns
        console.log('🔄 Falling back to basic extraction...');
        extractedData = extractBasicInfo(resumeText);
      }

      // Ensure all required fields exist
      const responseData = {
        skills: Array.isArray(extractedData.skills) ? extractedData.skills : [],
        experience: extractedData.experience || 'Experience extracted from resume',
        projects: Array.isArray(extractedData.projects) ? extractedData.projects : [],
        education: Array.isArray(extractedData.education) ? extractedData.education : [],
        summary: extractedData.summary || ''
      };

      res.json({
        success: true,
        message: 'Resume parsed successfully.',
        data: responseData
      });
    } catch (aiError: any) {
      console.error('AI parsing error:', aiError);
      // Fallback to basic extraction
      const extractedData = extractBasicInfo(resumeText);
      res.json({
        success: true,
        message: 'Resume parsed with basic extraction.',
        data: extractedData
      });
    }
  } catch (error: any) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume. Please try again.'
    });
  }
};

// Fallback function to extract basic info using regex patterns
function extractBasicInfo(resumeText: string) {
  console.log('🔍 Using fallback extraction method...');
  const skills: string[] = [];
  const projects: string[] = [];
  const education: string[] = [];
  
  // Expanded skill keywords list
  const skillKeywords = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    // Frontend
    'React', 'Angular', 'Vue', 'Next.js', 'HTML', 'CSS', 'SASS', 'SCSS', 'Tailwind', 'Bootstrap', 'jQuery',
    // Backend
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'ASP.NET', 'FastAPI',
    // Databases
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'DynamoDB', 'Oracle',
    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform',
    // Tools & Others
    'Git', 'GitHub', 'GitLab', 'Agile', 'Scrum', 'JIRA', 'Confluence',
    // Technologies
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch', 'REST API', 'GraphQL', 'WebSocket',
    'Microservices', 'Serverless', 'Blockchain', 'Solidity'
  ];

  const lowerText = resumeText.toLowerCase();
  skillKeywords.forEach(skill => {
    const skillLower = skill.toLowerCase();
    // Check for exact word match to avoid false positives
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      skills.push(skill);
    }
  });

  // Extract projects - look for project sections
  const projectPatterns = [
    /(?:projects?|portfolio|work experience|experience)[\s\S]{0,2000}/gi,
    /(?:built|developed|created|designed)[\s\S]{0,300}/gi
  ];
  
  projectPatterns.forEach(pattern => {
    const matches = resumeText.match(pattern);
    if (matches) {
      matches.slice(0, 5).forEach(match => {
        // Clean up the match
        const cleaned = match.replace(/(?:projects?|portfolio|work experience|experience|built|developed|created|designed)[:\s]*/i, '').trim();
        if (cleaned.length > 30 && cleaned.length < 300) {
          projects.push(cleaned.substring(0, 200));
        }
      });
    }
  });

  // Extract education
  const educationPatterns = [
    /(?:bachelor|master|phd|doctorate|degree|b\.?s\.?|m\.?s\.?|ph\.?d\.?)[\s\S]{0,200}/gi,
    /(?:university|college|institute)[\s\S]{0,150}/gi
  ];
  
  educationPatterns.forEach(pattern => {
    const matches = resumeText.match(pattern);
    if (matches) {
      matches.slice(0, 3).forEach(match => {
        const cleaned = match.trim();
        if (cleaned.length > 10 && cleaned.length < 200) {
          education.push(cleaned.substring(0, 150));
        }
      });
    }
  });

  // Extract experience summary
  const experiencePatterns = [
    /(?:experience|work history|employment)[\s\S]{0,1000}/gi,
    /(?:years? of|experience in|worked as|role as)[\s\S]{0,500}/gi
  ];
  
  let experienceSummary = '';
  experiencePatterns.forEach(pattern => {
    const matches = resumeText.match(pattern);
    if (matches && matches.length > 0) {
      const firstMatch = matches[0].substring(0, 300);
      if (firstMatch.length > 50) {
        experienceSummary = firstMatch;
      }
    }
  });

  if (!experienceSummary) {
    // Try to extract years of experience
    const yearsMatch = resumeText.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
    if (yearsMatch) {
      experienceSummary = `${yearsMatch[1]} years of professional experience`;
    } else {
      experienceSummary = 'Professional experience extracted from resume';
    }
  }

  const result = {
    skills: [...new Set(skills)], // Remove duplicates
    experience: experienceSummary,
    projects: [...new Set(projects)].slice(0, 5), // Limit to 5 projects, remove duplicates
    education: [...new Set(education)].slice(0, 3), // Limit to 3 education entries
    summary: ''
  };

  console.log('📊 Fallback extraction results:');
  console.log('  - Skills found:', result.skills.length);
  console.log('  - Projects found:', result.projects.length);
  console.log('  - Education found:', result.education.length);

  return result;
}

