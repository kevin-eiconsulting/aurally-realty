import { Router } from 'express';
import { 
  signup, 
  login, 
  getCurrentUser, 
  getUserProfile, 
  updateProfile, 
  getMyFavourites, 
  toggleFavourite, 
  logout 
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyToken, getCurrentUser);
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/favourites', verifyToken, getMyFavourites);
router.post('/favourites/toggle', verifyToken, toggleFavourite);
router.post('/logout', logout);

export default router;
