import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  date: { type: Number, required: true },
  visible: { type: Boolean, default: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specs: {
    brand: { type: String, required: true }, // manufacturer (BMW, Mercedes, etc.)
    model: { type: String, required: true }, // model (X5, C-Class, etc.)
    year: { type: Number, required: true }, // production year
    mileage: { type: Number , required: true}, // total kilometers driven
    transmission: { type: String, required: true }, // Automatic or Manual
    fuelType: { type: String, required: true }, // Petrol, Diesel, Hybrid, Electric
    color: { type: String, required: true }, // exterior color
    seats: { type: Number, required: true }, // number of seats
    engineSize: { type: Number }, // engine size in liters (e.g. 4.0)
    horsepower: { type: Number }, // engine power in HP
    torque: { type: Number }, // torque (Nm)
    cylinders: { type: Number }, // number of engine cylinders
    fuelConsumption: { type: Number }, // fuel usage (L/100km)
    gears: { type: Number }, // number of gears
    drivetrain: { type: String }, // AWD, FWD, RWD
    doors: { type: Number }, // number of doors
    steering: { type: String }, // Left or Right steering wheel
  }

})

const Car = mongoose.model('Car', carSchema)

export default Car;