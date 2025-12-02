import { createContext, useEffect, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

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
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}