import { createContext, useEffect, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

const cars = [
  {
    id: 0,
    title: "Toyota Corolla",
    category: "Sedan",
    location: "Yerevan",
    price_usd: 23000,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Toyota_Corolla_Hybrid_%28E210%29_IMG_4338.jpg/960px-Toyota_Corolla_Hybrid_%28E210%29_IMG_4338.jpg"
  },
  {
    id: 1,
    title: "Toyota RAV4",
    category: "SUV",
    location: "Gyumri",
    price_usd: 30000,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/2019_Toyota_RAV4_LE_2.5L_front_4.14.19.jpg/960px-2019_Toyota_RAV4_LE_2.5L_front_4.14.19.jpg"
  },
  {
    id: 2,
    title: "Honda Civic",
    category: "Sedan",
    location: "Vanadzor",
    price_usd: 22000,
    img: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg"
  },
  {
    id: 3,
    title: "Honda CR-V",
    category: "SUV",
    location: "Kapan",
    price_usd: 26000,
    img: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Honda_CR-V_e-HEV_Elegance_AWD_%28VI%29_%E2%80%93_f_14072024.jpg"
  },
  {
    id: 4,
    title: "Nissan Rogue",
    category: "SUV",
    location: "Artashat",
    price_usd: 28000,
    img: "https://upload.wikimedia.org/wikipedia/commons/4/41/2023_Nissan_Rogue_SV_in_Super_Black%2C_front_left.jpg"
  },
  {
    id: 5,
    title: "Tesla Model 3",
    category: "Electric vehicle (EV)",
    location: "Abovyan",
    price_usd: 39000,
    img: "https://upload.wikimedia.org/wikipedia/commons/9/91/2019_Tesla_Model_3_Performance_AWD_Front.jpg"
  },
  {
    id: 6,
    title: "Tesla Model Y",
    category: "Electric vehicle (EV)",
    location: "Yerevan",
    price_usd: 44000,
    img: "https://upload.wikimedia.org/wikipedia/commons/5/5e/2023_Tesla_Model_Y_Long_Range_All-Wheel_Drive_in_Pearl_White_Multi-Coat%2C_front_right%2C_2024-09-25.jpg"
  },
  {
    id: 7,
    title: "BYD Seal",
    category: "Sedan",
    location: "Gyumri",
    price_usd: 28000,
    img: "https://upload.wikimedia.org/wikipedia/commons/6/60/2022_BYD_Seal.jpg"
  },
  {
    id: 8,
    title: "Mercedes-Benz C-Class",
    category: "Sedan",
    location: "Vanadzor",
    price_usd: 50000,
    img: "https://upload.wikimedia.org/wikipedia/commons/b/be/Mercedes-Benz_W206_IMG_6380.jpg"
  },
  {
    id: 9,
    title: "Toyota Camry",
    category: "Sedan",
    location: "Artashat",
    price_usd: 25000,
    img: "https://upload.wikimedia.org/wikipedia/commons/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg"
  },
  {
    id: 10,
    title: "Nissan Leaf",
    category: "Electric vehicle (EV)",
    location: "Kapan",
    price_usd: 29000,
    img: "https://upload.wikimedia.org/wikipedia/commons/7/73/Nissan_Leaf_%28ZE2%29_autoMOBIL_T%C3%BCbingen_2025_DSC_2752.jpg"
  }
];



type Company = {
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
  companyId: string | Company;
  __v: number;
};

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  image: string;
  resume: string;
  __v: number;
};

export type UserApplication = {
  _id: string;
  userId: string;
  companyId: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };

  jobId: {
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

  const { user } = useUser()
  const { getToken } = useAuth()

  const [searchFilter, setSearchFilter] = useState<{title: string, location: string}>({
    title: '',
    location: ''
  });

  const [isSearched, setIsSearched] = useState<boolean>(false)

  const [jobs, setJobs] = useState<Job[]>([])

  const [showRecruiterLogin, setShowRecruiterLogin] = useState<boolean>(false)

  const [companyToken, setCompanyToken] = useState(null)
  const [companyData, setCompanyData] = useState(null)

  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [userApplications, setUserApplications] = useState<UserApplication[]>([])


  //Function fetching job data
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/jobs')

      if (data.success) {
        setJobs(data.jobs)
        console.log(data.jobs);
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })

      if (data.success) {
        setCompanyData(data.company)
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Function  to fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/users/user',
        { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setUserData(data.user)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Funtion to fetch user's applied applications
  const fetchUserApplications = async () => {
    try {
      const token = await getToken()

      const {data} = await axios.get(backendUrl+'/api/users/applications',
        {headers: {Authorization: `Bearer ${token}`}}
      )

      if (data.success) {
        setUserApplications(data.applications)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchJobs();

    const storedCompanyToken: any = localStorage.getItem('companyToken')

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken)
    }

  }, [])

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData()
    }
  }, [companyToken])

  useEffect(() => {
    if (user) {
      fetchUserData()
      fetchUserApplications()
    }
  }, [user])

  const value: any = {
    searchFilter, setSearchFilter,
    isSearched, setIsSearched,
    jobs, setJobs,
    showRecruiterLogin, setShowRecruiterLogin,
    companyToken, setCompanyToken,
    companyData, setCompanyData,
    backendUrl,
    userData, setUserData,
    userApplications, setUserApplications,
    fetchUserData,
    fetchUserApplications,
    cars
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}