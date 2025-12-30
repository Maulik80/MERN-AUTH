import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure CSS is imported

import Login from './pages/Login'
import Home from './pages/Home'
import EmailVerify from './pages/EmailVerify'; // Fixed relative path
import ResetPassword from './pages/ResetPassword' // FIX: Changed 'Pages' to 'pages'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        
        {/* FIX: Corrected spelling 'passwprd' -> 'password' */}
        <Route path='/reset-password' element={<ResetPassword />} /> 
      </Routes>
    </div>
  )
}

export default App