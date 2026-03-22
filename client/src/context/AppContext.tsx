import { createContext, useEffect, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";

type Seller = {
  _id: string;
  name: string;
  email: string;
  image: string;
  __v: number;
};

 export type Job = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number;
  level: string;
  visible: boolean;
  date: number;
  sellerId: string | Seller;
  __v: number;
};

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  image: string;
  __v: number;
};

export type UserApplication = {
  _id: string;
  userId: string;
  sellerId: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };

  carId: {
    _id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    location: string;
    salary: number;
  };

  status: string;
  date: number;
  __v: number;
};

export const AppContext = createContext<any>(null)

export const AppContextProvider = (props: any) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [searchFilter, setSearchFilter] = useState<{title: string, location: string}>({
    title: '',
    location: ''
  });

  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [cars, setCars] = useState<any>([])
  const [showLogin, setShowLogin] = useState<boolean>(false)
  const [userToken, setUserToken] = useState(null)
  const [userData, setUserData] = useState(null)
  // const [userData, setUserData] = useState<UserProfile | null>(null)
  const [buyerApplications, setBuyerApplications] = useState<UserApplication[]>([])
  const [role, setRole] = useState<string>('')

  //Function fetching car data
  const fetchCars = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/cars')

      if (data.success) {
        setCars(data.cars)
        console.log(data.cars);
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Function to fetch seller data
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/user', { headers: { token: userToken } })

      if (data.success) {
        setUserData(data.user)
        if (data.user?.role) setRole(String(data.user.role))
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Funtion to fetch user's applied applications
  const fetchBuyerApplications = async () => {
    try {
      if (!userToken) return

      const {data} = await axios.get(backendUrl+'/api/users/applications',
        {headers: {token: userToken}}
      )

      if (data.success) {
        setBuyerApplications(data.applications)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCars();

    const storedUserToken: any = localStorage.getItem('userToken')

    if (storedUserToken) {
      setUserToken(storedUserToken)
    }

  }, [])

  useEffect(() => {
    if (userToken) {
      fetchUserData()
      fetchBuyerApplications()
    }
  }, [userToken])

  const value: any = {
    searchFilter, setSearchFilter,
    isSearched, setIsSearched,
    cars, setCars,
    showLogin, setShowLogin,
    userToken, setUserToken,
    userData, setUserData,
    backendUrl,
    // userData, setUserData,
    buyerApplications, setBuyerApplications,
    role, setRole,
    fetchUserData,
    fetchBuyerApplications,
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}