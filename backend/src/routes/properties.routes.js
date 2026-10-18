import { Router } from 'express';
import { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  getMyProperties, 
  deleteProperty 
} from '../controllers/properties.controller.js';
import { optionalAuth, verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/user/my', verifyToken, getMyProperties);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', optionalAuth, createProperty);
router.delete('/:id', verifyToken, deleteProperty);

export default router;
