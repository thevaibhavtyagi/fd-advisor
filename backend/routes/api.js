/**
 * API Routes
 */

import { Router } from 'express';
import { analyzeOffer } from '../controllers/aiController.js';
import { createLead, getLeadByPhone } from '../controllers/leadController.js';

const router = Router();

// AI Analysis endpoint
// POST /api/analyze
// Body: { userMessage: string, language: 'en' | 'hi' | 'mr' }
router.post('/analyze', analyzeOffer);

// Lead/Booking endpoints
// POST /api/book
// Body: { phoneNumber, fullName, panNumber, bankName, investmentAmount, ... }
router.post('/book', createLead);

// GET /api/lead/:phoneNumber
router.get('/lead/:phoneNumber', getLeadByPhone);

export default router;
