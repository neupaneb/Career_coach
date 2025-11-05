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

    // Find jobs that match user's skills and experience level
    const jobs = await Job.find({
      isActive: true,
      experience: { $lte: user.experience },
      skills: { $in: user.skills }
    }).limit(10);

    // Calculate match percentage for each job
    const recommendations = jobs.map(job => {
      const matchingSkills = job.skills.filter(skill => 
        user.skills.includes(skill)
      ).length;
      const matchPercentage = Math.round((matchingSkills / job.skills.length) * 100);

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
