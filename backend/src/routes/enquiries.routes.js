import { Router } from 'express';
import { 
  createEnquiry, 
  getUserEnquiries, 
  getEnquiries,
  updateEnquiryStatus 
} from '../controllers/enquiries.controller.js';
import { optionalAuth, verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', optionalAuth, createEnquiry);
router.get('/my', verifyToken, getUserEnquiries);
router.patch('/:id/status', verifyToken, updateEnquiryStatus);
router.get('/', verifyToken, requireRole('admin'), getEnquiries);

export default router;
