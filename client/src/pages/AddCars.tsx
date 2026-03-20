import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import {
  CarCategories,
  CarLocations,
  CarBrands,
  CarTransmissions,
  CarFuelTypes,
  CarDrivetrains,
} from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const AddJobs = () => {

  const [title, setTitle] = useState<string>('')
  const [location, setLocation] = useState<string>('Yerevan')
  const [category, setCategory] = useState<string>('Sedan')
  const [condition, setCondition] = useState<string>('New')
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null)

  // specs
  const [brand, setBrand] = useState<string>('Mercedes-Benz')
  const [model, setModel] = useState<string>('')
  const [isBrandManuallyEdited, setIsBrandManuallyEdited] = useState<boolean>(false)
  const [isModelManuallyEdited, setIsModelManuallyEdited] = useState<boolean>(false)
  const [year, setYear] = useState<number>(2020)
  const [isYearManuallyEdited, setIsYearManuallyEdited] = useState<boolean>(false)
  const [mileage, setMileage] = useState<number>(0)
  const [transmission, setTransmission] = useState<string>('Automatic')
  const [fuelType, setFuelType] = useState<string>('Petrol')
  const [color, setColor] = useState<string>('Black')
  const [seats, setSeats] = useState<number>(4)

  const [engineSize, setEngineSize] = useState<number | ''>('')
  const [horsepower, setHorsepower] = useState<number | ''>('')
  const [torque, setTorque] = useState<number | ''>('')
  const [cylinders, setCylinders] = useState<number | ''>('')
  const [fuelConsumption, setFuelConsumption] = useState<number | ''>('')
  const [gears, setGears] = useState<number | ''>('')
  const [drivetrain, setDrivetrain] = useState<string>('FWD')
  const [steering, setSteering] = useState<string>('Left')

  const { backendUrl, userToken } = useContext(AppContext)

  const editorRef = useRef<any>(null)
  const quillRef = useRef<any>(null)

  const normalizeForMatch = (value: string) => {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .trim()
  }

  const guessBrandFromTitle = (titleValue: string) => {
    const titleNorm = normalizeForMatch(titleValue)
    if (!titleNorm) return ''

    let bestBrand = ''
    let bestLen = 0

    for (const b of CarBrands) {
      const brandNorm = normalizeForMatch(b)
      if (!brandNorm) continue
      // Prefer the longest matching brand
      if (titleNorm.includes(brandNorm) && brandNorm.length > bestLen) {
        bestBrand = b
        bestLen = brandNorm.length
      }
    }

    return bestBrand
  }

  const guessModelFromTitle = (titleValue: string, matchedBrand: string) => {
    const tokens = String(titleValue)
      .split(/[^a-zA-Z0-9]+/g)
      .map((t) => t.trim())
      .filter(Boolean)

    if (tokens.length === 0) return ''

    // Remove year tokens (e.g., 2020, 2019, etc.)
    const yearLike = new Set<string>()
    for (const t of tokens) {
      const n = Number(t)
      if (Number.isFinite(n) && n >= 1900 && n <= 2100) {
        yearLike.add(t)
      }
    }

    // Remove brand tokens (brand may be multi-word like "Mercedes-Benz")
    const brandTokens = normalizeForMatch(matchedBrand)
      ? matchedBrand
        .split(/[^a-zA-Z0-9]+/g)
        .map((t) => normalizeForMatch(t))
        .filter(Boolean)
      : []

    const brandTokenSet = new Set(brandTokens)

    const remaining = tokens.filter((t) => {
      const tn = normalizeForMatch(t)
      if (yearLike.has(t)) return false
      if (brandTokenSet.has(tn)) return false
      return true
    })

    // Model is usually the remaining significant words
    return remaining.join(' ').trim()
  }

  const guessYearFromTitle = (titleValue: string) => {
    const tokens = String(titleValue)
      .split(/[^a-zA-Z0-9]+/g)
      .map((t) => t.trim())
      .filter(Boolean)

    for (const t of tokens) {
      const n = Number(t)
      if (Number.isFinite(n) && n >= 1900 && n <= 2100) {
        return n
      }
    }
    return ''
  }

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle)

    // Only auto-fill if the user hasn't manually edited the corresponding fields
    const canAutoBrand = !isBrandManuallyEdited
    const canAutoModel = !isModelManuallyEdited
    const canAutoYear = !isYearManuallyEdited
    if (!canAutoBrand && !canAutoModel && !canAutoYear) return

    if (nextTitle.trim().length < 2) return

    if (canAutoYear) {
      const autoYear: any = guessYearFromTitle(nextTitle)
      if (autoYear) setYear(autoYear)
    }

    const autoBrand = guessBrandFromTitle(nextTitle)

    if (canAutoBrand && autoBrand) {
      setBrand(autoBrand)
    }

    if (canAutoModel) {
      const brandForModel = canAutoBrand ? (autoBrand || brand) : brand
      const autoModel = guessModelFromTitle(nextTitle, brandForModel)
      if (autoModel) setModel(autoModel)
    }
  }

  const onSubmitHandler = async (e: any) => {
    e.preventDefault()

    try {

      const description = quillRef.current.root.innerHTML

      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('location', location)
      formData.append('price', price.toString())
      formData.append('category', category)
      formData.append('condition', condition)

      // specs
      formData.append('brand', brand)
      formData.append('model', model)
      formData.append('year', year.toString())
      formData.append('mileage', mileage.toString())
      formData.append('transmission', transmission)
      formData.append('fuelType', fuelType)
      formData.append('color', color)
      formData.append('seats', seats.toString())

      if (engineSize !== '') formData.append('engineSize', String(engineSize))
      if (horsepower !== '') formData.append('horsepower', String(horsepower))
      if (torque !== '') formData.append('torque', String(torque))
      if (cylinders !== '') formData.append('cylinders', String(cylinders))
      if (fuelConsumption !== '') formData.append('fuelConsumption', String(fuelConsumption))
      if (gears !== '') formData.append('gears', String(gears))
      if (drivetrain) formData.append('drivetrain', drivetrain)
      if (steering) formData.append('steering', steering)

      if (image) {
        formData.append('image', image)
      }

      const { data } = await axios.post(backendUrl + '/api/seller/post-car',
        formData,
        { headers: { token: userToken } }
      )

      if (data.success) {
        toast.success("Car posted successfully")
        // reset main fields
        setTitle('')
        setLocation('Yerevan')
        setCategory('Sedan')
        setCondition('New')
        setPrice(0)
        setImage(null)
        quillRef.current.root.innerHTML = ""
        // reset specs
        setBrand('Mercedes-Benz')
        setModel('')
        setYear(2020)
        setMileage(0)
        setTransmission('Automatic')
        setFuelType('Petrol')
        setColor('Black')
        setSeats(4)
        setEngineSize('')
        setHorsepower('')
        setTorque('')
        setCylinders('')
        setFuelConsumption('')
        setGears('')
        setDrivetrain('FWD')
        setSteering('Left')
        setIsBrandManuallyEdited(false)
        setIsModelManuallyEdited(false)
        setIsYearManuallyEdited(false)
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      toast.error(error.message)
    }


  }

  useEffect(() => {
    // Initiate Quill 1x

    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',

      })
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
      <div className='w-full'>
        <p className='mb-2'>Title</p>
        <input
          type="text"
          placeholder='Type here'
          onChange={e => handleTitleChange(e.target.value)}
          value={title}
          required
          className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <div className='w-full max-w-lg'>
        <p className='my-2'>Description</p>
        <div ref={editorRef}>

        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Category</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' value={category} onChange={e => setCategory(e.target.value)}>
            {CarCategories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Location</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' value={location} onChange={e => setLocation(e.target.value)}>
            {CarLocations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Condition</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="New">New</option>
            <option value="Very good">Very good</option>
            <option value="Good">Good</option>
            <option value="Needs Repair">Needs Repair</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>
      </div>

      <div>
        <p className='mb-2'>Price</p>
        <input
          min={0}
          className='w-full px-3 py-2 border-2 border-gray-300 roundded sm:w-[120px]'
          onChange={e => setPrice(Number(e.target.value))}
          type="number"
          placeholder='2500'
        />
      </div>

      {/* Specs section */}
      <div className='flex flex-col gap-4 w-full mt-4'>
        {/* Brand & Model */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <p className='mb-2'>Brand</p>
            <select
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={brand}
              onChange={e => {
                setIsBrandManuallyEdited(true)
                setBrand(e.target.value)
              }}
            >
              {CarBrands.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className='flex-1'>
            <p className='mb-2'>Model</p>
            <input
              type="text"
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={model}
              onChange={e => {
                setIsModelManuallyEdited(true)
                setModel(e.target.value)
              }}
              required
            />
          </div>
        </div>

        {/* Year & Mileage */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <p className='mb-2'>Year</p>
            <input
              type="number"
              min={1900}
              max={2100}
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={year}
              onChange={e => {
                setIsYearManuallyEdited(true)
                setYear(Number(e.target.value))
              }}
              required
            />
          </div>

          <div className='flex-1'>
            <p className='mb-2'>Mileage (km)</p>
            <input
              type="number"
              min={0}
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={mileage}
              onChange={e => setMileage(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Transmission, Fuel, Color, Seats */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <p className='mb-2'>Transmission</p>
            <select
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={transmission}
              onChange={e => setTransmission(e.target.value)}
            >
              {CarTransmissions.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className='flex-1'>
            <p className='mb-2'>Fuel Type</p>
            <select
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={fuelType}
              onChange={e => setFuelType(e.target.value)}
            >
              {CarFuelTypes.map((f, i) => (
                <option key={i} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <p className='mb-2'>Color</p>
            <input
              type="text"
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={color}
              onChange={e => setColor(e.target.value)}
              required
            />
          </div>

          <div className='flex-1'>
            <p className='mb-2'>Seats</p>
            <input
              type="number"
              min={1}
              max={9}
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={seats}
              onChange={e => setSeats(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Optional specs */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <p className='mb-2'>Engine Size (L)</p>
            <input
              type="number"
              min={0}
              step="0.1"
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={engineSize}
              onChange={e => setEngineSize(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <div className='flex-1'>
            <p className='mb-2'>Horsepower (HP)</p>
            <input
              type="number"
              min={0}
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={horsepower}
              onChange={e => setHorsepower(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <p className='mb-2'>Torque (Nm)</p>
            <input
              type="number"
              min={0}
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={torque}
              onChange={e => setTorque(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <div className='flex-1'>
            <p className='mb-2'>Cylinders</p>
            <input
              type="number"
              min={0}
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={cylinders}
              onChange={e => setCylinders(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <p className='mb-2'>Fuel Consumption (L/100km)</p>
            <input
              type="number"
              min={0}
              step="0.1"
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={fuelConsumption}
              onChange={e => setFuelConsumption(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <div className='flex-1'>
            <p className='mb-2'>Gears</p>
            <input
              type="number"
              min={0}
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={gears}
              onChange={e => setGears(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <p className='mb-2'>Drivetrain</p>
            <select
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={drivetrain}
              onChange={e => setDrivetrain(e.target.value)}
            >
              {CarDrivetrains.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className='flex-1'>
            <p className='mb-2'>Steering</p>
            <select
              className='w-full px-3 py-2 border-2 border-gray-300 rounded'
              value={steering}
              onChange={e => setSteering(e.target.value)}
            >
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
          </div>
        </div>
      </div>

      <button className='w-28 py-3 mt-4 bg-black text-white rounded cursor-pointer'>ADD</button>
    </form>
  )
}

export default AddJobs