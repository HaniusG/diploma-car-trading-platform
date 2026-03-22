import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";

// Register a new user (can be seller or buyer)
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: 'Missing Details' });
  }

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.json({ success: false, message: 'User already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const user = await User.create({
      name,
      email,
      role: role || 'user', // Default role if not provided
      password: hashPassword,
      image: imageUpload.secure_url
    });

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
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
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
      });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get current user data
export const getUserData = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
