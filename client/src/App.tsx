import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BuyCars from './pages/BuyCars'
import Applications from './pages/Applications'
import UserLogin from './components/UserLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddCars from './pages/AddCars'
import ManageCars from './pages/ManageCars'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import { ToastContainer} from 'react-toastify';

const App = () => {

  const { showLogin, userToken } = useContext(AppContext)

  return (
    <div>
      {showLogin && <UserLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/buy-car/:id' element={<BuyCars />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/dashboard' element={<Dashboard />}>
          {userToken ? <>
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