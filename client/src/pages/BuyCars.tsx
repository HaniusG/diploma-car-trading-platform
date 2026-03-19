import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import kconvert from 'k-convert'
import moment from 'moment'
import CarCard from '../components/CarCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'

const BuyCars = () => {

  const { id } = useParams()

  const navigate = useNavigate()

  const [carData, setCarData] = useState<any>(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)

  const {
    cars,
    backendUrl,
    userData,
    userToken,
    role,
    buyerApplications,
    fetchBuyerApplications,
  } = useContext(AppContext)

  const fetchCar = async () => {

    try {
      const { data } = await axios.get(backendUrl + `/api/cars/${id}`)
      if (data.success) {
        setCarData(data.car)
        console.log(carData);
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const applyHandler = async () => {

    try {

      if (!userData || !userToken || String(role).trim() !== 'buyer') {
        return toast.error('Login as a buyer to apply for cars')
      }

      const { data } = await axios.post(backendUrl + '/api/users/apply',
        { carId: carData._id },
        { headers: { token: userToken } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchBuyerApplications()
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const checkAlreadyApplied = () => {
    const hasApplied: any = buyerApplications.some(
      (item: any) => item?.carId && item.carId._id === carData._id
    )
    setIsAlreadyApplied(hasApplied)
  }

  useEffect(() => {
    fetchCar()
  }, [id])

  useEffect(() => {
    if (buyerApplications.length > 0 && carData) {
      checkAlreadyApplied()
    }
  }, [carData, buyerApplications, id])

  return carData ? (
    <>
      <Navbar />

      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-ful'>
          <div className='flex md:gap-20 justify-center md:justify-between flex-wrap gap-8 px-14 py-20  mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <img className='object-cover h-70 w-100  bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={carData.image} alt="" />
            <div className='flex justify-center md:justify-between md:w-150'>
              <div className='flex flex-col md:flex-row items-center'>
                <div className='text-center md:text-left text-neutral-700'>
                  <h1 className='text-2xl sm:text-4xl font-medium'>{carData.title}</h1>
                  <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                    <span className='flex items-center gap-2'>
                      <img
                        src={carData.sellerId?.image || assets.profile_img}
                        alt={carData.sellerId?.name}
                        className='w-8 h-8 rounded-full object-cover border'
                      />
                      <span className='font-medium'>{carData.sellerId?.name}</span>
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.location_icon} alt="" />
                      {carData.location}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.person_icon} alt="" />
                      {carData.level}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.money_icon} alt="" />
                      Price: {kconvert.convertTo(carData.price)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
                <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer hover:bg-blue-700 duration-200'>{isAlreadyApplied ? 'Already applied' : 'Buy now'}</button>
                <p className='mt-1 text-gray-600'>Posted {moment(carData.date).fromNow()}</p>
              </div>

            </div>



          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3 space-y-8'>
              <div>
                <h2 className='font-bold text-2xl mb-4'>Car description</h2>
                <div className='rich-text' dangerouslySetInnerHTML={{ __html: carData.description }}></div>
              </div>

              {/* Specs section */}
              {carData.specs && (
                <div>
                  <h2 className='font-bold text-2xl mb-4'>Specifications</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {carData.specs.brand && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Brand</span>
                        <span className='font-medium text-gray-800'>{carData.specs.brand}</span>
                      </div>
                    )}
                    {carData.specs.model && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Model</span>
                        <span className='font-medium text-gray-800'>{carData.specs.model}</span>
                      </div>
                    )}
                    {carData.specs.year && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Year</span>
                        <span className='font-medium text-gray-800'>{carData.specs.year}</span>
                      </div>
                    )}
                    {carData.specs.mileage !== undefined && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Mileage</span>
                        <span className='font-medium text-gray-800'>{carData.specs.mileage.toLocaleString()} km</span>
                      </div>
                    )}
                    {carData.specs.transmission && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Transmission</span>
                        <span className='font-medium text-gray-800'>{carData.specs.transmission}</span>
                      </div>
                    )}
                    {carData.specs.fuelType && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Fuel type</span>
                        <span className='font-medium text-gray-800'>{carData.specs.fuelType}</span>
                      </div>
                    )}
                    {carData.specs.color && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Color</span>
                        <span className='font-medium text-gray-800'>{carData.specs.color}</span>
                      </div>
                    )}
                    {carData.specs.seats && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Seats</span>
                        <span className='font-medium text-gray-800'>{carData.specs.seats}</span>
                      </div>
                    )}
                    {carData.specs.engineSize && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Engine size</span>
                        <span className='font-medium text-gray-800'>{carData.specs.engineSize} L</span>
                      </div>
                    )}
                    {carData.specs.horsepower && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Horsepower</span>
                        <span className='font-medium text-gray-800'>{carData.specs.horsepower} HP</span>
                      </div>
                    )}
                    {carData.specs.torque && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Torque</span>
                        <span className='font-medium text-gray-800'>{carData.specs.torque} Nm</span>
                      </div>
                    )}
                    {carData.specs.cylinders && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Cylinders</span>
                        <span className='font-medium text-gray-800'>{carData.specs.cylinders}</span>
                      </div>
                    )}
                    {carData.specs.fuelConsumption && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Fuel consumption</span>
                        <span className='font-medium text-gray-800'>{carData.specs.fuelConsumption} L/100km</span>
                      </div>
                    )}
                    {carData.specs.gears && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Gears</span>
                        <span className='font-medium text-gray-800'>{carData.specs.gears}</span>
                      </div>
                    )}
                    {carData.specs.drivetrain && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Drivetrain</span>
                        <span className='font-medium text-gray-800'>{carData.specs.drivetrain}</span>
                      </div>
                    )}
                    {carData.specs.steering && (
                      <div className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2'>
                        <span className='text-gray-500'>Steering</span>
                        <span className='font-medium text-gray-800'>{carData.specs.steering}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10 cursor-pointer hover:bg-blue-700 duration-200'>{isAlreadyApplied ? 'Already applied' : 'Buy now'}</button>
            </div>
            {/* Right Section More Jobs */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2>More cars from {carData.sellerId.name}</h2>
              {cars
                .filter(
                  (car: any) =>
                    car &&
                    car._id !== carData._id &&
                    car.sellerId &&
                    car.sellerId._id === carData.sellerId._id
                )
                .filter((car: any) => {
                  // Applied jobs id's
                  const appliedCarsIds = new Set(
                    buyerApplications
                      .filter((app: any) => app?.carId && app.carId._id)
                      .map((app: any) => app.carId._id)
                  )
                  // If did not apply, then show
                  return !appliedCarsIds.has(car._id)
                }).slice(0, 4)
                .map((car: any, index: number) => <CarCard key={index} car={car} />)}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default BuyCars