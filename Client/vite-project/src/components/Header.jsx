import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom' // Import useNavigate

const Header = () => {

  const { user } = useContext(AppContext)
  const navigate = useNavigate() // Initialize hook

  const handleGetStarted = () => {
    // Example logic: If not logged in, go to Login. 
    // If logged in, you might want to scroll down or go to a dashboard.
    if (!user) {
      navigate('/login')
    } else {
      console.log("User is already logged in!")
    }
  }

  return (
    <div className='flex flex-col items-center px-4 mt-20 text-center text-gray-800'>
      <img src={assets.header_img} alt="" className='mb-6 rounded-full w-36 h-36' />
      
      <h1 className='flex items-center gap-2 mb-2 text-xl font-medium sm:text-3xl'>
         {/* Standard way to greet: User Name or "Developer" */}
         Hey {user ? user.name : 'Developer'}!
         <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
      </h1>

      <h2 className='mb-4 text-3xl font-semibold sm:text-5xl'>Welcome to our APP</h2>
      
      <p className='max-w-md mb-8'>
        Let's start with a quick product tour and we will have you up and running in no time!
      </p>

      {/* FIX: Changed "Get Start" to "Get Started" and added click handler */}
      <button 
        onClick={handleGetStarted}
        className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>
        Get Started
      </button>
   
    </div>
  )
}

export default Header