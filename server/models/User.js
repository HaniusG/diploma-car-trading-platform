import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  image: {type: String, required: true},
  role: {type: String, required: false},
  password: {type: String, required: true},
  rating: {type: Number, default: 0},
  ratingCount: {type: Number, default: 0},
})

const User = mongoose.model('User', userSchema)

export default User