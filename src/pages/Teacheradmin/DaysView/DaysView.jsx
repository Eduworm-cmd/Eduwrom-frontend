import {
    ArrowRight,
    Target
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import intoGirl from "../../../assets/Images/Day-view-girl.png";
import { Link, useParams } from 'react-router-dom';
import { GetLessonsByLessonId } from '@/Network/Super_Admin/auth';

export const DaysView = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [lessonData, setLessonData] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0); 

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await GetLessonsByLessonId(id);
                setLessonData(response);
                console.log("Lesson Data:", response.data);
            } catch (error) {
                console.error("Error fetching lesson data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    const parseHtmlContent = (htmlString) => {
        if (!htmlString) return [];
        const listItems = htmlString.match(/<li[^>]*>(.*?)<\/li>/g) || [];
        return listItems.map(item =>
            item.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
        ).filter(item => item.length > 0);
    };

    if (loading) return <div className="text-center p-10 text-lg">Loading lesson...</div>;

    const content = lessonData?.data;

    return (
        <div className="px-2 py-4 bg-gray-100 min-h-screen">
            {/* Instructor Header */}
            <div className="relative bg-gradient-to-r from-sky-500 to-sky-600 rounded-sm shadow-lg text-white p-4 max-w-6xl mx-auto mb-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="absolute -top-7 left-2 w-28 h-28 md:w-36 md:h-36">
                    <img src={intoGirl} alt="Instructor" className="w-full" />
                </div>
                <div className="pl-0 sm:pl-40 w-full">
                    <h3 className="text-2xl font-bold">{content.title}</h3>
                    <p className="text-blue-100 mt-1">English Teacher</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="flex items-center bg-white text-blue-600 font-medium px-3 py-1 rounded-full shadow-sm">
                            <ArrowRight className="w-4 h-4 mr-1" /> Subject
                        </span>
                        <span className="bg-white text-indigo-600 font-medium px-4 py-1 rounded-full shadow-sm">
                            {content.SubjectId.title}
                        </span>
                    </div>
                </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white p-4 rounded-sm shadow max-w-8xl mx-auto space-y-10">
                {/* Objectives */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Learning Objectives</h3>
                    <div className="space-y-4">
                        {content?.objectives?.map((item, index) => {
                            const parsedList = parseHtmlContent(item.objectiveValue);
                            return (
                                <div key={item._id} className="border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setActiveIndex(prevIndex => (prevIndex === index ? null : index))}
                                        className="flex items-center w-full px-3 cursor-pointer py-2 bg-gray-100 hover:bg-gray-300 transition text-left"
                                    >
                                        <div className={`w-8 h-8 ${activeIndex === index ? 'bg-sky-600' : 'bg-gray-300'} text-white flex items-center justify-center rounded-full`}>
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <span className="ml-4 text-gray-800 font-medium">{item.objectiveTitle}</span>
                                    </button>
                                    {activeIndex === index && (
                                        <div className="p-4 bg-white">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                {parsedList.map((point, idx) => (
                                                    <li key={idx}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                </section>

                {/* Activities */}
                {content?.interactiveActivity?.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Interactive Activities</h3>
                        <div className="space-y-6">
                            {content.interactiveActivity.map((activity) => (
                                <div
                                    key={activity._id}
                                    className="flex flex-col sm:flex-row items-start gap-4 p-0 bg-gray-50"
                                >
                                    <img
                                        src={activity.poster}
                                        alt="Activity Poster"
                                        className="w-60 h-25 object-cover rounded-md"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                                        <Link
                                            to={activity.link.startsWith("http") ? activity.link : `https://${activity.link}`}
                                            target="_blank"
                                            className="text-indigo-600 mt-2 inline-block hover:underline"
                                        >
                                            Go to Activity
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
