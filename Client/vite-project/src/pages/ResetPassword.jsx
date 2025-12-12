import React from 'react'
import { assets } from '../assets/assets'
import { Navigate, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
          <img  
          onClick={()=>navigate('/')}
          src={assets.logo} 
          alt="" 
          className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
          <form  className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
    <h1 className='text-white text-2xl font-semibold text-center mb-4'>
      Reset Password
    </h1>
     <p className='text-indigo-300 text-center mb-6'>
      Enter your registered email Address.
      </p>


          </form>
    </div>
  )
}

export default ResetPassword
