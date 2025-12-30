import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const { backendurl } = useContext(AppContext)
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === '') {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text');
    const pasteArray = pastedData.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true)
      const { data } = await axios.post(backendurl + '/api/auth/sent-reset-otp', { email })
      if (data.success) {
        toast.success(data.message)
        setIsEmailSent(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true)
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')
      
      const { data } = await axios.post(backendurl + '/api/auth/reset-password', { email, otp, newPassword })
      
      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className='absolute cursor-pointer left-5 sm:left-20 top-5 w-28 sm:w-32' />

      {/* Form 1: Enter Email */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className='p-8 text-sm rounded-lg shadow-lg bg-slate-900 w-96'>
          <h1 className='mb-4 text-2xl font-semibold text-center text-white'>Reset Password</h1>
          <p className='mb-6 text-center text-indigo-300'>Enter your registered email address.</p>
          
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email ID"
              className="w-full text-sm bg-transparent outline-none"
              required
            />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
             {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </form>
      )}

      {/* Form 2: Enter OTP and New Password */}
      {isEmailSent && (
        <form onSubmit={onSubmitOTP} className='p-8 text-sm rounded-lg shadow-lg bg-slate-900 w-96'>
          <h1 className='mb-4 text-2xl font-semibold text-center text-white'>Reset Password OTP</h1>
          <p className='mb-6 text-center text-indigo-300'>Enter the 6-digit code sent to your email.</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                className='w-12 h-12 text-center text-xl text-white bg-[#333A5C] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full text-sm bg-transparent outline-none"
              required
            />
          </div>

          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            {isSubmitting ? 'Resetting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPassword