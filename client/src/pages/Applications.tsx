import { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'

const Applications = () => {

  const { userData, buyerApplications, fetchBuyerApplications, userToken } = useContext(AppContext)

  useEffect(() => {
    if (userToken) {
      fetchBuyerApplications()
    }
  }, [userToken])

  return userData ? (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <h2 className='text-2xl font-semibold mb-6'>My Car Inquiries</h2>
        
        <div className='overflow-x-auto border rounded-lg shadow-sm'>
          <table className='min-w-full bg-white'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='py-4 px-6 border-b text-left text-sm font-semibold text-gray-600'>Seller</th>
                <th className='py-4 px-6 border-b text-left text-sm font-semibold text-gray-600'>Car Model</th>
                <th className='py-4 px-6 border-b text-left text-sm font-semibold text-gray-600 max-sm:hidden'>Location</th>
                <th className='py-4 px-6 border-b text-left text-sm font-semibold text-gray-600 max-sm:hidden'>Inquiry Date</th>
                <th className='py-4 px-6 border-b text-left text-sm font-semibold text-gray-600'>Status</th>
              </tr>
            </thead>
            <tbody>
              {buyerApplications && buyerApplications.length > 0 ? (
                buyerApplications.map((app: any, index: number) => (
                  <tr key={index} className='hover:bg-gray-50 transition-colors'>
                    <td className='py-4 px-6 border-b'>
                      <div className='flex items-center gap-3'>
                        <img 
                          className='w-10 h-10 rounded-full object-cover border' 
                          src={app.sellerId?.image || '/default-profile.png'} 
                          alt={app.sellerId?.name} 
                        />
                        <span className='font-medium text-gray-800'>{app.sellerId?.name}</span>
                      </div>
                    </td>
                    <td className='py-4 px-6 border-b font-medium text-blue-600'>{app.carId?.title}</td>
                    <td className='py-4 px-6 border-b text-gray-600 max-sm:hidden'>{app.carId?.location}</td>
                    <td className='py-4 px-6 border-b text-gray-600 max-sm:hidden'>{moment(app.date).format('ll')}</td>
                    <td className='py-4 px-6 border-b'>
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold
                        ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                          app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {app.status === 'Accepted' ? 'Contacted' : app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='py-10 text-center text-gray-500'>
                    You haven't expressed interest in any cars yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default Applications