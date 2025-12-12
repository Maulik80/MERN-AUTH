import React,{useContext,useRef,useEffect} from 'react'
import { assets } from '../assets/assets.js'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const {backendurl,getUserData,isLoggedin,user} = useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
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
        inputRefs.current[index].dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  const onSubitHandler = async(e) =>{

    try {
      e.preventDefault();
      const otpArray= inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const {data} =await axios.post(backendurl+'/api/auth/verify-account',{otp});
      console.log(data);
      if (data.success){
        toast.success(data.message)
         await getUserData();
          navigate('/');
      }else{
      console.log(data.message);
       toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message)
    }
  }

useEffect(() => {
 isLoggedin && user && user.isAccountVerified && navigate('/');
},[isLoggedin,user]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img  
      onClick={()=>navigate('/')}
      src={assets.logo} 
      alt="" 
      className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
   <form onSubmit={onSubitHandler}
   className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
    <h1 className='text-white text-2xl font-semibold text-center mb-4'>
      Email Verify Otp
    </h1>
     <p className='text-indigo-300 text-center mb-6'>
      Enter the 6 digit code sent to your email id.
      </p>
     <div className='flex justify-between mb-8' onPaste={handlePaste}>
       { Array(6).fill().map((_, index) => (
         <input
           key={index}
           id={`otp-${index}`}
           name={`otp-${index}`}
           autoComplete="one-time-code" 
           type="text"
           maxLength="1"
           required
           className='w-12 h-12 text-center text-xl text-white bg-[#333A5C] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
           ref = {e => inputRefs.current[index] = e}
           onInput={(e) => handleInput(e, index)}
           onKeyDown={(e) => handleKeyDown(e, index)}
         />
       ))}
     </div>
     <button className='w-full py-2 mt-4 text-white bg-gradient-to-r from-indigo-500 to-purple-500  rounded-full hover:bg-indigo-600'>
       Verify Email
       </button>
   </form>
    </div>
  )
}

export default EmailVerify
