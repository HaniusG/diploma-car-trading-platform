import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  location: {type: String, required: true},
  category: {type: String, required: true},
  condition: {type: String, required: true},
  price: {type: Number, required: true},
  image: { type: String, required: true },
  date: {type: Number, required: true},
  visible: {type: Boolean, default: true},
  sellerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
})

const Car = mongoose.model('Car', carSchema)

export default Car;