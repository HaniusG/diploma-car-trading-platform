import Company from "../models/Company.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Car from "../models/Car.js";
import CarApplication from "../models/CarApplication.js";


// Register a new company
export const registerCompany = async (req, res) => {

  const { name, email, password } = req.body

  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: 'Missing Details' })
  }

  try {
    const companyExist = await Company.findOne({ email })

    if (companyExist) {
      return res.json({ success: false, message: 'Company already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path)

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url
    })

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }


}

// Company login
export const loginCompany = async (req, res) => {

  const { email, password } = req.body

  try {
    const company = await Company.findOne({ email })

    if (await bcrypt.compare(password, company.password)) {

      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image
        },
        token: generateToken(company._id)
      })

    } else {
      res.json({ success: false, message: 'Invalid email or password' })
    }
  } catch (error) {
    res.json({ success: false, message: error.message })

  }
}

// Get company data 
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company
    res.json({ success: true, company })
  } catch (error) {
    res.json({ success: message, message: error.message })
  }
}

// Post a new job
import uploadImageToCloudinary from "..//utils/cloudinaryUploader.js"

export const postCar = async (req, res) => {
  try {

    const { title, description, location, price, condition, category } = req.body
    const companyId = req.company._id

    if (!req.file) {
      return res.json({ success: false, message: "Image is required" })
    }

    // 🔥 Upload image using modular utility
    const uploadResult = await uploadImageToCloudinary(req.file.path)

    const newCar = new Car({
      title,
      description,
      location,
      price,
      companyId,
      image: uploadResult.secure_url,
      date: Date.now(),
      condition,
      category
    })

    await newCar.save()

    res.json({ success: true, newCar })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get company job applicant
export const getCompanyJobApplicants = async (req, res) => {
  try {

    const companyId = req.company._id

    // Find job applications for the user and populate related data
    const applications = await CarApplication.find({ companyId })
      .populate('userId', 'name image resume')
      .populate('jobId', 'title location category level salary')
      .exec()

    return res.json({ success: true, applications })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get Company Posted Jobs
export const getCompanyPostedCars = async (req, res) => {
  try {
    const companyId = req.company._id
    const cars = await Car.find({ companyId })

    // Adding No. of applicants info
    const carsData = await Promise.all(cars.map(async (car) => {
      const applicants = await CarApplication.find({ carId: car._id })
      return { ...car.toObject(), applicants: applicants.length }
    }))

    res.json({ success: true, carsData })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Change Job Application Status
export const changeJobApplicationStatus = async (req, res) => {

  try {
    const { id, status } = req.body

    // Find job application data and update status
    await Application.findOneAndUpdate({ _id: id }, { status })
    res.json({ success: true, message: 'Status changed' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }



}

// Change job visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body
    const companyId = req.company._id
    const car = await Car.findById(id)

    if (companyId.toString() === car.companyId.toString()) {
      car.visible = !car.visible
    }

    await car.save()

    res.json({ success: true, car })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}