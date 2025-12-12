import React from 'react'
import { Routes,Route } from 'react-router-dom'

import Login from './pages/Login'
import EmailVerify from '../src/pages/EmailVerify';
import ResetPassword from './Pages/ResetPassword'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-passwprd' element={<ResetPassword/>}/>
        
      
      </Routes>
    </div>
  )
}

export default App
// export default function App() {
//   return (
//     <h1 className="text-3xl font-bold underline">
//       Hello world!
//     </h1>
//   )
// }