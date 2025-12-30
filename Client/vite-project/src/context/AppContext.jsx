import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { toast } from 'react-toastify';

export const AppContext = createContext()

export const AppContextProvider = (props) => {

  axios.defaults.withCredentials = true;

  const backendurl = import.meta.env.VITE_BACKEND_URL
  const [isLoggedin, setIsLoggedin] = useState(false)
  const [user, setUserData] = useState(null)

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendurl + '/api/auth/is-auth');
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
      // FIX: Removed 'else' block with toast. If not auth, just do nothing.
    } catch (error) {
      // FIX: Removed toast.error. We don't want to annoy visitors who are just not logged in yet.
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendurl + '/api/user/data');
      if (data.success) {
        setUserData(data.userData); // FIX: backend sends 'userData', ensure this matches controller
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAuthState();
  }, [])

  const value = {
    backendurl,
    isLoggedin, setIsLoggedin,
    user, setUserData,
    getUserData
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}