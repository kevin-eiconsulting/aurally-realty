import { Router } from 'express';
import { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty,
  updateListingStatus,
  recordPropertyView,
  getMyProperties, 
  deleteProperty 
} from '../controllers/properties.controller.js';
import { optionalAuth, verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/user/my', verifyToken, getMyProperties);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', optionalAuth, createProperty);
router.put('/:id', verifyToken, updateProperty);
router.patch('/:id/status', verifyToken, updateListingStatus);
router.post('/:id/view', recordPropertyView);
router.delete('/:id', verifyToken, deleteProperty);

export default router;
