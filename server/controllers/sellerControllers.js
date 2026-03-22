import User from "../models/User.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Car from "../models/Car.js";
import CarApplication from "../models/CarApplication.js";


// Register a new user
export const registerUser = async (req, res) => {

  const { name, email, password, role } = req.body

  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: 'Missing Details' })
  }

  try {
    const userExist = await User.findOne({ email })

    if (userExist) {
      return res.json({ success: false, message: 'User already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path)

    const user = await User.create({
      name,
      email,
      role,
      password: hashPassword,
      image: imageUpload.secure_url
    })

    res.json({
      success: true,
     user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      },
      token: generateToken(user._id)
    })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }

}

// Seller login
export const loginUser = async (req, res) => {

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (await bcrypt.compare(password, user.password)) {

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        },
        token: generateToken(user._id)
      })

    } else {
      res.json({ success: false, message: 'Invalid email or password' })
    }
  } catch (error) {
    res.json({ success: false, message: error.message })

  }
}

// Get user data 
export const getUserData = async (req, res) => {
  try {
    const user = req.user
    res.json({ success: true, user })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Post a new car
import uploadImageToCloudinary from "../utils/cloudinaryUploader.js"

export const postCar = async (req, res) => {
  try {

    const {
      title,
      description,
      location,
      price,
      condition,
      category,
      brand,
      model,
      year,
      mileage,
      transmission,
      fuelType,
      color,
      seats,
      engineSize,
      horsepower,
      torque,
      cylinders,
      fuelConsumption,
      gears,
      drivetrain,
      steering,
    } = req.body
    const sellerId = req.user._id

    if (!req.file) {
      return res.json({ success: false, message: "Image is required" })
    }

    const uploadResult = await uploadImageToCloudinary(req.file.path)

    const newCar = new Car({
      title,
      description,
      location,
      price,
      sellerId,
      image: uploadResult.secure_url,
      date: Date.now(),
      condition,
      category,
      specs: {
        brand,
        model,
        year: Number(year),
        mileage: Number(mileage),
        transmission,
        fuelType,
        color,
        seats: Number(seats),
        engineSize: engineSize ? Number(engineSize) : undefined,
        horsepower: horsepower ? Number(horsepower) : undefined,
        torque: torque ? Number(torque) : undefined,
        cylinders: cylinders ? Number(cylinders) : undefined,
        fuelConsumption: fuelConsumption ? Number(fuelConsumption) : undefined,
        gears: gears ? Number(gears) : undefined,
        drivetrain,
        steering,
      }
    })

    await newCar.save()

    res.json({ success: true, newCar })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get seller car applicant
export const getSellerCarApplicants = async (req, res) => {
  try {

    const sellerId = req.user._id

    // Find car applications for the user and populate related data
    const applications = await CarApplication.find({ sellerId })
      .populate('userId', 'name image resume')
      .populate('carId', 'title location category level salary')
      .exec()

    return res.json({ success: true, applications })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get seller Posted cars
export const getSellerPostedCars = async (req, res) => {
  try {
    const sellerId = req.user._id
    const cars = await Car.find({ sellerId })

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

// Change car Application Status
export const changeCarApplicationStatus = async (req, res) => {

  try {
    const { id, status } = req.body

    // Find car application data and update status
    await CarApplication.findOneAndUpdate({ _id: id }, { status })
    res.json({ success: true, message: 'Status changed' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }



}

// Change car visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body
    const sellerId = req.user._id
    const car = await Car.findById(id)

    if (sellerId.toString() === car.sellerId.toString()) {
      car.visible = !car.visible
    }

    await car.save()

    res.json({ success: true, car })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}