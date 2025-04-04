import { ArrowRight, ChevronDown, ChevronRight, Flower, NotebookPen, PackageOpen, PanelsRightBottom, Target } from 'lucide-react';
import React, { useState } from 'react';
import intoGirl from "../../assets/Images/Day-view-girl.png";

export const CourseView = () => {
    const [activeTaskIndex, setActiveTaskIndex] = useState(0);

    const handleActiveToggle = (index) => {
        setActiveTaskIndex(activeTaskIndex === index ? null : index);
    };

    const courseData = [
        {
            icon: <Target />,
            heading: "Objective",
            subheading: "Understanding the interplay of climate and biodiversity",
            description: "Gather the learners in a circle on the floor mats...",
            lessons: [
                {
                    title: "Exploring ecosystems",
                    subtitle: "Understanding the interplay of climate and biodiversity",
                    description: "An exciting introduction to ecosystems and their delicate balance.",
                    instructions: [
                        "Play fun music and ask the learners to sway and move to the music.",
                        "Let them switch their roles and have fun.",
                        "Ensure they enjoy and have fun and all participate actively."
                    ]
                }
            ]
        },
        {
            icon: <PackageOpen />,
            heading: "Materials Needed",
            lessons: [
                {
                    title: "Exploring ecosystems",
                    subtitle: "Understanding the interplay of climate and biodiversity",
                    description: "An exciting introduction to ecosystems and their delicate balance.",
                    instructions: [
                        "Introduce learners to climate change concepts.",
                        "Divide students into small discussion groups.",
                        "Summarize with a group presentation."
                    ]
                },
                {
                    date: "26 Apr",
                    title: "Plate tectonics",
                    subtitle: "Exploring Earth’s dynamic surface",
                    description: "Explore the shifting continents and the dynamic forces that shape our planet’s surface.",
                    instructions: [
                        "Demonstrate tectonic movement with clay models.",
                        "Show real earthquake/volcano footage.",
                        "Conduct a quiz on tectonic plates."
                    ]
                }
            ]
        },
        {
            icon: <PanelsRightBottom />,
            heading: "Tuning In",
            lessons: [
                {
                    title: "Rain Cycle Basics",
                    subtitle: "Water vapor and clouds",
                    description: "Fun intro to the water cycle using visuals.",
                    instructions: [
                        "Draw the rain cycle on a board.",
                        "Use spray bottle to simulate rain.",
                        "Assign group chart activity."
                    ]
                }
            ]
        },
        {
            icon: <NotebookPen />,
            heading: "Main Activity",
            lessons: [
                {
                    date: "26 Apr",
                    title: "Soil layers",
                    subtitle: "Understand composition of soil",
                    description: "Students will identify soil layers using actual samples.",
                    instructions: [
                        "Provide different soil samples.",
                        "Let students label the parts.",
                        "Have them journal their findings."
                    ]
                }
            ]
        },
        {
            icon: <Flower />,
            heading: "Closure",
            lessons: [
                {
                    date: "28 Apr",
                    title: "Nature observation",
                    subtitle: "Mindful learning outdoors",
                    description: "Students will go outside and journal their observations.",
                    instructions: [
                        "Distribute blank journals and colored pencils.",
                        "Encourage silent observation.",
                        "Group sharing and discussion after journaling."
                    ]
                }
            ]
        }
    ];

    return (
        <div>
            <div className="intora-day relative bg-slate-500 p-6 rounded-xl shadow-md text-white w-full max-w-2xl mx-auto flex items-center mt-5">
                <div className="absolute -top-7 left-4 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                    <img src={intoGirl} alt="Beronica Peterson" className="w-full h-full" />
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

            <div className="p-2 bg-gray-100 min-h-screen">
                <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Current grades</h3>
                        {/* <button className="text-gray-500 flex items-center">
                            Month <ChevronDown className="w-4 h-4" />
                        </button> */}
                    </div>

                    <div className="mt-3 space-y-2">
                        {courseData.map((task, index) => (
                            <div key={index}>
                                <div
                                    className="flex items-center p-4 bg-gray-100 rounded-lg cursor-pointer"
                                    onClick={() => handleActiveToggle(index)}
                                >
                                    <div className={`w-8 h-8 ${activeTaskIndex === index ? 'bg-slate-500' : 'bg-slate-300'} text-white flex items-center justify-center rounded-full font-semibold`}>
                                        {task.icon}
                                    </div>
                                    <p className="ml-3 text-gray-700 font-semibold">{task.heading}</p>
                                </div>

                                {activeTaskIndex === index && task.lessons.length > 0 && (
                                    <div className="bg-white p-4 rounded-xl shadow-md mb-10">
                                        <h3 className="text-lg font-semibold">Lesson topics</h3>
                                        <div className="mt-3 space-y-3">
                                            {task.lessons.map((lesson, lessonIndex) => (
                                                <div key={lessonIndex}>
                                                    <p className="font-semibold">{lesson.title}</p>
                                                    <p className="text-gray-500 text-sm">{lesson.subtitle}</p>
                                                    <p>{lesson.description}</p>

                                                    {lesson.instructions && lesson.instructions.length > 0 && (
                                                        <ul className="mt-2">
                                                            {lesson.instructions.map((item, i) => (
                                                                <li key={i} className='flex my-1'>
                                                                    <ChevronRight className='text-slate-500 mr-1' /> {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
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
