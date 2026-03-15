import CarApplication from "../models/CarApplication.js"
import Job from '../models/Car.js'
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"


// Get user data
export const getUserData = async(req, res) => {
  const userId = req.auth().userId
  
  try {
    const user = await User.findById(userId) 

    if(!user) {
      return res.json({success: false, message: 'User Not Found'})
    }

    res.json({success: true, user})

  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

// Apply for a job
export const applyForJob = async(req, res) => {
  const { jobId } = req.body
  const userId = req.auth().userId

  try {
    const isAlreadyApplied = await CarApplication.find({carId, userId})

    if(isAlreadyApplied.length > 0) {
      return res.json({success: false, message: 'Already applied'})
    }

    const jobData = await Job.findById(jobId)

    if(!jobData) {
      return res.json({success: false, message: 'Job not found'})
    }

    await CarApplication.create({
      sellerId: jobData.sellerId,
      userId,
      jobId,
      date: Date.now()
    })

    res.json({success: true, message: 'Applied successfully'})

  } catch (error) {
     res.json({success: false, message: error.message})
  }
}

// Get user applied application
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth().userId
    
    const applications = await CarApplication.find({userId})
    .populate('sellerId', 'name email image')
    .populate('jobId', 'title description location category level salary')
    .exec()

    if (!applications) {
      return res.json({success: false, message: 'No job applications found for this user.'})
    }

    return res.json({success: true, applications})

  } catch (error) {
    return res.json({success: false, message: error.message})
  }
}

// Update user profile (resume)
export const updateUserResume = async (req, res) =>  {
  try {
    const userId = req.auth().userId

    const resumeFile = req.file

    const userData = await User.findById(userId)

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
      userData.resume = resumeUpload.secure_url
    }

    await userData.save()

    return res.json({success: true, message: 'Resume updated'})

  } catch (error) {
    
    res.json({ success: false, message: error.message })

  }

}