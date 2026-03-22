import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

  const [carData, setCarData] = useState<any>(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)

  const {
    cars,
    backendUrl,
    userData,
    userToken,
    buyerApplications,
    fetchBuyerApplications,
  } = useContext(AppContext)

  // Configuration for specifications display
  const specFields = [
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'mileage', label: 'Mileage', suffix: ' km', formatter: (v: number) => v.toLocaleString() },
    { key: 'transmission', label: 'Transmission' },
    { key: 'fuelType', label: 'Fuel type' },
    { key: 'color', label: 'Color' },
    { key: 'seats', label: 'Seats' },
    { key: 'engineSize', label: 'Engine size', suffix: ' L' },
    { key: 'horsepower', label: 'Horsepower', suffix: ' HP' },
    { key: 'torque', label: 'Torque', suffix: ' Nm' },
    { key: 'cylinders', label: 'Cylinders' },
    { key: 'fuelConsumption', label: 'Fuel consumption', suffix: ' L/100km' },
    { key: 'gears', label: 'Gears' },
    { key: 'drivetrain', label: 'Drivetrain' },
    { key: 'steering', label: 'Steering' },
    { key: 'doors', label: 'Doors' },
  ];

  const fetchCar = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/cars/${id}`)
      if (data.success) {
        setCarData(data.car)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const applyHandler = async () => {
    try {
      if (!userData || !userToken || String(userData.role).trim() !== 'buyer') {
        return toast.error('Login as a buyer to express interest in cars')
      }

      const { data } = await axios.post(`${backendUrl}/api/users/apply`,
        { carId: carData._id },
        { headers: { token: userToken } }
      )

      if (data.success) {
        toast.success('Interest expressed successfully!')
        fetchBuyerApplications()
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCar()
  }, [id])

  useEffect(() => {
    if (buyerApplications.length > 0 && carData) {
      const hasApplied = buyerApplications.some(
        (item: any) => item?.carId?._id === carData._id
      )
      setIsAlreadyApplied(hasApplied)
    }
  }, [carData, buyerApplications])

  return carData ? (
    <>
      <Navbar />

      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          <div className='flex md:gap-20 justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <img className='object-cover h-70 w-100 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={carData.image} alt="" />
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
                      <img src={assets.suitcase_icon} alt="" />
                      {carData.condition}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.money_icon} alt="" />
                      Price: {kconvert.convertTo(carData.price)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
                <button 
                  disabled={isAlreadyApplied}
                  onClick={applyHandler} 
                  className={`p-2.5 px-10 text-white rounded cursor-pointer duration-200 ${isAlreadyApplied ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isAlreadyApplied ? 'Already applied' : 'Buy the car'}
                </button>
                <p className='mt-1 text-gray-600'>Posted {moment(carData.date).fromNow()}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3 space-y-8'>
              <div>
                <h2 className='font-bold text-2xl mb-4'>Car Description</h2>
                <div className='rich-text text-gray-700 leading-relaxed' dangerouslySetInnerHTML={{ __html: carData.description }}></div>
              </div>

              {/* Specs section */}
              {carData.specs && (
                <div>
                  <h2 className='font-bold text-2xl mb-4'>Specifications</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {specFields.map((field) => {
                      const value = carData.specs[field.key];
                      if (value === undefined || value === null || value === '') return null;
                      
                      const displayValue = field.formatter ? field.formatter(value) : value;
                      
                      return (
                        <div key={field.key} className='flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg px-4 py-2 hover:bg-sky-100 transition-colors'>
                          <span className='text-gray-500'>{field.label}</span>
                          <span className='font-medium text-gray-800'>
                            {displayValue}{field.suffix || ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button 
                disabled={isAlreadyApplied}
                onClick={applyHandler} 
                className={`p-2.5 px-10 text-white rounded mt-10 cursor-pointer duration-200 ${isAlreadyApplied ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isAlreadyApplied ? 'Already applied' : 'Buy the car'}
              </button>
            </div>

            {/* Right Section More Cars */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2 className='font-semibold text-xl border-b pb-2'>More from {carData.sellerId.name}</h2>
              {cars
                .filter((car: any) => car?._id !== carData._id && car?.sellerId?._id === carData.sellerId?._id)
                .filter((car: any) => {
                  const appliedCarsIds = new Set(buyerApplications.map((app: any) => app.carId?._id));
                  return !appliedCarsIds.has(car._id);
                })
                .slice(0, 4)
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