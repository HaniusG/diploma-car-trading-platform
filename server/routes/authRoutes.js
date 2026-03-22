import express from 'express';
import { loginUser, registerUser, getUserData } from '../controllers/authController.js';
import upload from '../config/multer.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a user
router.post('/register', upload.single('image'), registerUser);

// Login a user
router.post('/login', loginUser);

// Get current user data
router.get('/user', protectUser, getUserData);

export default router;
