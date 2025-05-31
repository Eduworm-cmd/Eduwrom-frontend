import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LockKeyholeOpen, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { OtpVerify } from './OtpVerify';
import {SetLocalStorage, SuperAdminLogin, SuperAdminRegister } from '@/Network/Super_Admin/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUserData } from './authSlice';

export const Login_SignUp = () => {
  
  const [showSignup, setShowSignup] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleShowform = () => setShowSignup(!showSignup);
  const handleCancel = () => setShowOtpForm(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await SuperAdminRegister(formData);
  
      if (response.message) {
        toast.error(response.message);
      } else {
        toast.success("Registration successfully!");
        handleShowform();
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
      console.error("Registration error:", error);
    }
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await SuperAdminLogin(loginData);
  
      if (response.message) {
        toast.error(response.message);
      } else {
        SetLocalStorage("token", response.token);  
        dispatch(setUserData({
          user: {
            id: response._id,
            name: response.name,
            email: response.email,
            role: response.role,
          },
          token: response.token,
        }));
  
        toast.success("Login successfully!", {
          onClose: () => navigate("/eduworm-admin/home"),
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  
  return (
    <div className="relative">
      <ToastContainer />
      <div className="bg-sky-100 flex flex-col lg:flex-row min-h-screen transition-all duration-700 ease-in-out relative overflow-hidden">
        {/* Overlay Panel */}
        <div
          className={`absolute top-0 left-0 w-full lg:w-1/2 h-1/2 lg:h-full bg-blue-600 text-white z-20
            flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 transition-all duration-700 ease-in-out
            ${showSignup 
              ? 'lg:translate-x-full lg:rounded-l-[10%] translate-y-full lg:translate-y-0 rounded-t-[10%] lg:rounded-t-none' 
              : 'lg:rounded-r-[10%] rounded-b-[10%] lg:rounded-b-none'}`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-center">Hello, Welcome</h2>
          <p className="mb-6 text-base sm:text-lg text-center">
            {showSignup ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            onClick={handleShowform}
            className="bg-white text-blue-600 px-4 sm:px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition-all text-sm sm:text-base"
          >
            {showSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Signup Form */}
        <form className={`w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-0 py-8 lg:py-0 transition-all duration-700 ease-in-out
          ${showSignup ? 'order-2 lg:order-1' : 'order-1 lg:order-1'}`}>
          <div className="w-full max-w-sm lg:max-w-8xl">
            <div className="flex flex-row gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-3 w-full lg:w-80 mb-4">
                <input
                  onChange={handleChange}
                  name="name"
                  value={formData.name}
                  type="text"
                  placeholder="Name"
                  className="bg-transparent flex-1 outline-none text-gray-700 text-sm sm:text-base"
                />
                <User className="text-sky-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-3 w-full lg:w-80 mb-4">
              <input
                onChange={handleChange}
                name="email"
                value={formData.email}
                type="tel"
                placeholder="Email"
                className="bg-transparent flex-1 outline-none text-gray-700 text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-3 w-full lg:w-80 mb-4">
              <input
                onChange={handleChange}
                name="password"
                value={formData.password}
                type="password"
                placeholder="Password"
                className="bg-transparent flex-1 outline-none text-gray-700 text-sm sm:text-base"
              />
              <LockKeyholeOpen className="text-sky-600 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <button
              onClick={handleRegisterSubmit}
              className="bg-blue-600 cursor-pointer text-white font-semibold py-3 w-full lg:w-80 rounded-lg shadow-md hover:bg-blue-400 transition-all mb-4 text-sm sm:text-base"
            >
              Register
            </button>
          </div>
        </form>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className={`w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-0 py-8 lg:py-0 transition-all duration-700 ease-in-out
          ${showSignup ? 'order-1 lg:order-2' : 'order-2 lg:order-2'}`}>
          <div className="w-full max-w-sm lg:max-w-8xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center">Login</h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-3 w-full lg:w-80 mb-4">
              <input
                onChange={handleLoginChange}
                name="email"
                value={loginData.email}
                type="text"
                placeholder="Email"
                className="bg-transparent flex-1 outline-none text-gray-700 text-sm sm:text-base"
              />
              <User className="text-sky-600 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-3 w-full lg:w-80 mb-4">
              <input
                onChange={handleLoginChange}
                name="password"
                value={loginData.password}
                type="password"
                placeholder="Password"
                className="bg-transparent flex-1 outline-none text-gray-700 text-sm sm:text-base"
              />
              <LockKeyholeOpen className="text-sky-600 transform scale-x-[-1] w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="w-full lg:w-80 text-right text-xs sm:text-sm text-gray-600 mb-4">
              <Link className="hover:underline">Forgot Password?</Link>
            </div>
            <button
              type="submit"
              className="bg-blue-600 cursor-pointer text-white font-semibold py-3 w-full lg:w-80 rounded-lg shadow-md hover:bg-blue-400 transition-all mb-4 text-sm sm:text-base"
            >
              Login
            </button>
          </div>
        </form>
      </div>

      {/* OTP Overlay */}
      {showOtpForm && (
        <OtpVerify
          onCancel={handleCancel}
          handleOtpSubmit={handleOtpSubmit}
        />
      )}
    </div>
  );
};