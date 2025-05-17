import PostApi from '@/Api/PostApi';
import RichtoolEditor from '@/components/RichtoolEditor/RichtoolEditor';
import { ClassesDropdown, CreateLesson, GetDaysByUnitId, GetUnitsByClassId } from '@/Network/Super_Admin/auth';
import { Trash2, Clock, BookOpen } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const Add_Content = () => {
    const [Classes, setClasses] = useState([]);
    const [Days, setDays] = useState([]);
    const [Unit, setUnit] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        ClassId: '',
        UnitId: '',
        dayId: '',
        title: '',
        subjectType: '',
        duration: '',
        objective: '',
        materials: [],
        activity: [],
        closure: '',
        lessonAvatar: '',  // Initialize as empty string, not object
        interactiveActivity: {
            title: '',
            link: '',
            assigned: false
        }
    });

    // Rich editor states
    const [objectiveEditorValue, setObjectiveEditorValue] = useState('');
    const [activityEditorValue, setActivityEditorValue] = useState('');
    const [closureEditorValue, setClosureEditorValue] = useState('');

    // Handle material input
    const [materialInput, setMaterialInput] = useState('');

    const handleAddMaterial = () => {
        if (materialInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                materials: [...prev.materials, materialInput.trim()]
            }));
            setMaterialInput('');
        }
    };

    const handleRemoveMaterial = (index) => {
        const updatedMaterials = formData.materials.filter((_, i) => i !== index);
        setFormData({ ...formData, materials: updatedMaterials });
    };

    const handleClassChange = async (e) => {
        const selectedClassId = e.target.value;
        setFormData((prev) => ({
            ...prev,
            ClassId: selectedClassId,
            UnitId: '',
            dayId: '',
        }));
        setDays([]);

        try {
            const res = await GetUnitsByClassId(selectedClassId);
            setUnit(res.data || []);
        } catch (error) {
            console.error("Failed to fetch units:", error);
            setUnit([]);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "UnitId") {
            try {
                const res = await GetDaysByUnitId(value);
                setDays(res.data || []);
            } catch (error) {
                console.error("Failed to fetch days:", error);
                setDays([]);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Convert file to base64 string
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result;
                setFormData({ ...formData, lessonAvatar: base64String });
                console.log('File converted to base64');
            };
            reader.onerror = error => {
                console.error('Error converting file to base64:', error);
            };
        }
    };

    const handleInteractiveChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            interactiveActivity: {
                ...prev.interactiveActivity,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Process rich editor content into the final payload
            const payload = {
                ...formData,
                objective: objectiveEditorValue, // Use rich editor content
                activity: activityEditorValue, // Store as rich editor content
                closure: closureEditorValue, // Store as rich editor content
                // Set default value for lessonAvatar if it's empty
                lessonAvatar: formData.lessonAvatar || "defaultAvatar"
            };

            console.log('Submitting payload:', payload);

            // Here you would send the payload to your API
            try {
                const response = await CreateLesson(payload);
                if (response.status === 200) {
                    alert('Lesson created successfully!');
                    // Reset form or redirect
                }
            } catch (apiError) {
                console.error('API Error:', apiError);
                if (apiError.response && apiError.response.data) {
                    setError(apiError.response.data.error || 'Failed to create lesson');
                } else {
                    setError('Failed to communicate with server');
                }
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await ClassesDropdown();
                setClasses(res.data);
            } catch (error) {
                console.error("Failed to load classes:", error);
            }
        };
        fetchClasses();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Create New Lesson</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Class, Unit, Day Selection */}
                <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                    {/* Select Class */}
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
                            {Classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.className}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select Unit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Unit</label>
                        <select
                            name="UnitId"
                            value={formData.UnitId}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select Unit</option>
                            {Unit.length > 0 ? (
                                Unit.map((unit) => (
                                    <option key={unit._id} value={unit._id}>
                                        {unit.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No available unit</option>
                            )}
                        </select>
                    </div>

                    {/* Select Day */}
                    <div>
                        <label htmlFor="dayId" className="block text-sm font-medium text-gray-700">Select Day</label>
                        <select
                            id="dayId"
                            name="dayId"
                            value={formData.dayId}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select Day</option>
                            {Days.length > 0 ? (
                                Days.map((day) => (
                                    <option key={day._id} value={day._id}>
                                        Day {day.globalDayNumber}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No available days</option>
                            )}
                        </select>
                    </div>
                </div>

                {/* Basic Lesson Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Lesson Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Lesson Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="Enter lesson title"
                                required
                            />
                        </div>

                        {/* Subject Type */}
                        <div>
                            <label htmlFor="subjectType" className="block text-sm font-medium text-gray-700">Subject Type</label>
                            <input
                                type="text"
                                id="subjectType"
                                name="subjectType"
                                value={formData.subjectType}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="e.g., Math-Emotional"
                                required
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded pl-10"
                                    placeholder="20"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lesson Avatar */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label htmlFor="lessonAvatar" className="block text-sm font-medium text-gray-700 mb-2">Lesson Avatar/Image</label>
                    <input
                        type="file"
                        id="lessonAvatar"
                        name="lessonAvatar"
                        onChange={handleFileChange}
                        className="border p-2 rounded w-full"
                        accept="image/*"
                    />
                </div>

                {/* Objective */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2" />
                            <span>Lesson Objective</span>
                        </div>
                    </label>
                    <RichtoolEditor
                        editorValue={objectiveEditorValue}
                        onEditorChange={setObjectiveEditorValue}
                    />
                </div>

                {/* Materials */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Materials Needed</label>
                    <div className="flex space-x-2 mb-3">
                        <input
                            type="text"
                            value={materialInput}
                            onChange={(e) => setMaterialInput(e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="Add material"
                        />
                        <button
                            type="button"
                            onClick={handleAddMaterial}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Add
                        </button>
                    </div>

                    {/* Display materials */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.materials.map((material, index) => (
                            <div key={index} className="flex items-center bg-white px-3 py-1 rounded-full border">
                                <span>{material}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMaterial(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Activity</label>
                    <RichtoolEditor
                        editorValue={activityEditorValue}
                        onEditorChange={setActivityEditorValue}
                    />
                </div>

                {/* Closure */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closure</label>
                    <RichtoolEditor
                        editorValue={closureEditorValue}
                        onEditorChange={setClosureEditorValue}
                    />
                </div>

                {/* Interactive Activities */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interactive Activity</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="title"
                            value={formData.interactiveActivity.title}
                            onChange={handleInteractiveChange}
                            placeholder="Activity Title"
                            className="border p-2 rounded"
                        />
                        <input
                            type="url"
                            name="link"
                            value={formData.interactiveActivity.link}
                            onChange={handleInteractiveChange}
                            placeholder="Activity URL"
                            className="border p-2 rounded"
                        />
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="assigned"
                                name="assigned"
                                checked={formData.interactiveActivity.assigned}
                                onChange={handleInteractiveChange}
                                className="mr-2 h-4 w-4"
                            />
                            <label htmlFor="assigned" className="text-sm font-medium text-gray-700">Assign to students</label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col items-center">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-lg">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Create Lesson'}
                    </button>
                </div>
            </form>
        </div>
    );
};