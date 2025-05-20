import { Trash2 } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import RichtoolEditor from '@/components/RichtoolEditor/RichtoolEditor';
import axios from 'axios';
import { ClassesDropdown, GetDaysByUnitId, GetUnitsByClassId } from '@/Network/Super_Admin/auth';

export const Add_Content = () => {
    const [classes, setClasses] = useState([]);
    const [units, setUnits] = useState([]);
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(false);

    const [interactiveActivities, setInteractiveActivities] = useState([
        { title: '', link: '', poster: null }
    ]);

    const [objectives, setObjectives] = useState([
        { objectiveTitle: '', objectiveValue: '' }
    ]);

    const [formData, setFormData] = useState({
        ClassId: '',
        UnitId: '',
        dayId: '',
        lessonAvatar: null,
        title: '',
        duration: 30,
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

    const handleObjectiveChange = useCallback((index, field, value) => {
        setObjectives(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    }, []);

    const handleAddObjective = () => {
        setObjectives(prev => [...prev, { objectiveTitle: '', objectiveValue: '' }]);
    };

    const handleRemoveObjective = (index) => {
        if (objectives.length > 1) {
            setObjectives(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleActivityChange = (index, field, value) => {
        setInteractiveActivities(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleActivityFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInteractiveActivities(prev => {
                    const updated = [...prev];
                    updated[index].poster = reader.result;
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const addActivity = () => {
        setInteractiveActivities(prev => [...prev, { title: '', link: '', poster: null }]);
    };

    const removeActivity = (index) => {
        if (interactiveActivities.length > 1) {
            setInteractiveActivities(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    lessonAvatar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.lessonAvatar) {
                alert('Please upload a lesson avatar image');
                setLoading(false);
                return;
            }

            const invalidObjectives = objectives.some(
                obj => !obj.objectiveTitle.trim() || !obj.objectiveValue.trim()
            );

            if (invalidObjectives) {
                alert('Please fill in all objective titles and contents');
                setLoading(false);
                return;
            }

            const objectivesArray = [];
            objectives.forEach(obj => {
                objectivesArray.push(obj.objectiveTitle);
                objectivesArray.push(obj.objectiveValue);
            });

            const processedActivities = interactiveActivities.map(activity => ({
                title: activity.title,
                link: activity.link,
                poster: activity.poster
            }));

            const requestData = {
                ...formData,
                objectives: objectivesArray,
                interactiveActivity: processedActivities
            };

            console.log('Submitting data:', requestData);

            const response = await axios.post('http://localhost:4000/api/Lesson/createLesson', requestData);

            if (response.data.success) {
                alert('Lesson created successfully!');
                // Reset form
                setFormData({
                    ClassId: '',
                    UnitId: '',
                    dayId: '',
                    lessonAvatar: null,
                    title: '',
                    duration: 30,
                });
                setObjectives([{ objectiveTitle: '', objectiveValue: '' }]);
                setInteractiveActivities([{ title: '', link: '', poster: null }]);
            }
        } catch (error) {
            console.error('Failed to create lesson:', error);
            alert('Failed to create lesson: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add New Lesson</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Class, Unit, Day Selection */}
                <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
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

                {/* Basic Lesson Info */}
                <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                    <div>
                        <label className="block font-medium">Lesson Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Lesson Title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Duration (minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* Lesson Avatar Upload */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block font-medium mb-2">Lesson Avatar/Image <span className="text-red-500">*</span></label>
                    <input
                        type="file"
                        onChange={handleAvatarChange}
                        className="w-full border p-2 rounded"
                        accept="image/*"
                        required={!formData.lessonAvatar}
                    />
                    {formData.lessonAvatar && (
                        <div className="mt-2">
                            <img
                                src={formData.lessonAvatar}
                                alt="Lesson Avatar Preview"
                                className="h-24 object-cover rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Objectives */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block font-medium mb-4">Objectives</label>
                    {objectives.map((obj, index) => (
                        <div key={index} className="space-y-4 mb-8 p-4 bg-white rounded-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Objective {index + 1}</h3>
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveObjective(index)}
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
                                    onChange={(e) => handleObjectiveChange(index, 'objectiveTitle', e.target.value)}
                                    className="w-full border p-2 rounded"
                                    placeholder="Enter objective title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Objective Content</label>
                                <RichtoolEditor
                                    key={`objective-editor-${index}`}
                                    editorValue={obj.objectiveValue}
                                    onEditorChange={(newContent) => handleObjectiveChange(index, 'objectiveValue', newContent)}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddObjective}
                        className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                    >
                        Add Objective
                    </button>
                </div>

                {/* Interactive Activities */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block font-medium mb-4">Interactive Activities</label>
                    {interactiveActivities.map((activity, index) => (
                        <div key={index} className="grid grid-cols-1 gap-4 mb-6 p-4 bg-white rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">Activity {index + 1}</h3>
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeActivity(index)}
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
                                    onChange={(e) => handleActivityChange(index, 'title', e.target.value)}
                                    placeholder="Activity Title"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Activity URL</label>
                                <input
                                    type="text"
                                    value={activity.link}
                                    onChange={(e) => handleActivityChange(index, 'link', e.target.value)}
                                    placeholder="URL"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Activity Poster</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleActivityFileChange(index, e)}
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
                        onClick={addActivity}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Add Activity
                    </button>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-8 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Create Lesson'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Add_Content;