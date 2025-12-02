import { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {

  const {setSearchFilter, setIsSearched} = useContext(AppContext)

  const titleRef = useRef<HTMLInputElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)

const onSearch = () => {
  if (titleRef.current && locationRef.current) {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true)
    console.log({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    
  }
};


  return (
    <div className='container 2xl:px-20 mx-auto my-10'>
      <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl'>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Over 10,000+ cars sold</h2>
        <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>Find your next ride or sell your car fast <br/>Explore the best deals and start your journey!</p>
        <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'>
          <div className='flex items-center'>
            <img className='h-4 sm:h-5' src={assets.search_icon} alt="Search" />
            <input type="text"
              placeholder='Search for cars'
              className='max-sm:text-xs p-2 rounded outline-none w-full' 
              ref={titleRef}
              />
          </div>
          <div className='flex items-center'>
            <img className='h-4 sm:h-5' src={assets.location_icon} alt="Search" />
            <input type="text"
              placeholder='Location'
              className='max-sm:text-xs p-2 rounded outline-none w-full' 
              ref={locationRef}
              />
          </div>
          <button onClick={onSearch} className='bg-blue-600  hover:bg-blue-700 duration-200 cursor-pointer px-6 py-2 rounded text-white m-1'>Search</button>
        </div>
      </div>
      
      <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex'>
        <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
          <p className='font-medium'>We Sell</p>
          <img className='h-8' src={assets.mercedes_logo} alt="Microsoft" />
          <img className='h-8' src={assets.toyota_logo} alt="toyota" />
          <img className='h-8' src={assets.tesla_logo} alt="tesla" />
          <img className='h-8' src={assets.nissan_logo} alt="nissan" />
          <img className='h-8' src={assets.honda_logo} alt="honda" />
          <img className='h-6' src={assets.byd_logo} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Hero