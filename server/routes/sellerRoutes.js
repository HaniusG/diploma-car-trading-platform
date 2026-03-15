import express from 'express'
import { changeJobApplicationStatus, changeVisibility, getSellerData, getSellerJobApplicants, getSellerPostedCars, loginSeller, postCar, registerUser } from '../controllers/sellerControllers.js'
import upload from '../config/multer.js'
import { protectSeller } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register a seller
router.post('/register', upload.single('image'), registerUser)

// Seller login
router.post('/login', loginSeller)

// Get seller data
router.get('/seller', protectSeller, getSellerData)

// Post a job
router.post('/post-car', upload.single('image'), protectSeller, postCar)

// Get applicants data 
router.get('/applicants', protectSeller, getSellerJobApplicants)

// Get Seller job list
router.get('/list-cars', protectSeller, getSellerPostedCars)

// Change Application Status
router.post('/change-status', protectSeller, changeJobApplicationStatus)

// Change application visibility
router.post('/change-visibility', protectSeller, changeVisibility)

export default router;