import { Trash2, Plus, Upload, BookOpen, FileText, Target, Activity } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import RichtoolEditor from '@/components/RichtoolEditor/RichtoolEditor';
import axios from 'axios';
import { ClassesDropdown, GetUnitsDropdownByClassId, GetSubjectsByClassId, GetSubjectsPagesBySubjectId, GetUnitsByClassId, GetDaysByUnitId, CreateLesson } from '@/Network/Super_Admin/auth';
import { toast, ToastContainer } from 'react-toastify';

export const Add_Content = () => {
    const [classes, setClasses] = useState([]);
    const [units, setUnits] = useState([]);
    const [days, setDays] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Main state structure updated to support creation type
    const [lessons, setLessons] = useState([
        {
            creationType: 'manual', // 'manual' or 'book'
            bookPageId: '',
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
        SubjectId: '',
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
            const response = await GetUnitsDropdownByClassId(classId);
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

    const fetchSubjects = useCallback(async (classId) => {
        try {
            const response = await GetSubjectsByClassId(classId);
            setSubjects(response.data || []);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    }, []);

    const fetchPages = useCallback(async (subjectId) => {
        try {
            const response = await GetSubjectsPagesBySubjectId(subjectId);
            setPages(response.data || []);
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        }
    }, []);

    useEffect(() => {
        if (formData.UnitId) {
            fetchDays(formData.UnitId);
        } else {
            setDays([]);
        }
    }, [formData.UnitId, fetchDays]);

    useEffect(() => {
        if (formData.SubjectId) {
            fetchPages(formData.SubjectId);
        } else {
            setPages([]);
        }
    }, [formData.SubjectId, fetchPages]);

    const handleClassChange = async (e) => {
        const selectedClassId = e.target.value;
        setFormData(prev => ({
            ...prev,
            ClassId: selectedClassId,
            UnitId: '',
            dayId: '',
            SubjectId: ''
        }));

        if (selectedClassId) {
            await Promise.all([
                fetchUnits(selectedClassId),
                fetchSubjects(selectedClassId)
            ]);
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
            creationType: 'manual',
            bookPageId: '',
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

            // Reset book-specific fields when switching to manual
            if (field === 'creationType' && value === 'manual') {
                updated[lessonIndex].bookPageId = '';
            }
            // Reset manual-specific fields when switching to book
            if (field === 'creationType' && value === 'book') {
                updated[lessonIndex].lessonAvatar = null;
                updated[lessonIndex].title = '';
                updated[lessonIndex].duration = 30;
                updated[lessonIndex].objectives = [{ objectiveTitle: '', objectiveValue: '' }];
                updated[lessonIndex].interactiveActivities = [{ title: '', link: '', poster: null }];
            }

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
        console.log("Clicked add for lesson", lessonIndex);

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
                if (lesson.creationType === 'manual') {
                    if (!lesson.lessonAvatar) {
                        alert('Please upload a lesson avatar image for all manual lessons');
                        setLoading(false);
                        return;
                    }

                    if (!lesson.title.trim()) {
                        alert('Please provide a title for all manual lessons');
                        setLoading(false);
                        return;
                    }

                    const invalidObjectives = lesson.objectives.some(
                        obj => !obj.objectiveTitle.trim() || !obj.objectiveValue.trim()
                    );

                    if (invalidObjectives) {
                        alert('Please fill in all objective titles and contents for all manual lessons');
                        setLoading(false);
                        return;
                    }
                } else if (lesson.creationType === 'book') {
                    if (!lesson.bookPageId) {
                        alert('Please select a book page for all book-based lessons');
                        setLoading(false);
                        return;
                    }
                }
            }

            // Prepare data for all lessons
            const lessonsToSubmit = lessons.map(lesson => {
                const baseData = {
                    ...formData,
                    creationType: lesson.creationType
                };

                if (lesson.creationType === 'manual') {
                    return {
                        ...baseData,
                        lessonAvatar: lesson.lessonAvatar,
                        title: lesson.title,
                        duration: lesson.duration,
                        objectives: lesson.objectives.flatMap(obj => [obj.objectiveTitle, obj.objectiveValue]),
                        interactiveActivity: lesson.interactiveActivities.map(activity => ({
                            title: activity.title,
                            link: activity.link,
                            poster: activity.poster
                        }))
                    };
                } else {
                    return {
                        ...baseData,
                        bookPageId: lesson.bookPageId
                    };
                }
            });

            // Submit all lessons
            const responses = await Promise.all(
                lessonsToSubmit.map(lesson =>
                   CreateLesson(lesson)
                )
            );

            if (responses.every(res => res.data.success)) {
                toast.success('All lessons created successfully!');
                // Reset form
                setFormData({
                    ClassId: '',
                    UnitId: '',
                    dayId: '',
                    SubjectId: ''
                });
                setLessons([{
                    creationType: 'manual',
                    bookPageId: '',
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4">
            <ToastContainer />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Day Wise Lessons</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Selection Card */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-600 to-indigo-100 px-2 py-2">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <FileText className="mr-2" size={20} />
                                Course Configuration
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Class Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Class <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="ClassId"
                                        value={formData.ClassId}
                                        onChange={handleClassChange}
                                        className="w-full px-4 py-2 border rounded-sm"
                                        required
                                    >
                                        <option value="">Choose a class</option>
                                        {classes.map((cls) => (
                                            <option key={cls._id} value={cls._id}>{cls.className}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Unit Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Unit <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="UnitId"
                                        value={formData.UnitId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-sm"
                                        required
                                        disabled={!formData.ClassId}
                                    >
                                        <option value="">Choose a unit</option>
                                        {units.map((unit) => (
                                            <option key={unit._id} value={unit._id}>{unit.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Day Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Day <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="dayId"
                                        value={formData.dayId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        required
                                        disabled={!formData.UnitId}
                                    >
                                        <option value="">Choose a day</option>
                                        {days.map((day) => (
                                            <option key={day._id} value={day._id}>Day {day.globalDayNumber}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Subject
                                    </label>
                                    <select
                                        name="SubjectId"
                                        value={formData.SubjectId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        disabled={!formData.ClassId}
                                    >
                                        <option value="">Choose a subject</option>
                                        {subjects.map((subject) => (
                                            <option key={subject._id} value={subject._id}>{subject.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-6">
                        {lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Lesson Header */}
                                <div className="bg-gradient-to-r from-sky-600 to-indigo-100 px-2 py-2 flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-white flex items-center">
                                        <BookOpen className="mr-2" size={20} />
                                        Lesson {lessonIndex + 1}
                                    </h3>
                                    {lessonIndex > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeLesson(lessonIndex)}
                                            className="flex items-center cursor-pointer px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-sm transition-colors duration-200"
                                        >
                                            <Trash2 size={16} className="mr-1" />
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Lesson Type Selection */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">Lesson Type</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`creationType-${lessonIndex}`}
                                                    value="manual"
                                                    checked={lesson.creationType === 'manual'}
                                                    onChange={(e) => handleLessonChange(lessonIndex, 'creationType', e.target.value)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700 font-medium flex items-center">
                                                    <FileText size={16} className="mr-1" />
                                                    Manual Lesson
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`creationType-${lessonIndex}`}
                                                    value="book"
                                                    checked={lesson.creationType === 'book'}
                                                    onChange={(e) => handleLessonChange(lessonIndex, 'creationType', e.target.value)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700 font-medium flex items-center">
                                                    <BookOpen size={16} className="mr-1" />
                                                    Book-based Lesson
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Book Page Selection */}
                                    {lesson.creationType === 'book' && (
                                        <div className="bg-blue-50 rounded-sm p-4 space-y-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Select Book Page <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={lesson.bookPageId}
                                                onChange={(e) => handleLessonChange(lessonIndex, 'bookPageId', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                required
                                                disabled={!formData.SubjectId}
                                            >
                                                <option value="">Choose a page</option>
                                                {pages.map((page) => (
                                                    <option key={page._id} value={page._id}>{page.title}</option>
                                                ))}
                                            </select>
                                            {!formData.SubjectId && (
                                                <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                                                    Please select a subject first to see available pages
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Manual Lesson Fields */}
                                    {lesson.creationType === 'manual' && (
                                        <div className="space-y-6">
                                            {/* Basic Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Lesson Title <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={lesson.title}
                                                        onChange={(e) => handleLessonChange(lessonIndex, 'title', e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-sm"
                                                        placeholder="Enter lesson title"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Duration (minutes) <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={lesson.duration}
                                                        onChange={(e) => handleLessonChange(lessonIndex, 'duration', e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-sm"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Avatar Upload */}
                                            <div className="bg-gray-50 rounded-sm p-0 space-y-3">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Lesson Avatar/Image <span className="text-red-500">*</span>
                                                </label>

                                                {!lesson.lessonAvatar ? (
                                                    <div className="flex items-center justify-center w-full">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-sm cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                                <p className="mb-2 text-sm text-gray-500">
                                                                    <span className="font-semibold">Click to upload</span> lesson avatar
                                                                </p>
                                                                <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleAvatarChange(lessonIndex, e)}
                                                                className="hidden"
                                                                accept="image/*"
                                                                required
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative group w-48 h-32">
                                                        <img
                                                            src={lesson.lessonAvatar}
                                                            alt="Lesson Avatar Preview"
                                                            className="w-full h-full object-cover rounded-sm border shadow-sm"
                                                        />
                                                        <label className="absolute inset-0 bg-black bg-opacity-50 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-sm">
                                                            Re-upload
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleAvatarChange(lessonIndex, e)}
                                                                className="hidden"
                                                                accept="image/*"
                                                            />
                                                        </label>
                                                    </div>
                                                )}
                                            </div>


                                            {/* Objectives */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-lg font-medium text-gray-800 flex items-center">
                                                        <Target className="mr-2" size={20} />
                                                        Learning Objectives
                                                    </label>
                                                </div>

                                                {lesson.objectives.map((obj, objectiveIndex) => (
                                                    <div key={objectiveIndex} className="bg-sky-50 rounded-sm p-4 space-y-4 border border-sky-200">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="font-semibold text-sky-800">Objective {objectiveIndex + 1}</h4>
                                                            {objectiveIndex > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveObjective(lessonIndex, objectiveIndex)}
                                                                    className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-sm text-sm transition-colors duration-200"
                                                                >
                                                                    <Trash2 size={14} className="mr-1" />
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Objective Title <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={obj.objectiveTitle}
                                                                    onChange={(e) => handleObjectiveChange(lessonIndex, objectiveIndex, 'objectiveTitle', e.target.value)}
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-sm"
                                                                    placeholder="Enter objective title"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Objective Content <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="border border-gray-300 rounded-sm overflow-hidden bg-white">
                                                                    <RichtoolEditor
                                                                        key={`objective-editor-${lessonIndex}-${objectiveIndex}`}
                                                                        editorValue={obj.objectiveValue}
                                                                        onEditorChange={(newContent) =>
                                                                            handleObjectiveChange(lessonIndex, objectiveIndex, 'objectiveValue', newContent)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="flex items-center justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddObjective(lessonIndex)}
                                                        className="flex items-center px-2 py-1 bg-sky-500 hover:bg-sky-600 cursor-pointer text-white rounded-sm transition-colors duration-200"
                                                    >
                                                        <Plus size={16} className="mr-1" />
                                                        Add Objective
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Interactive Activities */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-lg font-medium text-gray-800 flex items-center">
                                                        <Activity className="mr-2" size={20} />
                                                        Interactive Activities
                                                    </label>
                                                </div>

                                                {lesson.interactiveActivities.map((activity, activityIndex) => (
                                                    <div key={activityIndex} className="bg-sky-50 rounded-sm p-4 space-y-4 border border-sky-200">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="font-semibold text-sky-800">Activity {activityIndex + 1}</h4>
                                                            {activityIndex > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeActivity(lessonIndex, activityIndex)}
                                                                    className="flex items-center px-1 py-1 bg-red-500 hover:bg-red-600 text-white rounded-sm cursor-pointer text-sm transition-colors duration-200"
                                                                >
                                                                    <Trash2 size={14} className="mr-1" />
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Activity Title
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={activity.title}
                                                                    onChange={(e) => handleActivityChange(lessonIndex, activityIndex, 'title', e.target.value)}
                                                                    placeholder="Enter activity title"
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-sm"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Activity URL
                                                                </label>
                                                                <input
                                                                    type="url"
                                                                    value={activity.link}
                                                                    onChange={(e) => handleActivityChange(lessonIndex, activityIndex, 'link', e.target.value)}
                                                                    placeholder="https://example.com"
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Activity Poster
                                                            </label>

                                                            {!activity.poster ? (
                                                                // Initial Upload UI
                                                                <div className="flex items-center justify-center w-full">
                                                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-sm cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200">
                                                                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                                            <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                                                            <p className="text-xs text-gray-500">Click to upload poster</p>
                                                                        </div>
                                                                        <input
                                                                            type="file"
                                                                            onChange={(e) => handleActivityFileChange(lessonIndex, activityIndex, e)}
                                                                            className="hidden"
                                                                            accept="image/*"
                                                                        />
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                // Image Preview + Re-upload on Hover
                                                                <div className="relative group w-32 h-20 mt-3">
                                                                    <img
                                                                        src={activity.poster}
                                                                        alt="Activity Poster Preview"
                                                                        className="w-full h-full object-cover rounded-sm border shadow-sm"
                                                                    />
                                                                    <label className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-sm">
                                                                        Re-upload
                                                                        <input
                                                                            type="file"
                                                                            onChange={(e) => handleActivityFileChange(lessonIndex, activityIndex, e)}
                                                                            className="hidden"
                                                                            accept="image/*"
                                                                        />
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                ))}

                                                <div className="flex items-center justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => addActivity(lessonIndex)}
                                                        className="flex items-center px-2 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-sm transition-colors duration-200"
                                                    >
                                                        <Plus size={16} className="mr-1" />
                                                        Add Activity
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Lesson Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={addNewLesson}
                            className="flex items-center px-2 py-1 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <Plus size={24} className="mr-2" />
                            Add Another Lesson
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-sm hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Creating Lessons...
                                </>
                            ) : (
                                <>
                                    <BookOpen size={20} className="mr-2" />
                                    Create All Lessons
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}