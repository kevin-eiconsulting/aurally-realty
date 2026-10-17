import { Router } from 'express';
import { getAdminStats, getAdminUsers, updatePropertyStatus, deleteProperty } from '../controllers/admin.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin endpoints
router.use(verifyToken, requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deleteProperty);

export default router;
