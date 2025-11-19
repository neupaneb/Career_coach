import { Request, Response } from 'express';
import Job from '../models/Job';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getJobRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }
    
    // Get user's skills and preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    // Build query based on user profile data
    const query: any = { isActive: true };

    // Match experience level (entry < mid < senior < executive)
    const experienceLevels = ['entry', 'mid', 'senior', 'executive'];
    const userExpIndex = experienceLevels.indexOf(user.experience);
    if (userExpIndex >= 0) {
      query.experience = { $in: experienceLevels.slice(userExpIndex) };
    }

    // Match skills if user has any
    if (user.skills && user.skills.length > 0) {
      query.skills = { $in: user.skills };
    }

    // Find jobs that match user's profile
    let jobs = await Job.find(query).limit(20);

    // If no jobs found with exact skill match, try broader search
    if (jobs.length === 0 && user.skills && user.skills.length > 0) {
      // Try matching any skill
      jobs = await Job.find({
        isActive: true,
        experience: query.experience,
        skills: { $in: user.skills }
      }).limit(20);
    }

    // If still no jobs, get jobs by experience level only
    if (jobs.length === 0 && query.experience) {
      jobs = await Job.find({
        isActive: true,
        experience: query.experience
      }).limit(20);
    }

    // If still no jobs, get any active jobs
    if (jobs.length === 0) {
      jobs = await Job.find({
        isActive: true
      }).limit(20);
    }

    // Calculate match percentage for each job based on multiple factors
    const recommendations = jobs.map(job => {
      let matchScore = 0;
      let maxScore = 0;

      // Skill matching (60% weight)
      if (user.skills && user.skills.length > 0 && job.skills && job.skills.length > 0) {
        const matchingSkills = job.skills.filter(skill => 
          user.skills.includes(skill)
        ).length;
        const skillMatch = (matchingSkills / job.skills.length) * 60;
        matchScore += skillMatch;
      }
      maxScore += 60;

      // Experience level matching (20% weight)
      if (job.experience === user.experience) {
        matchScore += 20;
      } else {
        const jobExpIndex = experienceLevels.indexOf(job.experience);
        if (jobExpIndex >= 0 && jobExpIndex <= userExpIndex + 1) {
          matchScore += 15; // Close match
        }
      }
      maxScore += 20;

      // Project keywords matching (10% weight) - if user has projects
      if (user.projects && user.projects.length > 0 && job.description) {
        const projectKeywords = user.projects.join(' ').toLowerCase();
        const jobDesc = job.description.toLowerCase();
        const keywordMatches = user.projects.filter(project => 
          jobDesc.includes(project.toLowerCase().substring(0, 20))
        ).length;
        if (keywordMatches > 0) {
          matchScore += Math.min(10, keywordMatches * 3);
        }
      }
      maxScore += 10;

      // Education matching (5% weight) - if user has education
      if (user.education && user.education.length > 0 && job.description) {
        const educationKeywords = user.education.join(' ').toLowerCase();
        const jobDesc = job.description.toLowerCase();
        const eduMatches = user.education.filter(edu => 
          jobDesc.includes(edu.toLowerCase().substring(0, 15))
        ).length;
        if (eduMatches > 0) {
          matchScore += Math.min(5, eduMatches * 2);
        }
      }
      maxScore += 5;

      // Career goals matching (5% weight) - if user has career goals
      if (user.careerGoals && user.careerGoals.length > 0 && job.description) {
        const goalsText = user.careerGoals.join(' ').toLowerCase();
        const jobDesc = job.description.toLowerCase();
        const jobTitle = job.title.toLowerCase();
        const goalMatches = user.careerGoals.filter(goal => {
          const goalLower = goal.toLowerCase();
          return jobDesc.includes(goalLower.substring(0, 20)) || 
                 jobTitle.includes(goalLower.substring(0, 15));
        }).length;
        if (goalMatches > 0) {
          matchScore += Math.min(5, goalMatches * 2);
        }
      }
      maxScore += 5;

      const matchPercentage = Math.round((matchScore / maxScore) * 100);

      return {
        ...job.toObject(),
        matchPercentage
      };
    });

    // Sort by match percentage
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ 
      success: true,
      message: 'Job recommendations retrieved successfully.',
      recommendations 
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving job recommendations.' 
    });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, location, experience, skills } = req.query;
    
    const query: any = { isActive: true };
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (experience) {
      query.experience = experience;
    }
    
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray };
    }

    const jobs = await Job.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ postedDate: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      message: 'Jobs retrieved successfully.',
      jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving jobs.' 
    });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found.' 
      });
    }

    res.json({ 
      success: true,
      message: 'Job retrieved successfully.',
      job 
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving job.' 
    });
  }
};

export const getTrendingSkills = async (req: Request, res: Response) => {
  try {
    // Get skills that appear most frequently in active jobs
    const skillCounts = await Job.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const trendingSkills = skillCounts.map(skill => ({
      skill: skill._id,
      demand: skill.count > 5 ? 'High' : skill.count > 2 ? 'Medium' : 'Low',
      growth: `+${Math.floor(Math.random() * 30) + 10}%` // Mock growth data
    }));

    res.json({ 
      success: true,
      message: 'Trending skills retrieved successfully.',
      trendingSkills 
    });
  } catch (error) {
    console.error('Get trending skills error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving trending skills.' 
    });
  }
};
