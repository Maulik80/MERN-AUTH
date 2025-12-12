import React, { useContext } from 'react';
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

  // Handle email verification
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

  // Handle logout
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
    <div className="w-full flex justify-between items-center px-4 sm:px-24 py-4 bg-white shadow-md fixed top-0 z-50">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* Right side: either User Bubble or Login button */}
      {user ? (
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold text-lg">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          {/* Dropdown on hover */}
          <div className="absolute hidden group-hover:block right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
            <ul className="text-sm text-gray-700 py-2">
              {!user?.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
