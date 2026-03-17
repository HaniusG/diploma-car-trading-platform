import CarApplication from "../models/CarApplication.js"
import Car from '../models/Car.js'
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"

// Get user data (uses JWT + protectUser -> req.user)
export const getUserData = async (req, res) => {
  try {
    const user = req.user

    if (!user) {
      return res.json({ success: false, message: 'User Not Found' })
    }

    res.json({ success: true, user })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Apply for a car
export const applyForCar = async (req, res) => {
  const { carId } = req.body
  const userId = req.user._id

  try {
    // Prevent duplicate applications for same car/user
    const isAlreadyApplied = await CarApplication.find({ carId, userId })

    if (isAlreadyApplied.length > 0) {
      return res.json({ success: false, message: 'Already applied' })
    }

    // Fetch car to get sellerId
    const carData = await Car.findById(carId)

    if (!carData) {
      return res.json({ success: false, message: 'Car not found' })
    }

    await CarApplication.create({
      sellerId: carData.sellerId,
      userId,
      carId,
      date: Date.now()
    })

    res.json({ success: true, message: 'Applied successfully' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.user._id

    const applications = await CarApplication.find({ userId })
      .populate('sellerId', 'name email image')
      .populate('carId', 'title description location category condition price')
      .exec()

    if (!applications) {
      return res.json({ success: false, message: 'No car applications found for this user.' })
    }

    return res.json({ success: true, applications })

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}

// Update user profile (resume)
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.user._id

    const resumeFile = req.file

    const userData = await User.findById(userId)

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
      userData.resume = resumeUpload.secure_url
    }

    await userData.save()

    return res.json({ success: true, message: 'Resume updated' })

  } catch (error) {

    res.json({ success: false, message: error.message })

  }

}