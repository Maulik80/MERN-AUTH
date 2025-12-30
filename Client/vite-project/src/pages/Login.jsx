import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate()
  const { backendurl, setIsLoggedin, getUserData } = useContext(AppContext)

  // FIX: Using string state, but carefully. Ideally, use a boolean like 'isSignup'.
  // Keeping logic simple: 'Sign Up' vs 'Login'
  const [state, setState] = useState('Sign Up');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true
      
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendurl + '/api/auth/register', { name, email, password })

        if (data.success) {
          setIsLoggedin(true);
          await getUserData();
          navigate('/');
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendurl + '/api/auth/login', { email, password })

        if (data.success) {
          setIsLoggedin(true);
          await getUserData();
          navigate('/');
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute cursor-pointer left-5 sm:left-20 top-5 w-28 sm:w-32"
      />

      <div className="w-full max-w-md px-6 py-10 bg-white shadow-lg rounded-2xl">
        <h2 className="mb-3 text-3xl font-semibold text-center">
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </h2>
        <p className="mb-6 text-sm text-center text-gray-500">
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}
        </p>

        <form onSubmit={onSubitHandler}>
          {state === 'Sign Up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
                className="w-full text-sm bg-transparent outline-none"
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email ID"
              required
              className="w-full text-sm bg-transparent outline-none"
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="w-full text-sm bg-transparent outline-none"
            />
          </div>
          
          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>
            Forgot Password?
          </p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>
            {state}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className='mt-4 text-xs text-center text-gray-500'>
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className='text-blue-400 underline cursor-pointer'>Login here</span>
          </p>
        ) : (
          <p className='mt-4 text-xs text-center text-gray-500'>
            Don't have an account?{' '}
            <span onClick={() => setState('Sign Up')} className='text-blue-400 underline cursor-pointer'>Sign Up</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;