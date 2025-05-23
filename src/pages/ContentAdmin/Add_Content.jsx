import { Trash2, Plus } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import RichtoolEditor from '@/components/RichtoolEditor/RichtoolEditor';
import axios from 'axios';
import { ClassesDropdown, GetDaysByUnitId, GetUnitsByClassId } from '@/Network/Super_Admin/auth';

export const Add_Content = () => {
    const [classes, setClasses] = useState([]);
    const [units, setUnits] = useState([]);
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(false);

    // Static subjects list
    const subjects = [
        { id: 'mathematics', name: 'Mathematics' },
        { id: 'english', name: 'English' },
        { id: 'science', name: 'Science' },
        { id: 'social_studies', name: 'Social Studies' },
        { id: 'urdu', name: 'Urdu' },
        { id: 'islamiat', name: 'Islamiat' },
        { id: 'computer_science', name: 'Computer Science' },
        { id: 'physics', name: 'Physics' },
        { id: 'chemistry', name: 'Chemistry' },
        { id: 'biology', name: 'Biology' },
        { id: 'history', name: 'History' },
        { id: 'geography', name: 'Geography' }
    ];

    // Main state structure changed to support multiple lessons
    const [lessons, setLessons] = useState([
        {
            lessonAvatar: null,
            title: '',
            duration: 30,
            objectives: [{ objectiveTitle: '', objectiveValue: '' }],
            interactiveActivities: [{ title: '', link: '', poster: null }]
        }
    ]);

    const [formData, setFormData] = useState({
        ClassId: '',
        UnitId: '',
        dayId: '',
        subjectId: ''
    });

    // Fetch classes on component mount
    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await ClassesDropdown();
            setClasses(response.data || []);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        }
    };

    const fetchUnits = useCallback(async (classId) => {
        try {
            const response = await GetUnitsByClassId(classId);
            setUnits(response.data || []);
        } catch (error) {
            console.error('Failed to fetch units:', error);
        }
    }, []);

    const fetchDays = useCallback(async (unitId) => {
        try {
            const response = await GetDaysByUnitId(unitId);
            setDays(response.data || []);
        } catch (error) {
            console.error('Failed to fetch days:', error);
        }
    }, []);

    useEffect(() => {
        if (formData.UnitId) {
            fetchDays(formData.UnitId);
        } else {
            setDays([]);
        }
    }, [formData.UnitId, fetchDays]);

    const handleClassChange = async (e) => {
        const selectedClassId = e.target.value;
        setFormData(prev => ({
            ...prev,
            ClassId: selectedClassId,
            UnitId: '',
            dayId: ''
        }));

        if (selectedClassId) {
            await fetchUnits(selectedClassId);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Lesson management functions
    const addNewLesson = () => {
        setLessons(prev => [...prev, {
            lessonAvatar: null,
            title: '',
            duration: 30,
            objectives: [{ objectiveTitle: '', objectiveValue: '' }],
            interactiveActivities: [{ title: '', link: '', poster: null }]
        }]);
    };

    const removeLesson = (index) => {
        if (lessons.length > 1) {
            setLessons(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleLessonChange = (lessonIndex, field, value) => {
        setLessons(prev => {
            const updated = [...prev];
            updated[lessonIndex][field] = value;
            return updated;
        });
    };

    // Objective functions per lesson
    const handleObjectiveChange = (lessonIndex, objectiveIndex, field, value) => {
        setLessons(prev => {
            const updated = [...prev];
            updated[lessonIndex].objectives[objectiveIndex][field] = value;
            return updated;
        });
    };

    const handleAddObjective = (lessonIndex) => {
        setLessons(prev => {
            const updated = [...prev];
            updated[lessonIndex].objectives.push({ objectiveTitle: '', objectiveValue: '' });
            return updated;
        });
    };

    const handleRemoveObjective = (lessonIndex, objectiveIndex) => {
        setLessons(prev => {
            const updated = [...prev];
            if (updated[lessonIndex].objectives.length > 1) {
                updated[lessonIndex].objectives.splice(objectiveIndex, 1);
            }
            return updated;
        });
    };

    // Activity functions per lesson
    const handleActivityChange = (lessonIndex, activityIndex, field, value) => {
        setLessons(prev => {
            const updated = [...prev];
            updated[lessonIndex].interactiveActivities[activityIndex][field] = value;
            return updated;
        });
    };

    const handleActivityFileChange = (lessonIndex, activityIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLessons(prev => {
                    const updated = [...prev];
                    updated[lessonIndex].interactiveActivities[activityIndex].poster = reader.result;
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const addActivity = (lessonIndex) => {
        setLessons(prev => {
            const updated = [...prev];
            updated[lessonIndex].interactiveActivities.push({ title: '', link: '', poster: null });
            return updated;
        });
    };

    const removeActivity = (lessonIndex, activityIndex) => {
        setLessons(prev => {
            const updated = [...prev];
            if (updated[lessonIndex].interactiveActivities.length > 1) {
                updated[lessonIndex].interactiveActivities.splice(activityIndex, 1);
            }
            return updated;
        });
    };

    // Avatar upload per lesson
    const handleAvatarChange = (lessonIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLessons(prev => {
                    const updated = [...prev];
                    updated[lessonIndex].lessonAvatar = reader.result;
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate all lessons
            for (const lesson of lessons) {
                if (!lesson.lessonAvatar) {
                    alert('Please upload a lesson avatar image for all lessons');
                    setLoading(false);
                    return;
                }

                const invalidObjectives = lesson.objectives.some(
                    obj => !obj.objectiveTitle.trim() || !obj.objectiveValue.trim()
                );

                if (invalidObjectives) {
                    alert('Please fill in all objective titles and contents for all lessons');
                    setLoading(false);
                    return;
                }
            }

            // Prepare data for all lessons
            const lessonsToSubmit = lessons.map(lesson => ({
                ...formData,
                lessonAvatar: lesson.lessonAvatar,
                title: lesson.title,
                duration: lesson.duration,
                objectives: lesson.objectives.flatMap(obj => [obj.objectiveTitle, obj.objectiveValue]),
                interactiveActivity: lesson.interactiveActivities.map(activity => ({
                    title: activity.title,
                    link: activity.link,
                    poster: activity.poster
                }))
            }));

            // Submit all lessons
            const responses = await Promise.all(
                lessonsToSubmit.map(lesson =>
                    axios.post('http://localhost:4000/api/Lesson/createLesson', lesson)
                )
            );

            if (responses.every(res => res.data.success)) {
                alert('All lessons created successfully!');
                // Reset form
                setFormData({
                    ClassId: '',
                    UnitId: '',
                    dayId: '',
                    subjectId: ''
                });
                setLessons([{
                    lessonAvatar: null,
                    title: '',
                    duration: 30,
                    objectives: [{ objectiveTitle: '', objectiveValue: '' }],
                    interactiveActivities: [{ title: '', link: '', poster: null }]
                }]);
            }
        } catch (error) {
            console.error('Failed to create lessons:', error);
            alert('Failed to create lessons: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add New Lessons</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Class, Unit, Day Selection */}
                <div className="grid grid-cols-3 gap-4  p-4 rounded-lg">
                    <div>
                        <label className="block font-medium">Select Class</label>
                        <select
                            name="ClassId"
                            value={formData.ClassId}
                            onChange={handleClassChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>{cls.className}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">Select Unit</label>
                        <select
                            name="UnitId"
                            value={formData.UnitId}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                            disabled={!formData.ClassId}
                        >
                            <option value="">Select Unit</option>
                            {units.map((unit) => (
                                <option key={unit._id} value={unit._id}>{unit.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">Select Day</label>
                        <select
                            name="dayId"
                            value={formData.dayId}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                            disabled={!formData.UnitId}
                        >
                            <option value="">Select Day</option>
                            {days.map((day) => (
                                <option key={day._id} value={day._id}>{day.globalDayNumber}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Lessons List */}
                {lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Lesson {lessonIndex + 1}</h3>
                            {lessonIndex !== 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeLesson(lessonIndex)}
                                    className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md"
                                >
                                    <Trash2 size={16} className="mr-1" /> Remove Lesson
                                </button>
                            )}
                        </div>

                        {/* Basic Lesson Info */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block font-medium">Lesson Title</label>
                                <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => handleLessonChange(lessonIndex, 'title', e.target.value)}
                                    className="w-full border p-2 rounded"
                                    placeholder="Lesson Title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={lesson.duration}
                                    onChange={(e) => handleLessonChange(lessonIndex, 'duration', e.target.value)}
                                    className="w-full border p-2 rounded"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Select Subject</label>
                                <select
                                    name="subjectId"
                                    value={formData.subjectId}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Lesson Avatar Upload */}
                        <div className="mb-6">
                            <label className="block font-medium mb-2">Lesson Avatar/Image <span className="text-red-500">*</span></label>
                            <input
                                type="file"
                                onChange={(e) => handleAvatarChange(lessonIndex, e)}
                                className="w-full border p-2 rounded"
                                accept="image/*"
                                required={!lesson.lessonAvatar}
                            />
                            {lesson.lessonAvatar && (
                                <div className="mt-2">
                                    <img
                                        src={lesson.lessonAvatar}
                                        alt="Lesson Avatar Preview"
                                        className="h-24 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Objectives */}
                        <div className="mb-6">
                            <label className="block font-medium mb-4">Objectives</label>
                            {lesson.objectives.map((obj, objectiveIndex) => (
                                <div key={objectiveIndex} className="space-y-4 mb-8 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium">Objective {objectiveIndex + 1}</h3>
                                        {objectiveIndex !== 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveObjective(lessonIndex, objectiveIndex)}
                                                className="flex items-center px-2 py-1 bg-red-500 text-white rounded-md"
                                            >
                                                <Trash2 size={16} className="mr-1" /> Remove
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Objective Title</label>
                                        <input
                                            type="text"
                                            value={obj.objectiveTitle}
                                            onChange={(e) => handleObjectiveChange(lessonIndex, objectiveIndex, 'objectiveTitle', e.target.value)}
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter objective title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Objective Content</label>
                                        <RichtoolEditor
                                            key={`objective-editor-${lessonIndex}-${objectiveIndex}`}
                                            editorValue={obj.objectiveValue}
                                            onEditorChange={(newContent) =>
                                                handleObjectiveChange(lessonIndex, objectiveIndex, 'objectiveValue', newContent)
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddObjective(lessonIndex)}
                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                            >
                                Add Objective
                            </button>
                        </div>

                        {/* Interactive Activities */}
                        <div className="mb-6">
                            <label className="block font-medium mb-4">Interactive Activities</label>
                            {lesson.interactiveActivities.map((activity, activityIndex) => (
                                <div key={activityIndex} className="grid grid-cols-1 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium">Activity {activityIndex + 1}</h3>
                                        {activityIndex !== 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeActivity(lessonIndex, activityIndex)}
                                                className="flex items-center px-2 py-1 bg-red-500 text-white rounded-md"
                                            >
                                                <Trash2 size={16} className="mr-1" /> Remove
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Activity Title</label>
                                        <input
                                            type="text"
                                            value={activity.title}
                                            onChange={(e) => handleActivityChange(lessonIndex, activityIndex, 'title', e.target.value)}
                                            placeholder="Activity Title"
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Activity URL</label>
                                        <input
                                            type="text"
                                            value={activity.link}
                                            onChange={(e) => handleActivityChange(lessonIndex, activityIndex, 'link', e.target.value)}
                                            placeholder="URL"
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Activity Poster</label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleActivityFileChange(lessonIndex, activityIndex, e)}
                                            className="w-full border p-2 rounded"
                                            accept="image/*"
                                        />
                                        {activity.poster && (
                                            <img
                                                src={activity.poster}
                                                alt="Activity Poster Preview"
                                                className="h-24 object-cover mt-2 rounded"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addActivity(lessonIndex)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Add Activity
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add Lesson Button */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={addNewLesson}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Another Lesson
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-8 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Create All Lessons'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Add_Content;