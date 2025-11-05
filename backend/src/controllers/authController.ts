import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { validateEmail, validatePassword } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields. Please provide email, password, first name, and last name.' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format. Please enter a valid email address.' 
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long.' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'Account already exists with this email address. Please try logging in instead.' 
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      skills: [],
      careerGoals: [],
      experience: 'entry',
      location: '',
      title: '',
      bio: ''
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Career Coach AI.',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        location: user.location,
        bio: user.bio,
        profilePicture: user.profilePicture,
        skills: user.skills,
        careerGoals: user.careerGoals,
        experience: user.experience,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration. Please try again later.' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing credentials. Please provide both email and password.' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format. Please enter a valid email address.' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Account not found. Please check your email address or create a new account.' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Incorrect password. Please check your password and try again.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful! Welcome back to Career Coach AI.',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        location: user.location,
        bio: user.bio,
        profilePicture: user.profilePicture,
        skills: user.skills,
        careerGoals: user.careerGoals,
        experience: user.experience,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login. Please try again later.' 
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User profile not found.' 
      });
    }

    res.json({ 
      success: true,
      message: 'Profile retrieved successfully.',
      user 
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving profile.' 
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.' 
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User profile not found.' 
      });
    }

    res.json({ 
      success: true,
      message: 'Profile retrieved successfully.',
      user 
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while retrieving profile.' 
    });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token. User not found.' 
      });
    }

    res.json({ 
      success: true,
      message: 'Token is valid.',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        location: user.location,
        bio: user.bio,
        profilePicture: user.profilePicture,
        skills: user.skills,
        careerGoals: user.careerGoals,
        experience: user.experience,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token. Please log in again.' 
    });
  }
};
