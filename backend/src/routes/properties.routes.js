import { Router } from 'express';
import { getProperties, getPropertyById, createProperty } from '../controllers/properties.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', optionalAuth, createProperty);

export default router;
