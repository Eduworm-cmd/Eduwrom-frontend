import React from 'react'
import "./DaysView.css"
import intoGirl from "../../../assets/Images/Day-view-girl.png";
import { ArrowRight } from 'lucide-react'
import { Pen, Headphones, Volume2, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DaysView = () => {
    const navigate = useNavigate();

    const handleViewMore = ()  =>{
        navigate("/view")
    }
    return (
        <div>
            <div className="intora-day relative bg-slate-500 p-6 rounded-xl shadow-md text-white w-full max-w-2xl mx-auto flex items-center mt-5 mb-3">
                <div className="absolute -top-7 left-4 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                    <img
                        src={intoGirl}
                        alt="Beronica Peterson"
                        className="w-full h-full"
                    />
                </div>
                <div className="ml-auto pl-0 md:pl-32 lg:pl-60 w-full">
                    <h3 className="text-xl md:text-2xl font-semibold">Beronica Peterson</h3>
                    <p className="text-sm md:text-base text-blue-200">English Teacher</p>
                    <div className="mt-4 flex items-center space-x-4">
                        <p className="text-white flex items-center space-x-2">
                            Moral <ArrowRight className="w-4 h-4 ml-2" />
                        </p>
                        <button className="px-4 py-2 bg-white text-slate-700 rounded-full font-medium">
                        Social-Emotional
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-1 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">English Homework</h2>
                    <div className="bg-white p-4 rounded-xl shadow-md mt-2">
                        <div className="p-4 rounded-xl shadow-md bg-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="text-white bg-opacity-20 p-3 rounded-full bg-gray-100">
                                    <Pen className="text-slate-700 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Basic English Writing</h3>
                                    <p className="text-xs text-blue-500">CHAPTER-12</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                It is recommended that you complete this assign to improve your writing skills for beginner English.
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <button 
                                 onClick={handleViewMore}
                                className="px-4 py-2 cursor-pointer bg-slate-500 text-white rounded-lg font-medium flex items-center space-x-2">
                                    View →
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">German Homework</h2>
                    <div className="bg-slate-500 p-4 rounded-xl shadow-md mt-2">
                        <div className="p-4 rounded-xl shadow-md bg-transparent">
                            <div className="flex items-center space-x-4">
                                <div className="text-white bg-opacity-20 p-3 rounded-full bg-gray-100">
                                    <Headphones className="text-slate-700 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Basic German Listening</h3>
                                    <p className="text-xs text-blue-300">CHAPTER-9</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">
                                It is recommended that you complete this assign to improve your listening skills for beginner German.
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <button className="px-4 py-2 cursor-pointer bg-white text-slate-500 rounded-lg font-medium flex items-center space-x-2">
                                    View →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Spanish Homework</h2>
                    <div className="bg-white p-4 rounded-xl shadow-md mt-2">
                        <div className="p-4 rounded-xl shadow-md bg-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="text-white bg-opacity-20 p-3 rounded-full bg-gray-100">
                                    <Volume2 className="text-slate-700 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Basic English Speaking</h3>
                                    <p className="text-xs text-blue-500">CHAPTER-12</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                It is recommended that you complete this assign to improve your speaking skills for beginner English.
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <button className="px-4 py-2 cursor-pointer bg-slate-500 text-white rounded-lg font-medium flex items-center space-x-2">
                                    View →
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-1 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">English Homework</h2>
                    <div className="bg-white p-4 rounded-xl shadow-md mt-2">
                        <div className="p-4 rounded-xl shadow-md bg-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="text-white bg-opacity-20 p-3 rounded-full bg-gray-100">
                                    <Pen className="text-slate-700 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Basic English Writing</h3>
                                    <p className="text-xs text-blue-500">CHAPTER-12</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                It is recommended that you complete this assign to improve your writing skills for beginner English.
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <button className="px-4 py-2 cursor-pointer bg-slate-500 text-white rounded-lg font-medium flex items-center space-x-2">
                                    View →
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">German Homework</h2>
                    <div className="bg-slate-500 p-4 rounded-xl shadow-md mt-2">
                        <div className="p-4 rounded-xl shadow-md bg-transparent">
                            <div className="flex items-center space-x-4">
                                <div className="text-white bg-opacity-20 p-3 rounded-full bg-gray-100">
                                    <Headphones className="text-slate-700 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Basic German Listening</h3>
                                    <p className="text-xs text-blue-300">CHAPTER-9</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">
                                It is recommended that you complete this assign to improve your listening skills for beginner German.
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <button className="px-4 py-2 cursor-pointer bg-white text-slate-500 rounded-lg font-medium flex items-center space-x-2">
                                    View →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Spanish Homework</h2>
                    <div className="bg-white p-4 rounded-xl shadow-md mt-2">
                        <div className="p-4 rounded-xl shadow-md bg-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="text-white bg-opacity-20 p-3 rounded-full bg-gray-100">
                                    <Volume2 className="text-slate-700 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Basic English Speaking</h3>
                                    <p className="text-xs text-blue-500">CHAPTER-12</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                It is recommended that you complete this assign to improve your speaking skills for beginner English.
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <button className="px-4 py-2 cursor-pointer bg-slate-500 text-white rounded-lg font-medium flex items-center space-x-2">
                                    View →
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default DaysView
