import { Router } from 'express';
import { getServices, getServiceCategories, getServiceByIdOrSlug } from '../controllers/services.controller.js';

const router = Router();

router.get('/', getServices);
router.get('/categories', getServiceCategories);
router.get('/:idOrSlug', getServiceByIdOrSlug);

export default router;
