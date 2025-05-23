import {
    ArrowRight,
    ChevronDown,
    ChevronRight,
    Target
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import intoGirl from "../../../assets/Images/Day-view-girl.png";
import { Link, useParams } from 'react-router-dom';
import { GetLessonsByLessonId } from '@/Network/Super_Admin/auth';

export const CourseView = () => {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [lessonData, setLessonData] = useState();
    const [activeTaskIndex, setActiveTaskIndex] = useState([0]);
    const { id } = params;

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await GetLessonsByLessonId(id);
                setLessonData(response.data);
            } catch (error) {
                console.error("Error fetching lesson data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    const handleActiveToggle = (index) => {
        setActiveTaskIndex(activeTaskIndex === index ? null : index);
    };

    if (loading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    return (
        <div>
            {/* Top Section */}
            <div className="intora-day relative bg-slate-500 p-6 rounded-xl shadow-md text-white w-full max-w-2xl mx-auto flex items-center mt-5">
                <div className="absolute -top-7 left-4 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                    <img src={intoGirl} alt="Instructor" className="w-full h-full" />
                </div>
                <div className="ml-auto pl-0 md:pl-32 lg:pl-60 w-full">
                    <h3 className="text-xl md:text-2xl font-semibold">Beronica Peterson</h3>
                    <p className="text-sm md:text-base text-blue-200">English Teacher</p>
                    <div className="mt-4 flex items-center space-x-4">
                        <p className="text-white flex items-center space-x-2">
                            Moral <ArrowRight className="w-4 h-4" />
                        </p>
                        <button className="px-4 py-2 bg-white text-blue-700 rounded-full font-medium">
                            Social-Emotional
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 bg-gray-100 min-h-screen">
                <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Lesson: {lessonData.lessonTitle}</h3>
                    </div>

                    {/* Objectives */}
                    <div className="mt-3 space-y-4">
                        {lessonData?.objectives?.map((item, index) => (
                            <div key={item._id}>
                                <div
                                    className="flex items-center p-4 bg-gray-100 rounded-lg cursor-pointer"
                                    onClick={() => handleActiveToggle(index)}
                                >
                                    <div className={`w-8 h-8 ${activeTaskIndex === index ? 'bg-slate-500' : 'bg-slate-300'} text-white flex items-center justify-center rounded-full font-semibold`}>
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <p className="ml-3 text-gray-700 font-semibold">{item.objectiveTitle}</p>
                                </div>

                                {activeTaskIndex === index && (
                                    <div className="bg-white p-4 rounded-xl shadow-md">
                                        <h3 className="text-lg font-semibold">{item.objectiveTitle}</h3>
                                        <div
                                            className="mt-3 prose max-w-full"
                                            dangerouslySetInnerHTML={{ __html: item.objectiveValue }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>

                    {/* Interactive Activities */}
                    {lessonData?.interactiveActivity?.length > 0 && (
                        <div className="mt-8 bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">Interactive Activity</h3>
                            {lessonData.interactiveActivity.map((activity) => (
                                <div key={activity._id} className="mt-4">
                                    <img
                                        src={activity.poster}
                                        alt="Activity Poster"
                                        className="w-full max-w-md rounded-lg"
                                    />
                                    <p className="mt-2 font-semibold">{activity.title}</p>
                                    <Link
                                        to={activity.link}
                                        target="_blank"
                                        className="text-blue-600 underline"
                                    >
                                        Go to Activity
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
