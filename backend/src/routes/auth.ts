import { Router } from 'express';
import { register, login, getProfile, getCurrentUser, verifyToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verify - Verify JWT token
router.get('/verify', verifyToken);

// GET /api/auth/me - Get current user profile (protected)
router.get('/me', authenticateToken, getCurrentUser);

// GET /api/auth/profile/:id - Get user profile by ID
router.get('/profile/:id', getProfile);

export default router;






