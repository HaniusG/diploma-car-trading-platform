import express from 'express'
import { getCarById, getCars } from '../controllers/carController.js';

const router = express.Router()

// Route to get all jobs data
router.get('/', getCars)

// Route to get a single job by ID
router.get('/:id', getCarById)

export default router;