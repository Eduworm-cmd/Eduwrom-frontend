import { ChevronDown, ChevronRight, PackageOpen, Target } from 'lucide-react';
import React, { useState } from 'react';

export const CourseView = () => {
    const [activeTaskIndex, setActiveTaskIndex] = useState(0);

    const handleActiveToggle = (index) => {
        setActiveTaskIndex(activeTaskIndex === index ? null : index);
    };

    const courseData = [
        {
            icon: <Target />,
            heading: "Exploring ecosystems",
            subheading: "Understanding the interplay of climate and biodiversity",
            description:
                "Gather the learners in a circle on the floor mats and introduce yourself by stating your name and that you are excited to be in the class with everyone. Now invite each learner to say their name. Once everyone has shared their name, start by clapping your hands in some rhythm and encourage the learners to follow the rhythm and clap. Tell them they will all have fun singing a few rhymes. You could also ask if any of them would be interested in singing their favourite rhyme.",
            lessons: [
                {
                    date: "23 Apr",
                    title: "Exploring ecosystems",
                    subtitle: "Understanding the interplay of climate and biodiversity",
                    description:
                        "An exciting introduction to ecosystems and their delicate balance, where climate and biodiversity play crucial roles."
                },
            
            ]
        },
        {
            icon: <PackageOpen />,
            heading: "Task: Population Density Mapping",
            lessons: [
                {
                    date: "23 Apr",
                    title: "Exploring ecosystems",
                    subtitle: "Understanding the interplay of climate and biodiversity",
                    description:
                        "An exciting introduction to ecosystems and their delicate balance, where climate and biodiversity play crucial roles."
                },
                {
                    date: "26 Apr",
                    title: "Plate tectonics",
                    subtitle: "Exploring Earth’s dynamic surface",
                    description:
                        "Explore the shifting continents and the dynamic forces that shape our planet’s surface."
                }
            ]
        }
    ];

    return (
        <div>
            <div className="p-4 bg-gray-100 min-h-screen">
                {/* Current Grades Section */}
                <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Current grades</h3>
                        <button className="text-gray-500 flex items-center">
                            Month <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-3 space-y-2">
                        {courseData.map((task, index) => (
                            <div key={index}>
                                <div
                                    className="flex items-center p-2 bg-gray-100 rounded-lg cursor-pointer"
                                    onClick={() => handleActiveToggle(index)}
                                >
                                    <div className={`w-8 h-8 ${activeTaskIndex === index ? 'bg-purple-500' : 'bg-purple-300'} text-white flex items-center justify-center rounded-full font-semibold`}>
                                        {task.icon}
                                    </div>
                                    <p className="ml-3 text-gray-700">{task.heading}</p>
                                </div>
                                {activeTaskIndex === index && task.lessons.length > 0 && (
                                    <div className="bg-white p-4 rounded-xl shadow-md mb-10">
                                        <h3 className="text-lg font-semibold">Lesson topics</h3>
                                        <div className="mt-3 space-y-3">
                                            {task.lessons.map((lesson, lessonIndex) => (
                                                <div key={lessonIndex}>
                                                    <p className="text-purple-500 font-semibold">{lesson.date}</p>
                                                    <p className="font-semibold">{lesson.title}</p>
                                                    <p className="text-gray-500 text-sm">{lesson.subtitle}</p>
                                                    <p>{lesson.description}</p>
                                                    <ul>
                                                        <li className='flex my-1'><ChevronRight className='text-purple-500'/>Play fun music and ask the learners to sway and move to the music.
                                                        </li>
                                                        <li className='flex my-1'><ChevronRight className='text-purple-500'/>Play fun music and ask the learners to sway and move to the music.
                                                        </li>
                                                        <li className='flex my-1'><ChevronRight className='text-purple-500'/>Play fun music and ask the learners to sway and move to the music.
                                                        </li>
                                                        <li className='flex my-1'><ChevronRight className='text-purple-500'/>Play fun music and ask the learners to sway and move to the music.
                                                        </li>
                                                        <li className='flex my-1'><ChevronRight className='text-purple-500'/>Let them switch their roles and have fun.
                                                        </li>
                                                        <li className='flex my-1'><ChevronRight className='text-purple-500'/>Ensure they enjoy and have fun and all participate actively.
                                                        </li>
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
