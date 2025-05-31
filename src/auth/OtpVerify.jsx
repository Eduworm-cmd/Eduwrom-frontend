import React, { useState } from 'react';

export const OtpVerify = ({ onCancel, handleOtpSubmit }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));

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
    if (e.key === 'Backspace' && otp[index] === '') {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOtpSubmit(otp);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-700">Verify OTP</h2>
          <p className="text-center text-gray-500 mb-4 text-sm sm:text-base">OTP sent to your phone</p>
          <div className="flex justify-between gap-2 sm:gap-1 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="-"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 w-full rounded-lg shadow hover:bg-blue-500 transition-all text-sm sm:text-base"
          >
            Verify OTP
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="mt-4 text-xs sm:text-sm text-gray-500 hover:text-gray-700 text-center w-full"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};