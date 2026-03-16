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

      console.log(data);

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
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20  mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={carData.sellerId.image} alt="" />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{carData.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    {carData.sellerId.name}
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
                    CTC: {kconvert.convertTo(carData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer hover:bg-blue-700 duration-200'>{isAlreadyApplied ? 'Already applied': 'Buy now'}</button>
              <p className='mt-1 text-gray-600'>Posted {moment(carData.date).fromNow()}</p>
            </div>

          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Car description</h2>
              <div className='rich-text' dangerouslySetInnerHTML={{ __html: carData.description }}></div>
              <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10 cursor-pointer hover:bg-blue-700 duration-200'>{isAlreadyApplied ? 'Already applied': 'Buy now'}</button>
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