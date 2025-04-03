import React from 'react'
import intoGirl from "../../assets/Images/Day-view-girl.png"
import { ArrowRight } from 'lucide-react'
import { Pen, Headphones, Volume2, Clock } from "lucide-react";

const DaysView = () => {
    return (
        <div>
            <h1 className="m-auto my-5 text-center mx-0">Days - Overview</h1>
            <div className="bg-slate-500 h-auto sm:h-40 md:h-50 max-w-full sm:max-w-200 m-auto rounded-2xl relative">
                <img
                    src={intoGirl}
                    alt="Intro Girl"
                    className="h-40 sm:h-50 md:h-65 absolute left-0 md:bottom-[-5px] bottom-0"
                />
                <div className="flex justify-end items-center text-white text-sm sm:text-lg md:text-2xl lg:text-3xl md:mx-10 mx-4 h-full">
                    <div className='px-0 py-3'>
                        <h1 className="font-semibold text-sm sm:text-lg md:text-xl">Settling Time - Copy My Movement</h1>
                        <h2 className="text-xs sm:text-sm md:text-lg">UKG</h2>
                        <p className="text-xs sm:text-sm md:text-base">Unit 1, Week 1, Day 1</p>
                        <div className="flex gap-5 my-5">
                            <p className="flex gap-3 items-center text-sm sm:text-base md:text-lg">
                                Moral<ArrowRight />
                            </p>
                            <button className="rounded-4xl bg-white text-slate-500 disabled px-2 py-2 text-xs sm:text-sm md:text-base">
                                Social-Emotional
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">English Homework</h2>
                    <div className="bg-white p-4 rounded-xl shadow-md mt-2">
                        <div className="p-4 rounded-xl shadow-md bg-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="text-white bg-opacity-20 p-3 rounded-full bg-gray-100">
                                    <Pen className="text-blue-500 w-6 h-6" />
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
                                <button className="px-4 py-2 bg-slate-500 text-white rounded-lg font-medium flex items-center space-x-2">
                                    Submit →
                                </button>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Clock className="mr-1 w-4 h-4" /> 40 Min
                                </div>
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
                                    <Headphones className="text-white w-6 h-6" />
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
                                <button className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium flex items-center space-x-2">
                                    Submit →
                                </button>
                                <div className="flex items-center text-white text-sm">
                                    <Clock className="mr-1 w-4 h-4" /> 40 Min
                                </div>
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
                                    <Volume2 className="text-blue-500 w-6 h-6" />
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
                                <button className="px-4 py-2 bg-slate-500 text-white rounded-lg font-medium flex items-center space-x-2">
                                    Submit →
                                </button>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Clock className="mr-1 w-4 h-4" /> 40 Min
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default DaysView
