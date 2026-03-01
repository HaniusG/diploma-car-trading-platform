import express from 'express'
import { changeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedCars, loginCompany, postCar, registerCompany } from '../controllers/companyControllers.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register a company
router.post('/register', upload.single('image'), registerCompany)

// Company login
router.post('/login', loginCompany)

// Get company data
router.get('/company', protectCompany, getCompanyData)

// Post a job
router.post('/post-car', upload.single('image'), protectCompany, postCar)

// Get applicants data 
router.get('/applicants', protectCompany, getCompanyJobApplicants)

// Get company job list
router.get('/list-cars', protectCompany, getCompanyPostedCars)

// Change Application Status
router.post('/change-status', protectCompany, changeJobApplicationStatus)

// Change application visibility
router.post('/change-visibility', protectCompany, changeVisibility)

export default router;