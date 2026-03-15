import express from 'express'
import { changeJobApplicationStatus, changeVisibility, getUserData, getSellerCarApplicants, getSellerPostedCars, loginUser, postCar, registerUser } from '../controllers/sellerControllers.js'
import upload from '../config/multer.js'
import { protectUser } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register a seller
router.post('/register', upload.single('image'), registerUser)

// Seller login
router.post('/login', loginUser)

// Get seller data
router.get('/seller', protectUser, getUserData)

// Post a job
router.post('/post-car', upload.single('image'), protectUser, postCar)

// Get applicants data 
router.get('/applicants', protectUser, getSellerCarApplicants)

// Get Seller job list
router.get('/list-cars', protectUser, getSellerPostedCars)

// Change Application Status
router.post('/change-status', protectUser, changeJobApplicationStatus)

// Change application visibility
router.post('/change-visibility', protectUser, changeVisibility)

export default router;