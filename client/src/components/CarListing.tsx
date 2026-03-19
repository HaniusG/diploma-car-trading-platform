import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, CarCategories, CarLocations, CarDrivetrains, CarFuelTypes } from '../assets/assets'
import CarCard from './CarCard'

const JobListing = () => {

  const { isSearched, searchFilter, setSearchFilter, cars } = useContext(AppContext)

  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedFuelType, setSelectedFuelType] = useState<string>('')
  const [selectedDrivetrain, setSelectedDrivetrain] = useState<string>('')
  const [selectedSteering, setSelectedSteering] = useState<string>('')
  const [selectedCondition, setSelectedCondition] = useState<string>('')
  const [mileageMin, setMileageMin] = useState<number | ''>('')
  const [mileageMax, setMileageMax] = useState<number | ''>('')

  // const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)

  const [filteredCars, setFilteredCars] = useState<any>(cars)


 const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev: string[]) =>
      prev.includes(category)
      ? prev.filter(c => c !== category)
      : [...prev, category]
  );
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev: string[]) =>
      prev.includes(location)
      ? prev.filter(c => c !== location)
      : [...prev, location]
  );
  };


  useEffect(() => {
    const matchesCategory = (car: any) => selectedCategories.length === 0 || selectedCategories.includes(car.category)
    const matchesLocation = (car: any) => selectedLocations.length === 0 || selectedLocations.includes(car.location)

    const matchesTitle = (car: any) => searchFilter.title === '' || car.title.toLowerCase().includes(searchFilter.title.toLowerCase())

    const matchesSearchLocation = (car: any) => searchFilter.location === '' || car.location.toLowerCase().includes(searchFilter.location.toLowerCase())

    const matchesFuelType = (car: any) => selectedFuelType === '' || car?.specs?.fuelType === selectedFuelType
    const matchesDrivetrain = (car: any) => selectedDrivetrain === '' || car?.specs?.drivetrain === selectedDrivetrain
    const matchesSteering = (car: any) => selectedSteering === '' || car?.specs?.steering === selectedSteering
    const matchesCondition = (car: any) => selectedCondition === '' || car.condition === selectedCondition

    const matchesMileage = (car: any) => {
      const raw = car?.specs?.mileage
      const mv = typeof raw === 'number' ? raw : Number(raw)

      if (mileageMin === '' && mileageMax === '') return true
      if (!Number.isFinite(mv)) return false

      if (mileageMin !== '' && mv < Number(mileageMin)) return false
      if (mileageMax !== '' && mv > Number(mileageMax)) return false

      return true
    }

    // const newFilteredJobs = jobs.slice().reverse().filter(
    //   (job: Job) => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
    // )

    const newFilteredCars = cars.slice().reverse().filter(
      (car: any) =>
        matchesCategory(car) &&
        matchesLocation(car) &&
        matchesTitle(car) &&
        matchesSearchLocation(car) &&
        matchesFuelType(car) &&
        matchesDrivetrain(car) &&
        matchesSteering(car) &&
        matchesCondition(car) &&
        matchesMileage(car)
    )
    
    setFilteredCars(newFilteredCars);
    setCurrentPage(1)


  }, [
    cars,
    selectedCategories,
    selectedLocations,
    searchFilter,
    selectedFuelType,
    selectedDrivetrain,
    selectedSteering,
    selectedCondition,
    mileageMin,
    mileageMax,
  ])

  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>

      {/* Sidebar */}
      <div className='w-full lg:w-1/4 bg-white px-4'>

        {/* Searchfilter from Hero */}
        {
          isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className='font-medium text-lg mb-4'>Current Search</h3>
              <div className='mb-4 text-gray-600'>
                {searchFilter.title && (
                  <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                    {searchFilter.title}
                    <img onClick={() => setSearchFilter((prev: any) => ({ ...prev, title: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="Dlt" />
                  </span>
                )}
                {searchFilter.location && (
                  <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                    {searchFilter.location}
                    <img onClick={() => setSearchFilter((prev: any) => ({ ...prev, location: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="Dlt" />
                  </span>
                )}
              </div>
            </>
          )
        }

        <button onClick={() => setShowFilter((prev: boolean) => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
          <ul className='space-y-4 text-gray-600'>
            {
              CarCategories.map((category, index) => (
                <li className='flex gap-3 items-center' key={index}>
                  <input 
                  className='scale-125' 
                  type="checkbox"
                  onChange={()=>handleCategoryChange(category)}
                  checked = {selectedCategories.includes(category)}
                  />
                  {category}
                </li>
              ))
            }
          </ul>
        </div>

        {/* Location Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className='font-medium text-lg py-4 pt-14'>Search by Location</h4>
          <ul className='space-y-4 text-gray-600'>
            {
              CarLocations.map((location, index) => (
                <li className='flex gap-3 items-center' key={index}>
                  <input 
                  className='scale-125' 
                  type="checkbox" 
                  onChange={()=> handleLocationChange(location)}
                  checked = {selectedLocations.includes(location)}
                  />
                  {location}
                </li>
              ))
            }
          </ul>
        </div>

        {/* Specs Filters */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className='font-medium text-lg py-4 pt-14'>Search by Specs</h4>

          <div className='space-y-6 text-gray-700'>
            <div>
              <label className='block text-sm mb-2'>Fuel type</label>
              <select
                className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
              >
                <option value=''>Any</option>
                {CarFuelTypes.map((f, index) => (
                  <option key={index} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm mb-2'>Drivetrain</label>
              <select
                className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                value={selectedDrivetrain}
                onChange={(e) => setSelectedDrivetrain(e.target.value)}
              >
                <option value=''>Any</option>
                {CarDrivetrains.map((d, index) => (
                  <option key={index} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm mb-2'>Steering</label>
              <select
                className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                value={selectedSteering}
                onChange={(e) => setSelectedSteering(e.target.value)}
              >
                <option value=''>Any</option>
                <option value='Left'>Left</option>
                <option value='Right'>Right</option>
              </select>
            </div>

            <div>
              <label className='block text-sm mb-2'>Condition</label>
              <select
                className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
              >
                <option value=''>Any</option>
                <option value='New'>New</option>
                <option value='Very good'>Very good</option>
                <option value='Good'>Good</option>
                <option value='Needs Repair'>Needs Repair</option>
                <option value='Damaged'>Damaged</option>
              </select>
            </div>

            <div className='flex gap-3'>
              <div className='flex-1'>
                <label className='block text-sm mb-2'>Mileage min</label>
                <input
                  type='number'
                  min={0}
                  className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                  value={mileageMin}
                  onChange={(e) => setMileageMin(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder='Min'
                />
              </div>

              <div className='flex-1'>
                <label className='block text-sm mb-2'>Mileage max</label>
                <input
                  type='number'
                  min={0}
                  className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                  value={mileageMax}
                  onChange={(e) => setMileageMax(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder='Max'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Job listing */}

      <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
        <h3 className='font-medium text-3xl py-2' id='job-list'>Latest cars</h3>
        <p className='mb-8'>Get your desired car</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {filteredCars.slice((currentPage-1)*6, currentPage*6).map((car: any, index: number) => {
            return <CarCard key={index} car={car} />
          })}
          {/* {filteredJobs.slice((currentPage-1)*6, currentPage*6).map((job: any, index: number) => {
            return <JobCard key={index} job={job} />
          })} */}
        </div>

        {/* Pagination */}

        {filteredCars.length > 0 && (
           <div className='flex items-center justify-center space-x-2 mt-10'>
            <a href="#job-list">
              <img onClick={()=>setCurrentPage(Math.max((currentPage-1),1))} src={assets.left_arrow_icon} alt="" />
            </a>
            {Array.from({length:Math.ceil(filteredCars.length/6)}).map((_, index)=>(
              <a key={index} href="#job-list">
                <button onClick={() => setCurrentPage(index+1)} className={`w-10 cursor-pointer h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>{index+1}</button>
              </a>
            ))}
             <a href="#job-list">
              <img onClick={()=>setCurrentPage(Math.min((currentPage+1), Math.ceil(filteredCars.length / 6)))} src={assets.right_arrow_icon} alt="" />
            </a>
          </div>
        )}

      </section>
    </div >
  )
}

export default JobListing