import mongoose from "mongoose";

const CarApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  status: { type: String, default: 'Pending' },
  date: { type: Number, required: true }
})

const CarApplication = mongoose.model('CarApplication', CarApplicationSchema)

export default CarApplication;