import express from 'express'
import { applyForCar, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'
import { protectUser } from '../middleware/authMiddleware.js'

const router = express.Router()

// Get user Data (requires JWT token)
router.get('/user', protectUser, getUserData)

// Apply for a car (requires JWT token)
router.post('/apply', protectUser, applyForCar)

// Get applied cars data (requires JWT token)
router.get('/applications', protectUser, getUserJobApplications)

// Update user profile (resume) (requires JWT token)
router.post('/update-resume', protectUser, upload.single('resume'), updateUserResume)

export default router;