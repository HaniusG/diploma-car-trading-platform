import Car from "../models/Car.js"



// Get all cars
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({visible: true})
    .populate({path:'companyId', select:'-password'})

    res.json({success: true, cars})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

// Get a single job by ID
export const getCarById = async (req, res) => {
  try {
    const {id} = req.params

    const job = await Car.findById(id)
    .populate({path: 'companyId', select:'-password'})

    if (!job) {
      return res.json({
        success: false, 
        message: 'Job not found'
      })
    }

    res.json({
      success: true,
      job
    })


  } catch (error) {
    res.json({success: false, message: error.message})
  }
}