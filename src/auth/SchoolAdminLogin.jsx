import React, { useState } from 'react';
import backgroundImage from '../assets/Images/back.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  SchoolAdminLoginByEmail,
  SchoolAdminLoginByPhone,
  SchoolAdminVerifyOTP,
} from '@/Network/schooladminauth';
import { useNavigate } from 'react-router-dom';

export const SchoolAdminLogin = () => {
  const [showForm, setShowForm] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const toggleFormType = () => {
    setShowForm(!showForm);
  };

  const handleLoginByEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await SchoolAdminLoginByEmail({
        email,
        password,
      });
      if (!response || response.message) {
        toast.error(response?.message || 'Login failed');
      } else {
        toast.success('Login successfully!', {
          autoClose: 3000,
          onClose: () => navigate('/eduworm-school'),
        });
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLoginByPhone = async (e) => {
    e.preventDefault();
    try {
      const response = await SchoolAdminLoginByPhone({
        phoneNumber: phone,
      });

      console.log('Phone login response:', response);

      if (response) {
        toast.success('OTP sent successfully!');
        setShowOtp(true);
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    try {
      const response = await SchoolAdminVerifyOTP({
        phoneNumber: phone,
        staticOtp: enteredOtp,
      });

      if (response.message === 'OTP verified successfully') {
        toast.success('OTP Verified!', {
          autoClose: 3000,
          onClose: () => navigate('/eduworm-school'),
        });
      } else {
        toast.error(response?.message || 'OTP verification failed');        
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong during OTP verification');
    }
  };

  const cancelOtpModal = () => {
    setShowOtp(false);
    setOtp(Array(6).fill(''));
  };

  return (
    <>
      <ToastContainer />
      <div className='flex h-screen w-full'>
        {/* Left Side */}
        <div className='w-1/2 flex justify-center items-center bg-sky-50'>
          <img src='/images/eduworm.png' alt='Eduworm Logo' className='h-20 mb-4' />
        </div>


        {/* Right Side */}
        <div
          className='w-1/2 flex justify-center items-center'
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='w-full max-w-sm p-6 bg-white bg-opacity-90 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold text-center mb-4'>School Admin Login</h2>

            {!showForm ? (
              <form onSubmit={handleLoginByEmail}>
                <div className='mb-4'>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                    Password <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                    required
                  />
                </div>
                <button
                  type='submit'
                  className='w-full mt-5 cursor-pointer bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'
                >
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginByPhone}>
                <div className='mb-6 mt-10'>
                  <label htmlFor='phone' className='block text-md  my-3 font-medium text-gray-700'>
                    Registered Phone Number <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                    required
                  />
                </div>
                <button
                  type='submit'
                  className='w-full cursor-pointer bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'
                >
                  Login
                </button>
              </form>
            )}

            <div className='mt-4 text-center'>
              <p className='text-lg underline cursor-pointer text-sky-600  font-bold' onClick={toggleFormType}>
                {showForm ? 'Login Via Email' : 'Login Via Mobile Number'}
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* OTP Modal */}
      {showOtp && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4'>
            <form onSubmit={handleVerifyOTP}>
              <h2 className='text-2xl font-bold mb-4 text-center text-gray-700'>Verify OTP</h2>
              <p className='text-center text-gray-500 mb-4'>OTP sent to your phone</p>
              <div className='flex justify-between mb-4'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type='text'
                    maxLength='1'
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className='w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='-'
                  />
                ))}
              </div>
              <button
                type='submit'
                className='bg-blue-600 text-white py-2 w-full rounded-lg shadow hover:bg-blue-500 transition-all'
              >
                Verify OTP
              </button>
              <button
                type='button'
                onClick={cancelOtpModal}
                className='mt-4 text-sm text-gray-500 hover:text-gray-700 text-center w-full'
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
