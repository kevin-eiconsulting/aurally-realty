import { Router } from 'express';
import { createEnquiry, getEnquiries } from '../controllers/enquiries.controller.js';
import { optionalAuth, verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', optionalAuth, createEnquiry);
router.get('/', verifyToken, requireRole('admin'), getEnquiries);

export default router;
