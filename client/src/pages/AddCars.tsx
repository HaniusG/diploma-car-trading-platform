import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { CarCategories, CarLocations } from '../assets/assets'
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

  const { backendUrl, companyToken } = useContext(AppContext)

  const editorRef = useRef<any>(null)
  const quillRef = useRef<any>(null)

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

      if (image) {
        formData.append('image', image)
      }

      const { data } = await axios.post(backendUrl + '/api/company/post-car',
        formData,
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success("Car posted successfully")
        setTitle('')
        setPrice(0)
        setImage(null)
        quillRef.current.root.innerHTML = ""
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
          onChange={e => setTitle(e.target.value)}
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
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setCategory(e.target.value)}>
            {CarCategories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Location</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLocation(e.target.value)}>
            {CarLocations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Condition</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setCondition(e.target.value)}>
            <option value="Beginner level">New</option>
            <option value="Intermediate level">Very good</option>
            <option value="Senior level">Good</option>
            <option value="Senior level">Needs Repair</option>
            <option value="Senior level">Damaged</option>
          </select>
        </div>
      </div>

      <div>
        <p className='mb-2'>Price</p>
        <input min={0} className='w-full px-3 py-2 border-2 border-gray-300 roundded sm:w-[120px]' onChange={e => setPrice(Number(e.target.value))} type="Number" placeholder='2500' />
      </div>

      <button className='w-28 py-3 mt-4 bg-black text-white rounded cursor-pointer'>ADD</button>
    </form>
  )
}

export default AddJobs