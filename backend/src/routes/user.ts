import { Router } from 'express';
import { 
  updateProfile, 
  addSkill, 
  removeSkill, 
  getCurrentUser,
  saveJob,
  removeSavedJob,
  applyToJob,
  getSavedJobs,
  getAppliedJobs
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/user/me
router.get('/me', getCurrentUser);

// PUT /api/user/profile
router.put('/profile', updateProfile);

// POST /api/user/skills
router.post('/skills', addSkill);

// DELETE /api/user/skills
router.delete('/skills', removeSkill);

// Job management routes
// POST /api/user/save-job
router.post('/save-job', saveJob);

// DELETE /api/user/saved-job
router.delete('/saved-job', removeSavedJob);

// POST /api/user/apply-job
router.post('/apply-job', applyToJob);

// GET /api/user/saved-jobs
router.get('/saved-jobs', getSavedJobs);

// GET /api/user/applied-jobs
router.get('/applied-jobs', getAppliedJobs);

export default router;


