import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from 'react-toastify';


export const AppContext =createContext()


export const AppContextProvider=(props)=>{

  axios.defaults.withCredentials=true;

    const  backendurl = import.meta.env.VITE_BACKEND_URL
    const[isLoggedin,setIsLoggedin]=useState(false)
    const[user,setUserData]=useState(null)

    
    const getAuthState = async () => {
  try {
    const { data } = await axios.get(backendurl + '/api/auth/is-auth'); 
    if (data.success) {
      setIsLoggedin(true);
      getUserData();
    } else {
      toast.error(error?.response?.data?.message );
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
  }
};

    const getUserData = async () => {
  try {
    const { data } = await axios.get(backendurl + '/api/user/data'); 
    if (data.success) {
      setUserData(data.user); 
    } else {
      toast.error(error?.response?.data?.message );
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message );
  }
}
    useEffect(()=>{
        getAuthState();
    },[])
    
    const value={
        backendurl,
        isLoggedin,setIsLoggedin,
        user,setUserData,
        getUserData
    }

    return(
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
    ) 
}
 
// 4.5