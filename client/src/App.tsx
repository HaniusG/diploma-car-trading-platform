import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/SellerLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddCars from './pages/AddCars'
import ManageCars from './pages/ManageCars'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import { ToastContainer} from 'react-toastify';

const App = () => {

  const { showRecruiterLogin, sellerToken } = useContext(AppContext)

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/dashboard' element={<Dashboard />}>
          {sellerToken ? <>
            <Route path='add-car' element={<AddCars />} />
            <Route path='manage-cars' element={<ManageCars />} />
            <Route path='view-applications' element={<ViewApplications />} />
          </> : null}

        </Route>
      </Routes>
    </div>
  )
}

export default App