import Car from "../models/Car.js"



// Get all cars
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({visible: true})
    .populate({path:'sellerId', select:'-password'})

    res.json({success: true, cars})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

// Get a single car by ID
export const getCarById = async (req, res) => {
  try {
    const {id} = req.params

    const car = await Car.findById(id)
    .populate({path: 'sellerId', select:'-password'})

    if (!car) {
      return res.json({
        success: false, 
        message: 'Car not found'
      })
    }

    res.json({
      success: true,
      car
    })


  } catch (error) {
    res.json({success: false, message: error.message})
  }
}