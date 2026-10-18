import express from 'express';
import { getCategories, getMaterials, getMaterialById } from '../controllers/materials.controller.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getMaterials);
router.get('/:id', getMaterialById);

export default router;
