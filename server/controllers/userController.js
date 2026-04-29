import CarApplication from "../models/CarApplication.js"
import Car from '../models/Car.js'
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"

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

// Rate a seller
export const rateSeller = async (req, res) => {
  try {
    const { sellerId, rating } = req.body;
    const userId = req.user._id;

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.json({ success: false, message: 'Seller not found' });
    }

    // Calculate new average rating
    const currentTotalRating = seller.rating * seller.ratingCount;
    seller.ratingCount += 1;
    seller.rating = (currentTotalRating + rating) / seller.ratingCount;

    await seller.save();

    res.json({ success: true, message: 'Rating submitted successfully', rating: seller.rating, ratingCount: seller.ratingCount });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}