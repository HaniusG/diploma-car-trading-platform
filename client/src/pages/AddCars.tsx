import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import {
  CarCategories,
  CarLocations,
  CarBrands,
  CarTransmissions,
  CarFuelTypes,
  CarDrivetrains,
  CarSteeringTypes,
  CarConditions,
} from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const AddCars = () => {

  const initialSpecs = {
    brand: 'Mercedes-Benz',
    model: '',
    year: 2020,
    mileage: 0,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Black',
    seats: 4,
    engineSize: '' as number | '',
    horsepower: '' as number | '',
    torque: '' as number | '',
    cylinders: '' as number | '',
    fuelConsumption: '' as number | '',
    gears: '' as number | '',
    drivetrain: 'FWD',
    steering: 'Left',
  }

  const [formData, setFormData] = useState({
    title: '',
    location: 'Yerevan',
    category: 'Sedan',
    condition: 'New',
    price: 0,
    ...initialSpecs
  })

  const [image, setImage] = useState<File | null>(null)
  
  const [manualEdits, setManualEdits] = useState({
    brand: false,
    model: false,
    year: false,
  })

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
      if (titleNorm.includes(brandNorm) && brandNorm.length > bestLen) {
        bestBrand = b
        bestLen = brandNorm.length
      }
    }
    return bestBrand
  }

  const guessModelFromTitle = (titleValue: string, matchedBrand: string) => {
    const tokens = String(titleValue).split(/[^a-zA-Z0-9]+/g).map(t => t.trim()).filter(Boolean)
    if (tokens.length === 0) return ''
    const yearLike = new Set<string>()
    for (const t of tokens) {
      const n = Number(t)
      if (Number.isFinite(n) && n >= 1900 && n <= 2100) yearLike.add(t)
    }
    const brandTokens = normalizeForMatch(matchedBrand)
      ? matchedBrand.split(/[^a-zA-Z0-9]+/g).map(t => normalizeForMatch(t)).filter(Boolean)
      : []
    const brandTokenSet = new Set(brandTokens)
    const remaining = tokens.filter(t => {
      const tn = normalizeForMatch(t)
      return !yearLike.has(t) && !brandTokenSet.has(tn)
    })
    return remaining.join(' ').trim()
  }

  const guessYearFromTitle = (titleValue: string) => {
    const tokens = String(titleValue).split(/[^a-zA-Z0-9]+/g).map(t => t.trim()).filter(Boolean)
    for (const t of tokens) {
      const n = Number(t)
      if (Number.isFinite(n) && n >= 1900 && n <= 2100) return n
    }
    return ''
  }

  const handleTitleChange = (nextTitle: string) => {
    setFormData(prev => ({ ...prev, title: nextTitle }))
    if (manualEdits.brand && manualEdits.model && manualEdits.year) return
    if (nextTitle.trim().length < 2) return

    let updates: any = {}
    if (!manualEdits.year) {
      const autoYear = guessYearFromTitle(nextTitle)
      if (autoYear) updates.year = autoYear
    }
    const autoBrand = guessBrandFromTitle(nextTitle)
    if (!manualEdits.brand && autoBrand) {
      updates.brand = autoBrand
    }
    if (!manualEdits.model) {
      const brandForModel = !manualEdits.brand ? (autoBrand || formData.brand) : formData.brand
      const autoModel = guessModelFromTitle(nextTitle, brandForModel)
      if (autoModel) updates.model = autoModel
    }
    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({ ...prev, ...updates }))
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field in manualEdits) {
      setManualEdits(prev => ({ ...prev, [field]: true }))
    }
  }

  const onSubmitHandler = async (e: any) => {
    e.preventDefault()
    try {
      const description = quillRef.current.root.innerHTML
      const submissionData = new FormData()
      
      // Essential fields
      const essentialFields = ['title', 'location', 'category', 'condition', 'price']
      essentialFields.forEach(f => submissionData.append(f, (formData as any)[f].toString()))
      submissionData.append('description', description)
      if (image) submissionData.append('image', image)

      // Specs
      const specKeys = Object.keys(initialSpecs)
      specKeys.forEach(key => {
        const val = (formData as any)[key]
        if (val !== '') submissionData.append(key, val.toString())
      })

      const { data } = await axios.post(`${backendUrl}/api/seller/post-car`,
        submissionData,
        { headers: { token: userToken } }
      )

      if (data.success) {
        toast.success("Car posted successfully")
        setFormData({
          title: '',
          location: 'Yerevan',
          category: 'Sedan',
          condition: 'New',
          price: 0,
          ...initialSpecs
        })
        setImage(null)
        setManualEdits({ brand: false, model: false, year: false })
        quillRef.current.root.innerHTML = ""
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  const renderSelect = (label: string, field: string, options: string[]) => (
    <div className='flex-1'>
      <p className='mb-2'>{label}</p>
      <select 
        className='w-full px-3 py-2 border-2 border-gray-300 rounded' 
        value={(formData as any)[field]} 
        onChange={e => handleInputChange(field, e.target.value)}
      >
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
    </div>
  )

  const renderInput = (label: string, field: string, type: string = 'text', props: any = {}) => (
    <div className='flex-1'>
      <p className='mb-2'>{label}</p>
      <input
        type={type}
        className='w-full px-3 py-2 border-2 border-gray-300 rounded'
        value={(formData as any)[field]}
        onChange={e => handleInputChange(field, type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        {...props}
      />
    </div>
  )

  return (
    <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
      <div className='w-full'>
        <p className='mb-2'>Title</p>
        <input
          type="text"
          placeholder='Type here'
          onChange={e => handleTitleChange(e.target.value)}
          value={formData.title}
          required
          className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'
        />
      </div>

      <div className='flex flex-col gap-1'>
        <p className='mb-1'>Car Image</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className='text-sm'
        />
      </div>

      <div className='w-full max-w-lg'>
        <p className='my-2'>Description</p>
        <div ref={editorRef} className='bg-white'></div>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        {renderSelect('Category', 'category', CarCategories)}
        {renderSelect('Location', 'location', CarLocations)}
        {renderSelect('Condition', 'condition', CarConditions)}
      </div>

      <div className='w-full'>
        {renderInput('Price', 'price', 'number', { min: 0, placeholder: '2500', className: 'w-full max-w-[200px] px-3 py-2 border-2 border-gray-300 rounded' })}
      </div>

      <div className='flex flex-col gap-4 w-full mt-4 border-t pt-4'>
        <h3 className='font-semibold text-lg'>Detailed Specifications</h3>
        
        <div className='flex flex-col sm:flex-row gap-4'>
          {renderSelect('Brand', 'brand', CarBrands)}
          {renderInput('Model', 'model', 'text', { required: true })}
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {renderInput('Year', 'year', 'number', { min: 1900, max: 2100, required: true })}
          {renderInput('Mileage (km)', 'mileage', 'number', { min: 0, required: true })}
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {renderSelect('Transmission', 'transmission', CarTransmissions)}
          {renderSelect('Fuel Type', 'fuelType', CarFuelTypes)}
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {renderInput('Color', 'color')}
          {renderInput('Seats', 'seats', 'number', { min: 1, max: 20 })}
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {renderInput('Engine Size (L)', 'engineSize', 'number', { step: '0.1', min: 0 })}
          {renderInput('Horsepower (HP)', 'horsepower', 'number', { min: 0 })}
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {renderInput('Torque (Nm)', 'torque', 'number', { min: 0 })}
          {renderInput('Cylinders', 'cylinders', 'number', { min: 0 })}
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {renderInput('Fuel Consumption (L/100km)', 'fuelConsumption', 'number', { step: '0.1', min: 0 })}
          {renderInput('Gears', 'gears', 'number', { min: 0 })}
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {renderSelect('Drivetrain', 'drivetrain', CarDrivetrains)}
          {renderSelect('Steering', 'steering', CarSteeringTypes)}
        </div>
      </div>

      <button className='w-28 py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded cursor-pointer transition-colors'>
        POST CAR
      </button>
    </form>
  )
}

export default AddCars;