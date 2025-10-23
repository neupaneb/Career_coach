import { Router } from 'express';
import { getJobRecommendations, getAllJobs, getJobById, getTrendingSkills } from '../controllers/careerController';

const router = Router();

// GET /api/career/recommendations/:userId
router.get('/recommendations/:userId', getJobRecommendations);

// GET /api/career/jobs
router.get('/jobs', getAllJobs);

// GET /api/career/jobs/:id
router.get('/jobs/:id', getJobById);

// GET /api/career/trending-skills
router.get('/trending-skills', getTrendingSkills);

export default router;






