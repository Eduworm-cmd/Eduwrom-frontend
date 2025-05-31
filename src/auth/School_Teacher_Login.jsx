import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
    SchoolAdminLoginByEmail,
    SchoolAdminLoginByPhone,
    SchoolAdminVerifyOTP,
} from "../Network/schooladminauth";
import { SetLocalStorage, StaffLogin } from "@/Network/Super_Admin/auth";
import { setUserData } from "./authSlice";
import { useDispatch } from "react-redux";

export const School_Teacher_Login = () => {
    const [role, setRole] = useState("School");
    const [showForm, setShowForm] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const dispatch = useDispatch();

    const [staffEmail, setStaffEmail] = useState("");
    const [staffPassword, setStaffPassword] = useState("");

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
                    if (response?.message === "Login successful") {
                        SetLocalStorage("token", response.token);
                        dispatch(setUserData({
                            user: {
                                id: response?.user?.id,
                                firstName: response.user?.firstName,
                                lastName: response.user?.lastName,
                                email: response.user?.email,
                                phoneNumber: response.user?.phoneNumber,
                                schoolId: response.user?.schoolId,
                                schoolName: response.user?.schoolName,
                                role: response?.user?.role,
                            },
                            token: response.token,
                        }));
                        toast.success(response?.message || "Login successfully!", {
                            autoClose: 3000,
                            onClose: () => navigate("/eduworm-school"),
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                try {
                    const response = await SchoolAdminLoginByPhone({ phoneNumber: phone });
                    if (response) {
                        toast.success("OTP sent successfully!");
                        setShowOtp(true);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } else if (role === "Staff") {
            try {
                const response = await StaffLogin({
                    email: staffEmail,
                    password: staffPassword,
                });

                if (response.token) {
                    SetLocalStorage("token", response.token);
                    dispatch(setUserData({
                        user: {
                            id: response?._id,
                            firstName: response.name,
                            lastName: response.lastName,
                            email: response.email,
                            role: response.role,
                        },
                        token: response.token,
                    }));
                    toast.success("Login successfully!", {
                        autoClose: 2000,
                        onClose: () => navigate("/eduworm-school"),
                    });
                }
            } catch (err) {
                console.log(err);
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
                        email: response.user?.email,
                        phoneNumber: response.user?.phoneNumber,
                        schoolId: response.user?.schoolId,
                        schoolName: response.user?.schoolName,
                        role: response?.user?.role,
                    },
                    token: response.token,
                }));

                toast.success("OTP Verified!", {
                    autoClose: 3000,
                    onClose: () => navigate("/eduworm-school"),
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden px-4">
            <ToastContainer />
            <div className="bg-white rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-5xl h-auto md:h-[550px]">
                {/* Left Image Section */}
                <div className="w-full md:w-1/2 bg-sky-400 p-6 flex flex-col justify-center items-center text-center relative">
                    <h1 className="absolute top-4 left-4 text-xl md:text-2xl font-bold text-blue-900">EduWorm</h1>
                    <img
                        src="https://img.freepik.com/free-photo/young-man-using-laptop-white_23-2148327183.jpg"
                        alt="learning"
                        className="rounded-xl w-32 h-32 md:w-44 md:h-44 object-cover mb-4"
                    />
                </div>

                {/* Right Form Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-start">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold">Log in</h2>
                        <div className="bg-blue-100 p-1 rounded-full flex">
                            <button
                                onClick={() => {
                                    setRole("School");
                                    setShowForm(false);
                                }}
                                className={`px-3 md:px-4 py-1.5 rounded-full text-sm font-medium ${role === "School" ? "bg-blue-900 text-white" : "text-gray-700"}`}
                            >
                                As School
                            </button>
                            <button
                                onClick={() => setRole("Staff")}
                                className={`px-3 md:px-4 py-1.5 rounded-full text-sm font-medium ${role === "Staff" ? "bg-blue-900 text-white" : "text-gray-700"}`}
                            >
                                As Staff
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 flex flex-col justify-center h-full">
                        {role === "School" ? (
                            showForm ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-2.5 md:p-3 border border-gray-300 rounded-md focus:outline-none"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-2.5 md:p-3 border border-gray-300 rounded-md focus:outline-none"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-2.5 md:p-3 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            )
                        ) : (
                            <>
                                <input
                                    type="email"
                                    value={staffEmail}
                                    onChange={(e) => setStaffEmail(e.target.value)}
                                    className="w-full p-2.5 md:p-3 border border-gray-300 rounded-md focus:outline-none"
                                    placeholder="Enter your email"
                                />
                                <input
                                    type="password"
                                    value={staffPassword}
                                    onChange={(e) => setStaffPassword(e.target.value)}
                                    className="w-full p-2.5 md:p-3 border border-gray-300 rounded-md focus:outline-none"
                                    placeholder="Enter your password"
                                />
                            </>
                        )}

                        {role === "School" && (
                            <div className="mt-2 text-center">
                                <p
                                    className="text-sm md:text-lg underline cursor-pointer text-sky-600 font-bold"
                                    onClick={toggleFormType}
                                >
                                    {showForm ? "Login Via Mobile Number" : "Login Via Email"}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-md hover:bg-blue-700 transition-all"
                            >
                                {role === "School" && !showForm ? "Send OTP" : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 md:p-6">
                        <form onSubmit={handleVerifyOTP}>
                            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-gray-700">Verify OTP</h2>
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
                                        className="w-10 h-10 md:w-12 md:h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
