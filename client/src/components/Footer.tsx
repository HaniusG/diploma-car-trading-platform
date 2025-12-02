import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20'>
      <div className='flex justify-center items-center'>
          <img className='-mr-[6px] cursor-pointer w-12' src={assets.logo} alt="AutoMarket logo" />
          <span className='font-bold text-xl ml-[5px] mt-[5px] max-[400px]:hidden'>Auto<span className='font-normal'>Market</span></span>
      </div>
      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright godev-nu.vercel.app | All right reserved.</p>
      <div className='flex gap-2.5'>
        <img className='cursor-pointer' width={38} src={assets.facebook_icon} alt="" />
        <img className='cursor-pointer'width={38} src={assets.twitter_icon} alt="" />
        <img className='cursor-pointer' width={38} src={assets.instagram_icon} alt="" />
      </div>
    </div>
  )
}

export default Footer