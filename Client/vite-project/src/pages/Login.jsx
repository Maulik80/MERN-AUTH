
import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import {useNavigate} from'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';

 const Login = () => {

  const navigate = useNavigate()

const {backendurl,setIsLoggedin,getUserData} = useContext(AppContext)

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubitHandler = async(e)=>{

    try {
      e.preventDefault();
      axios.defaults.withCredentials=true
      if (state==='Sign Up') {
        const{data}=await axios.post(backendurl+'/api/auth/register',{name,email,password})

        if(data.success){
          setIsLoggedin(true);
         await getUserData();
          navigate('/');
        }
        else{
        toast.error(data.message)
        }
      } else {
        const{data}=await axios.post(backendurl+'/api/auth/login',{email,password})

        if(data.success){
          setIsLoggedin(true);
         await getUserData();
          navigate('/');
          console.log(data);
        }
        else{
        toast.error(data.message)
        }
      }
    } catch (error) {
     
  toast.error(error?.response?.data?.message );//|| "Something went wrong!"
        }
  }

  return (
    
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 relative">
      <img
        onClick={()=>navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-white px-6 py-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-3">
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}
        </p>

        <form onSubmit={onSubitHandler}>
          {state === 'Sign Up'&& (<div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.person_icon} alt="" />
            <input
              onChange={e=>setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Full Name"
              required
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>)}
          
           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e=>setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email ID"
              required
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={e=>setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <p
          onClick={()=>navigate('/reset-passwprd')}
          className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>

            {state === 'Sign Up'? (
 <p className='text-gray-500 text-center text-xs mt-4'>
           Already have an account?{' '}
           <span onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>
            ):(

        <p className='text-gray-500 text-center text-xs mt-4'>
           Don't have an account?{' '}
           <span onClick={()=>setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
        </p>
            )}

       
      </div>
    </div>
    
  );
};

export default Login;
// 3.42.45