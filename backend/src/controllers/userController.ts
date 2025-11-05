import { Request, Response } from 'express';
import User from '../models/User';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, title, bio, skills, careerGoals, experience, location, profilePicture } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    const updateData: any = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (title !== undefined) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (careerGoals !== undefined) updateData.careerGoals = careerGoals;
    if (experience !== undefined) updateData.experience = experience;
    if (location !== undefined) updateData.location = location;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    res.json({ 
      success: true,
      message: 'Profile updated successfully.',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating profile.' 
    });
  }
};

export const addSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { skill } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    if (!skill) {
      return res.status(400).json({ 
        success: false,
        message: 'Skill is required.' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    if (!user.skills.includes(skill)) {
      user.skills.push(skill);
      await user.save();
    }

    res.json({ 
      success: true,
      message: 'Skill added successfully.',
      skills: user.skills 
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while adding skill.' 
    });
  }
};

export const removeSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { skill } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    if (!skill) {
      return res.status(400).json({ 
        success: false,
        message: 'Skill is required.' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    user.skills = user.skills.filter(s => s !== skill);
    await user.save();

    res.json({ 
      success: true,
      message: 'Skill removed successfully.',
      skills: user.skills 
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while removing skill.' 
    });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    res.json({ 
      success: true,
      message: 'User profile retrieved successfully.',
      user 
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving user profile.' 
    });
  }
};

export const saveJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    if (!jobId) {
      return res.status(400).json({ 
        success: false,
        message: 'Job ID is required.' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found.' 
      });
    }

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({ 
      success: true,
      message: 'Job saved successfully.',
      savedJobs: user.savedJobs 
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while saving job.' 
    });
  }
};

export const removeSavedJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    if (!jobId) {
      return res.status(400).json({ 
        success: false,
        message: 'Job ID is required.' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.json({ 
      success: true,
      message: 'Job removed from saved jobs successfully.',
      savedJobs: user.savedJobs 
    });
  } catch (error) {
    console.error('Remove saved job error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while removing saved job.' 
    });
  }
};

export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    if (!jobId) {
      return res.status(400).json({ 
        success: false,
        message: 'Job ID is required.' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found.' 
      });
    }

    if (!user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
      await user.save();
    }

    res.json({ 
      success: true,
      message: 'Application submitted successfully.',
      appliedJobs: user.appliedJobs 
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while submitting application.' 
    });
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    const user = await User.findById(userId).populate('savedJobs');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    res.json({ 
      success: true,
      message: 'Saved jobs retrieved successfully.',
      savedJobs: user.savedJobs 
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving saved jobs.' 
    });
  }
};

export const getAppliedJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    const user = await User.findById(userId).populate('appliedJobs');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    res.json({ 
      success: true,
      message: 'Applied jobs retrieved successfully.',
      appliedJobs: user.appliedJobs 
    });
  } catch (error) {
    console.error('Get applied jobs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving applied jobs.' 
    });
  }
};
