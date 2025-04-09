import { LockKeyholeOpen, User } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login_SignUp = () => {
  const [showSignup, setShowSignup] = useState(false)

  const handleShowform = () =>{
      setShowSignup(!showSignup)
  }

  return (
    <div>
      <div className="bg-sky-100 flex min-h-screen transition-all duration-700 ease-in-out relative">
        {/* Overlay panel */}
        <div
          className={`
            absolute top-0 left-0 w-1/2 h-full bg-blue-600 text-white z-20
            flex flex-col justify-center items-center p-10 transition-all duration-700 ease-in-out
            ${showSignup ? 'translate-x-full rounded-l-[10%]' : 'rounded-r-[10%]'}
          `}
        >
          <h2 className="text-4xl font-bold mb-4">Hello, Welcome</h2>
          <p className="mb-6 text-lg">{showSignup ? 'Already have an account?' : "Don't have an account?"}</p>
          <button
            onClick={handleShowform}
            className="bg-white text-blue-600 px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
          >
            {showSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
        
        {/* Register Form */}
        <form action="" className='w-1/2 flex flex-col justify-center items-center bg-white-200'>
          <div className="flex flex-row gap-2">
            <div className='flex items-center bg-gray-100 rounded-lg p-3 w-40 mb-4'>
              <input type="text" name='' placeholder='FirstName' className="bg-transparent flex-1 outline-none text-gray-700" />
              <User className='text-sky-600' />
            </div>
            <div className='flex items-center bg-gray-100 rounded-lg p-3 w-40 mb-4'>
              <input type="text" name='' placeholder='Lastname' className="bg-transparent flex-1 outline-none text-gray-700" />
              <User className='text-sky-600' />
            </div>
          </div>
          <div className='flex items-center bg-gray-100 rounded-lg p-3 w-80 mb-4'>
            <input type="email" name='' placeholder='Email' className="bg-transparent flex-1 outline-none text-gray-700" />
            <User className='text-sky-600' />
          </div>

          <div className='flex items-center bg-gray-100 rounded-lg p-3 w-80 mb-4'>
            <input type="password" name='' placeholder='Password' className="bg-transparent flex-1 outline-none text-gray-700" />
            <LockKeyholeOpen className='text-sky-600' />
          </div>
          <button className="bg-blue-600 cursor-pointer text-white font-semibold py-3 w-80 rounded-lg shadow-md hover:bg-blue-400 transition-all mb-4">Register</button>
        </form>

        {/* Right Section Login Form */}
        <form className='w-1/2 flex flex-col justify-center items-center bg-white-200'>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Login</h2>
          <div className='flex items-center bg-gray-100 rounded-lg p-3 w-80 mb-4'>
            <input type="text" name='' placeholder='Username' className="bg-transparent flex-1 outline-none text-gray-700" />
            <User className='text-sky-600' />
          </div>
          <div className='flex items-center bg-gray-100 rounded-lg p-3 w-80 mb-4'>
            <input type="password" name='' placeholder='Password' className="bg-transparent flex-1 outline-none text-gray-700" />
            <LockKeyholeOpen className="text-sky-600 transform scale-x-[-1]" />
          </div>
          <div className='w-80 text-right text-sm text-gray-600 mb-4'>
            <Link className='hover:underline'>
              Forgot Password?
            </Link>
          </div>
          <button className="bg-blue-600 cursor-pointer text-white font-semibold py-3 w-80 rounded-lg shadow-md hover:bg-blue-400 transition-all mb-4">Login</button>
          
        </form>


      </div>

    </div>
  )
}

export default Login_SignUp
