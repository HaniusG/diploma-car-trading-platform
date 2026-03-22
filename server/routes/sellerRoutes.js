import express from 'express'
import { changeCarApplicationStatus, changeVisibility, getSellerCarApplicants, getSellerPostedCars, postCar } from '../controllers/sellerControllers.js'
import upload from '../config/multer.js'
import { protectUser } from '../middleware/authMiddleware.js'

const router = express.Router()

// Post a job
router.post('/post-car', upload.single('image'), protectUser, postCar)

// Get applicants data 
router.get('/applicants', protectUser, getSellerCarApplicants)

// Get Seller job list
router.get('/list-cars', protectUser, getSellerPostedCars)

// Change Application Status
router.post('/change-status', protectUser, changeCarApplicationStatus)

// Change application visibility
router.post('/change-visibility', protectUser, changeVisibility)

export default router;