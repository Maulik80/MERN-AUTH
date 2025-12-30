import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const {
    user,
    setUserData,
    backendurl,
    getUserData,
    setIsLoggedin,
  } = useContext(AppContext);

  const [showDropdown, setShowDropdown] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendurl}/api/auth/sent-verify-otp`);

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
        toast.success(data.message);
        navigate('/email-verify');
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendurl}/api/auth/logout`);

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/');
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed top-0 z-50 flex items-center justify-between w-full px-4 py-4 bg-white shadow-md sm:px-24">
      <img
        src={assets.logo}
        alt="Logo"
        className="cursor-pointer w-28"
        onClick={() => navigate('/')}
      />

      {user ? (
        <div 
          className="relative cursor-pointer group"
          // FIX: Toggle dropdown on click (Standard Desktop Behavior)
          onClick={() => setShowDropdown(!showDropdown)} 
        >
          <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold text-white bg-indigo-600 rounded-full">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          {showDropdown && (
            <div className="absolute right-0 z-50 w-40 mt-2 bg-white border rounded-md shadow-md">
              <ul className="py-2 text-sm text-gray-700">
                {!user?.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={logout}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-6 py-2 text-gray-800 transition-all border border-gray-500 rounded-full hover:bg-gray-100"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;