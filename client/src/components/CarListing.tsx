import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, CarCategories, CarLocations, CarDrivetrains, CarFuelTypes, CarSteeringTypes, CarConditions } from '../assets/assets'
import CarCard from './CarCard'

const CarListing = () => {

  const { isSearched, searchFilter, setSearchFilter, cars } = useContext(AppContext)

  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [filters, setFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    fuelType: '',
    drivetrain: '',
    steering: '',
    condition: '',
    mileageMin: '' as number | '',
    mileageMax: '' as number | '',
    priceMin: '' as number | '',
    priceMax: '' as number | '',
  });

  const [openCategory, setOpenCategory] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filteredCars, setFilteredCars] = useState<any>(cars)

  // Configuration for automated select filters
  const selectFilters = [
    { label: 'Fuel type', key: 'fuelType', options: CarFuelTypes },
    { label: 'Drivetrain', key: 'drivetrain', options: CarDrivetrains },
    { label: 'Steering', key: 'steering', options: CarSteeringTypes },
    { label: 'Condition', key: 'condition', options: CarConditions },
  ];

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(c => c !== location)
        : [...prev.locations, location]
    }));
  };

  useEffect(() => {
    const matchesCategory = (car: any) => filters.categories.length === 0 || filters.categories.includes(car.category)
    const matchesLocation = (car: any) => filters.locations.length === 0 || filters.locations.includes(car.location)
    const matchesTitle = (car: any) => searchFilter.title === '' || car.title.toLowerCase().includes(searchFilter.title.toLowerCase())
    const matchesSearchLocation = (car: any) => searchFilter.location === '' || car.location.toLowerCase().includes(searchFilter.location.toLowerCase())

    const matchesFuelType = (car: any) => filters.fuelType === '' || car?.specs?.fuelType === filters.fuelType
    const matchesDrivetrain = (car: any) => filters.drivetrain === '' || car?.specs?.drivetrain === filters.drivetrain
    const matchesSteering = (car: any) => filters.steering === '' || car?.specs?.steering === filters.steering
    const matchesCondition = (car: any) => filters.condition === '' || car.condition === filters.condition

    const matchesMileage = (car: any) => {
      const raw = car?.specs?.mileage
      const mv = typeof raw === 'number' ? raw : Number(raw)
      if (filters.mileageMin === '' && filters.mileageMax === '') return true
      if (!Number.isFinite(mv)) return false
      if (filters.mileageMin !== '' && mv < Number(filters.mileageMin)) return false
      if (filters.mileageMax !== '' && mv > Number(filters.mileageMax)) return false
      return true
    }

    const matchesPrice = (car: any) => {
      const pv = typeof car.price === 'number' ? car.price : Number(car.price)
      if (filters.priceMin === '' && filters.priceMax === '') return true
      if (!Number.isFinite(pv)) return false
      if (filters.priceMin !== '' && pv < Number(filters.priceMin)) return false
      if (filters.priceMax !== '' && pv > Number(filters.priceMax)) return false
      return true
    }

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
        matchesMileage(car) &&
        matchesPrice(car)
    )

    setFilteredCars(newFilteredCars);
    setCurrentPage(1)

  }, [
    cars,
    searchFilter,
    filters
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
          <h4
            className='font-medium text-lg py-4 cursor-pointer flex justify-between items-center'
            onClick={() => setOpenCategory(prev => !prev)}
          >
            Search by Categories
            <span>{openCategory ? "−" : "+"}</span>
          </h4>

          {openCategory && (
            <ul className='space-y-4 text-gray-600'>
              {CarCategories.map((category, index) => (
                <li className='flex gap-3 items-center' key={index}>
                  <input
                    className='scale-125'
                    type="checkbox"
                    onChange={() => handleCategoryChange(category)}
                    checked={filters.categories.includes(category)}
                  />
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Location Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4
            className='font-medium text-lg py-4 pt-5 cursor-pointer flex justify-between items-center'
            onClick={() => setOpenLocation(prev => !prev)}
          >
            Search by Location
            <span>{openLocation ? "−" : "+"}</span>
          </h4>

          {openLocation && (
            <ul className='space-y-4 text-gray-600'>
              {CarLocations.map((location, index) => (
                <li className='flex gap-3 items-center' key={index}>
                  <input
                    className='scale-125'
                    type="checkbox"
                    onChange={() => handleLocationChange(location)}
                    checked={filters.locations.includes(location)}
                  />
                  {location}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Specs Filters */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className='font-medium text-lg py-4 pt-5'>Search by Specs</h4>

          <div className='space-y-6 text-gray-700'>
            {selectFilters.map((sf) => (
              <div key={sf.key}>
                <label className='block text-sm mb-2'>{sf.label}</label>
                <select
                  className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                  value={(filters as any)[sf.key]}
                  onChange={(e) => setFilters(prev => ({ ...prev, [sf.key]: e.target.value }))}
                >
                  <option value=''>Any</option>
                  {sf.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}

            <div className='flex gap-3'>
              <div className='flex-1'>
                <label className='block text-sm mb-2'>Mileage min</label>
                <input
                  type='number'
                  min={0}
                  className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                  value={filters.mileageMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, mileageMin: e.target.value === '' ? '' : Number(e.target.value) }))}
                  placeholder='Min'
                />
              </div>

              <div className='flex-1'>
                <label className='block text-sm mb-2'>Mileage max</label>
                <input
                  type='number'
                  min={0}
                  className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                  value={filters.mileageMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, mileageMax: e.target.value === '' ? '' : Number(e.target.value) }))}
                  placeholder='Max'
                />
              </div>
            </div>

            <div className='flex gap-3'>
              <div className='flex-1'>
                <label className='block text-sm mb-2'>Price min</label>
                <input
                  type='number'
                  min={0}
                  className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                  value={filters.priceMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value === '' ? '' : Number(e.target.value) }))}
                  placeholder='Min'
                />
              </div>

              <div className='flex-1'>
                <label className='block text-sm mb-2'>Price max</label>
                <input
                  type='number'
                  min={0}
                  className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                  value={filters.priceMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value === '' ? '' : Number(e.target.value) }))}
                  placeholder='Max'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Car listing */}

      <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
        <h3 className='font-medium text-3xl py-2' id='car-list'>Latest cars</h3>
        <p className='mb-8'>Get your desired car</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {filteredCars.slice((currentPage - 1) * 6, currentPage * 6).map((car: any, index: number) => {
            return <CarCard key={index} car={car} />
          })}
        </div>

        {/* Pagination */}

        {filteredCars.length > 0 && (
          <div className='flex items-center justify-center space-x-2 mt-10'>
            <a href="#car-list">
              <img onClick={() => setCurrentPage(Math.max((currentPage - 1), 1))} src={assets.left_arrow_icon} alt="" />
            </a>
            {Array.from({ length: Math.ceil(filteredCars.length / 6) }).map((_, index) => (
              <a key={index} href="#car-list">
                <button onClick={() => setCurrentPage(index + 1)} className={`w-10 cursor-pointer h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>{index + 1}</button>
              </a>
            ))}
            <a href="#car-list">
              <img onClick={() => setCurrentPage(Math.min((currentPage + 1), Math.ceil(filteredCars.length / 6)))} src={assets.right_arrow_icon} alt="" />
            </a>
          </div>
        )}

      </section>
    </div >
  )
}

export default CarListing;