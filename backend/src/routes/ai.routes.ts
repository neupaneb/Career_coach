import { Router } from 'express';
import { generateCareerAdvice } from '../controllers/careerAI.controller';

const router = Router();

// POST /api/ai/recommend - Generate career advice using AI
router.post('/recommend', generateCareerAdvice);

export default router;

