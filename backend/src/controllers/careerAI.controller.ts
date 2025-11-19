import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateCareerAdvice = async (req: Request, res: Response) => {
  try {
    const { skills, experience, goals } = req.body;

    // Validate input
    if (!skills || !experience || !goals) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please provide skills, experience, and goals.'
      });
    }

    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service is not configured. Please contact support.'
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Free Gemini API models (as of 2024)
    // Try common model names in order of preference
    const modelNames = [
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      // Fallback to older models if available
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];
    
    let model;
    let lastError: any = null;
    
    // Use the first model - we'll handle errors during generation
    // This avoids delays from testing multiple models
    const modelName = modelNames[0];
    model = genAI.getGenerativeModel({ model: modelName });
    console.log(`✅ Using model: ${modelName}`);

    // Create structured prompt
    const prompt = `You are an expert career coach. Based on the following information, provide personalized career advice:

Skills: ${skills}
Experience Level: ${experience}
Career Goals: ${goals}

Please provide a comprehensive career advice response in the following JSON format:
{
  "advice": "A detailed paragraph (3-4 sentences) with personalized career advice based on the user's profile",
  "recommendedRoles": [
    {
      "title": "Job Title",
      "description": "Brief description of why this role fits",
      "matchScore": "High/Medium/Low"
    }
  ],
  "skillsToDevelop": [
    {
      "skill": "Skill Name",
      "priority": "High/Medium/Low",
      "reason": "Why this skill is important"
    }
  ],
  "learningPaths": [
    {
      "path": "Learning path name",
      "resources": ["Resource 1", "Resource 2"],
      "timeline": "Estimated timeline"
    }
  ]
}

Make sure the response is valid JSON only, no markdown formatting.`;

    // Generate content - try models in order if one fails
    let result;
    let response;
    let text;
    let generationError: any = null;
    
    for (let i = 0; i < modelNames.length; i++) {
      const currentModelName = modelNames[i];
      try {
        const currentModel = genAI.getGenerativeModel({ model: currentModelName });
        console.log(`🔄 Attempting generation with: ${currentModelName}`);
        result = await currentModel.generateContent(prompt);
        response = await result.response;
        text = response.text();
        console.log(`✅ Successfully generated content with: ${currentModelName}`);
        break;
      } catch (err: any) {
        generationError = err;
        console.log(`❌ Model ${currentModelName} failed: ${err.message?.substring(0, 100)}`);
        if (i < modelNames.length - 1) {
          console.log(`🔄 Trying next model...`);
          continue;
        } else {
          // Last model failed
          throw new Error(
            `All Gemini models failed. Tried: ${modelNames.join(', ')}. ` +
            `Last error: ${err.message || 'Unknown error'}. ` +
            `Please check your API key and ensure it has access to Gemini models.`
          );
        }
      }
    }
    
    if (!text) {
      throw new Error(
        `Failed to generate content. Error: ${generationError?.message || 'Unknown error'}`
      );
    }

    // Parse JSON from response (remove markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    let careerData;
    try {
      careerData = JSON.parse(jsonText);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      console.error('Failed to parse JSON from AI response:', parseError);
      careerData = {
        advice: text.substring(0, 500) || "Based on your skills and goals, I recommend focusing on continuous learning and skill development in your chosen field.",
        recommendedRoles: [
          {
            title: "Senior Developer",
            description: "Matches your experience level and skills",
            matchScore: "High"
          }
        ],
        skillsToDevelop: [
          {
            skill: "Advanced Technical Skills",
            priority: "High",
            reason: "Essential for career growth"
          }
        ],
        learningPaths: [
          {
            path: "Online Courses",
            resources: ["Coursera", "Udemy", "edX"],
            timeline: "3-6 months"
          }
        ]
      };
    }

    // Ensure all required fields exist
    const responseData = {
      advice: careerData.advice || "Based on your profile, I recommend focusing on continuous skill development and networking in your field.",
      recommendedRoles: Array.isArray(careerData.recommendedRoles) ? careerData.recommendedRoles : [],
      skillsToDevelop: Array.isArray(careerData.skillsToDevelop) ? careerData.skillsToDevelop : [],
      learningPaths: Array.isArray(careerData.learningPaths) ? careerData.learningPaths : []
    };

    res.json({
      success: true,
      message: 'Career advice generated successfully.',
      ...responseData
    });
  } catch (error: any) {
    console.error('Error generating career advice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate career advice. Please try again later.'
    });
  }
};

