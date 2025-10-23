import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, skills, careerGoals, experience, location } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updateData: any = {};
    
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (skills) updateData.skills = skills;
    if (careerGoals) updateData.careerGoals = careerGoals;
    if (experience) updateData.experience = experience;
    if (location) updateData.location = location;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { skill } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!skill) {
      return res.status(400).json({ message: 'Skill is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.skills.includes(skill)) {
      user.skills.push(skill);
      await user.save();
    }

    res.json({ message: 'Skill added successfully', skills: user.skills });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { skill } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!skill) {
      return res.status(400).json({ message: 'Skill is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skills = user.skills.filter(s => s !== skill);
    await user.save();

    res.json({ message: 'Skill removed successfully', skills: user.skills });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const saveJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeSavedJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.json({ message: 'Job removed from saved jobs', savedJobs: user.savedJobs });
  } catch (error) {
    console.error('Remove saved job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
      await user.save();
    }

    res.json({ message: 'Application submitted successfully', appliedJobs: user.appliedJobs });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId).populate('savedJobs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ savedJobs: user.savedJobs });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAppliedJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId).populate('appliedJobs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ appliedJobs: user.appliedJobs });
  } catch (error) {
    console.error('Get applied jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
