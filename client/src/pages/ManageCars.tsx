import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'


const ManageCars = () => {

  const navigate = useNavigate();

  const [cars, setCars] = useState<any>(false)

  const { backendUrl, companyToken } = useContext(AppContext)
  // Funtion to fetch compnay Job Application data
  const fetchCompanyCars = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/list-cars',
        { headers: { token: companyToken } }
      )

      if (data.success) {
        setCars(data.carsData.reverse())
        console.log(data.carsData);

      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Function to change Job Visibility
  const changeCarVisibility = async (id: number) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/company/change-visibility',
        { id },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchCompanyCars()
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      toast.error(error.message)
    }


  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyCars()
    }

  }, [companyToken])

  return cars ? cars.length === 0 ? (
  <div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No cars available or posted</p>
  </div> ) : (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b text-left'>Title</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-center'>Applicants</th>
              <th className='py-2 px-4 border-b text-left'>Visible</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car: any, index: number) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{index + 1}</td>
                <td className='py-2 px-4 border-b' >{car.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden' >{moment(car.date).format('ll')}</td>
                <td className='py-2 px-4 border-b max-sm:hidden' >{car.location}</td>
                <td className='py-2 px-4 border-b text-center' >{car.applicants}</td>
                <td className='py-2 px-4 border-b' >
                  <input onChange={() => changeCarVisibility(car._id)} className='scale-125 ml-4' type="checkbox" checked={car.visible} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-end'>
        <button onClick={() => navigate('/dashboard/add-car')} className='bg-black text-white py-2 px-4 rounded cursor-pointer'>Add new car</button>
      </div>
    </div>
  ) : <Loading />
}

export default ManageCars