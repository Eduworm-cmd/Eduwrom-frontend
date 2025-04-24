import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
    SchoolAdminLoginByEmail,
    SchoolAdminLoginByPhone,
    SchoolAdminVerifyOTP,
} from "../Network/schooladminauth";
import { SetLocalStorage } from "@/Network/Super_Admin/auth";
import { setUserData } from "./authSlice";
import { useDispatch } from "react-redux";

export const School_Teacher_Login = () => {
    const [role, setRole] = useState("School");
    const [showForm, setShowForm] = useState(false); 
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const navigate = useNavigate();

    const toggleFormType = () => setShowForm((prev) => !prev);

    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "").slice(0, 1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "") {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const cancelOtpModal = () => setShowOtp(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (role === "School") {
            if (showForm) {
                try {
                    const response = await SchoolAdminLoginByEmail({ email, password });
                    console.log(response.status);
                    
                    if (response?.message === "Login successful") {
                        SetLocalStorage("token", response.token);  
                        dispatch(setUserData({
                          user: {
                            id: response?.user?.id,
                            name: response.user?.name,
                            email: response?.user?.email,
                            role: response?.user?.role,
                          },
                          token: response.token,
                        }));
                        toast.success(response?.message || "Login successfully!", {
                            autoClose: 3000,
                            onClose: () => navigate("/eduworm-school"),
                        });
                    }
                    else {
                        toast.error(response?.message || "Login failed");
                    }
                } catch (err) {
                    toast.error(err.message || "Something went wrong");
                }
            } else {
                try {
                    const response = await SchoolAdminLoginByPhone({ phoneNumber: phone });
                    if (response) {
                        toast.success("OTP sent successfully!");
                        setShowOtp(true);
                    } else {
                        toast.error(response?.message || "Failed to send OTP");
                    }
                } catch (err) {
                    toast.error(err.message || "Something went wrong");
                }
            }
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        try {
            const response = await SchoolAdminVerifyOTP({
                phoneNumber: phone,
                staticOtp: enteredOtp,
            });

            if (response.message === "OTP verified successfully") {
                SetLocalStorage("token", response.token);  
                       
                dispatch(setUserData({
                    user: {
                      id: response?.user?.id,
                      firstName: response.user?.firstName,
                      lastName: response.user?.lastName,
                      phoneNumber: response.user?.phoneNumber,
                      role: response?.user?.role,
                    },
                    token: response.token,
                  }));
                  
                toast.success("OTP Verified!", {
                    autoClose: 3000,
                    onClose: () => navigate("/eduworm-school"),
                });
            } else {
                toast.error(response?.message || "OTP verification failed");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong during OTP verification");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            <ToastContainer />
            <div className="bg-white rounded-3xl shadow-lg flex overflow-hidden w-[900px] h-[550px]">
                {/* Left Image Section */}
                <div className="w-1/2 bg-sky-400 p-6 flex flex-col justify-center items-center text-center relative">
                    <h1 className="absolute top-4 left-4 text-2xl font-bold text-blue-900">EduWorm</h1>
                    <img
                        src="https://img.freepik.com/free-photo/young-man-using-laptop-white_23-2148327183.jpg"
                        alt="learning"
                        className="rounded-xl w-44 h-44 object-cover mb-4"
                    />
                </div>

                {/* Right Form Section */}
                <div className="w-1/2 p-8 flex flex-col justify-start">
                    {/* Tabs */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Log in</h2>
                        <div className="bg-blue-100 p-1 rounded-full flex">
                            <button
                                onClick={() => {
                                    setRole("School");
                                    setShowForm(false);
                                }}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${role === "School" ? "bg-blue-900 text-white" : "text-gray-700"
                                    }`}
                            >
                                As School
                            </button>
                            <button
                                onClick={() => setRole("Teacher")}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${role === "Teacher" ? "bg-blue-900 text-white" : "text-gray-700"
                                    }`}
                            >
                                As Teacher
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4 flex flex-col justify-center h-full">
                        {role === "School" ? (
                            showForm ? (
                                <>
                                    <div>
                                        <label htmlFor="school-email" className="block text-md font-medium text-gray-700">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="school-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="school-password" className="block text-md font-medium text-gray-700">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="school-password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label htmlFor="school-phone" className="block text-md font-medium text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="school-phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                </div>
                            )
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="teacher-email" className="block text-md font-medium text-gray-700">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="teacher-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="teacher-password" className="block text-md font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="teacher-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                </div>
                            </>
                        )}

                        {role === "School" && (
                            <div className="mt-4 text-center">
                                <p
                                    className="text-lg underline cursor-pointer text-sky-600 font-bold"
                                    onClick={toggleFormType}
                                >
                                    {showForm ? "Login Via Mobile Number" : "Login Via Email"}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
                            >
                                {role === "School" && !showForm ? "Send OTP" : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
                        <form onSubmit={handleVerifyOTP}>
                            <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Verify OTP</h2>
                            <p className="text-center text-gray-500 mb-4">OTP sent to your phone</p>
                            <div className="flex justify-between mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="-"
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 w-full rounded-lg shadow hover:bg-blue-500 transition-all"
                            >
                                Verify OTP
                            </button>
                            <button
                                type="button"
                                onClick={cancelOtpModal}
                                className="mt-4 text-sm text-gray-500 hover:text-gray-700 text-center w-full"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
