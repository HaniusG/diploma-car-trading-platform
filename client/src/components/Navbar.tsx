import { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const Navbar = () => {

  const navigate = useNavigate()

  const { setShowLogin, setRole, userData, setUserData, setUserToken  } = useContext(AppContext)

  
  const logout = () => {
    setUserToken(null)
    localStorage.removeItem('userToken')
    setUserData(null)
    navigate('/')
  }


  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        <div className='flex justify-center items-center'>
          <img onClick={() => navigate('/')} className='-mr-[6px] cursor-pointer w-12' src={assets.logo} alt="AutoMarket logo" />
          <span className='font-bold text-xl ml-[5px] mt-[5px] max-[400px]:hidden'>Auto<span className='font-normal'>Market</span></span>
        </div>
        {userData ?
            <div className='flex items-center gap-3'>
              {String(userData.role).trim() === 'seller' && (
                <Link
                  to='/dashboard/manage-cars'
                  className='text-blue-700 hover:text-blue-800 font-medium max-sm:hidden'
                >
                  Dashboard
                </Link>
              )}
              <p className='max-sm:hidden'>{userData.name}</p>
              <div className='relative group'>
                <img className='w-8 border rounded-full' src={userData.image} alt="" />
                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                  <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                    <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                  </ul>
                </div>
              </div>
            </div>
            :
            <div className='flex gap-4 max-sm:text-xs'>
              <button onClick={() => {setShowLogin(true), setRole('seller')}} className='text-gray-600 cursor-pointer'>Seller Login</button>
              <button onClick={() => {setShowLogin(true), setRole('buyer')}} className='bg-blue-600 hover:bg-blue-700 duration-200 cursor-pointer text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>

              {/* <button onClick={() => openSignIn()} className='bg-blue-600 hover:bg-blue-700 duration-200 cursor-pointer text-white px-6 sm:px-9 py-2 rounded-full'>Login</button> */}
            </div>
        }

      </div>
    </div>
  )
}

export default Navbar