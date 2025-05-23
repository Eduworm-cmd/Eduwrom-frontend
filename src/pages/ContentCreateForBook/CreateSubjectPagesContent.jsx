import { Trash2, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import RichtoolEditor from '@/components/RichtoolEditor/RichtoolEditor';
import axios from 'axios';
import { ClassesDropdown, dropdownSubjectPages, getSubjectByClassId, subjectPageContentCreate } from '@/Network/Super_Admin/auth';

export const CreateSubjectPagesContent = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [subjectPages, setSubjectPages] = useState([]);
    const [loading, setLoading] = useState({
        classes: false,
        subjects: false,
        subjectPages: false,
        form: false
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Main form state
    const [formData, setFormData] = useState({
        classId: '',
        SubjectId: '',
        SubjectPageId: '',
        contentAvtar: null,
        title: '',
        duration: '',
        objectives: [
            {
                objectiveTitle: '',
                objectiveValue: ''
            }
        ],
        interactiveActivity: [
            {
                title: '',
                link: '',
                poster: null
            }
        ]
    });

    // Fetch classes on component mount
    const fetchClasses = async () => {
        try {
            setLoading(prev => ({ ...prev, classes: true }));
            const response = await ClassesDropdown();
            setClasses(response.data || []);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
            setError('Failed to fetch classes');
        } finally {
            setLoading(prev => ({ ...prev, classes: false }));
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // Fetch subjects when class is selected
    const fetchSubjects = async (classId) => {
        try {
            setLoading(prev => ({ ...prev, subjects: true }));
            const response = await getSubjectByClassId(classId);
            setSubjects(response.data || []);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
            setError('Failed to fetch subjects');
        } finally {
            setLoading(prev => ({ ...prev, subjects: false }));
        }
    };

    // Fetch subject pages when subject is selected
    const fetchSubjectPages = async (subjectId) => {
        try {
            setLoading(prev => ({ ...prev, subjectPages: true }));

            console.log(subjectId);
            const response = await dropdownSubjectPages(subjectId);
            console.log(subjectId);
            setSubjectPages(response.data || []);
        } catch (error) {
            console.error('Failed to fetch subject pages:', error);
            setError('Failed to fetch subject pages');
        } finally {
            setLoading(prev => ({ ...prev, subjectPages: false }));
        }
    };

    const handleClassChange = async (e) => {
        const classId = e.target.value;
        setFormData(prev => ({
            ...prev,
            classId,
            SubjectId: '',
            SubjectPageId: ''
        }));

        if (classId) {
            await fetchSubjects(classId);
        }
        setSubjectPages([]);
    };

    const handleSubjectChange = async (e) => {
        const SubjectId = e.target.value;
        setFormData(prev => ({
            ...prev,
            SubjectId,
            SubjectPageId: ''
        }));

        if (SubjectId) {
            await fetchSubjectPages(SubjectId);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle content avatar upload
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    contentAvtar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Objective functions
    const handleObjectiveChange = (index, field, value) => {
        setFormData(prev => {
            const updatedObjectives = [...prev.objectives];
            updatedObjectives[index][field] = value;
            return {
                ...prev,
                objectives: updatedObjectives
            };
        });
    };

    const addObjective = () => {
        setFormData(prev => ({
            ...prev,
            objectives: [...prev.objectives, { objectiveTitle: '', objectiveValue: '' }]
        }));
    };

    const removeObjective = (index) => {
        if (formData.objectives.length > 1) {
            setFormData(prev => {
                const updatedObjectives = [...prev.objectives];
                updatedObjectives.splice(index, 1);
                return {
                    ...prev,
                    objectives: updatedObjectives
                };
            });
        }
    };

    // Activity functions
    const handleActivityChange = (index, field, value) => {
        setFormData(prev => {
            const updatedActivities = [...prev.interactiveActivity];
            updatedActivities[index][field] = value;
            return {
                ...prev,
                interactiveActivity: updatedActivities
            };
        });
    };

    const handleActivityPosterChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => {
                    const updatedActivities = [...prev.interactiveActivity];
                    updatedActivities[index].poster = reader.result;
                    return {
                        ...prev,
                        interactiveActivity: updatedActivities
                    };
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const addActivity = () => {
        setFormData(prev => ({
            ...prev,
            interactiveActivity: [...prev.interactiveActivity, { title: '', link: '', poster: null }]
        }));
    };

    const removeActivity = (index) => {
        if (formData.interactiveActivity.length > 1) {
            setFormData(prev => {
                const updatedActivities = [...prev.interactiveActivity];
                updatedActivities.splice(index, 1);
                return {
                    ...prev,
                    interactiveActivity: updatedActivities
                };
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, form: true }));
        setError(null);
        setSuccess(false);

        try {
            // Validate required fields
            if (!formData.classId || !formData.SubjectId || !formData.SubjectPageId ||
                !formData.contentAvtar || !formData.title || !formData.duration) {
                throw new Error('Please fill all required fields');
            }

            // Validate objectives
            const hasEmptyObjectives = formData.objectives.some(
                obj => !obj.objectiveTitle.trim() || !obj.objectiveValue.trim()
            );
            if (hasEmptyObjectives) {
                throw new Error('Please fill all objective fields');
            }

            // Prepare payload (matches your exact structure)
            const payload = {
                classId: formData.classId,
                SubjectId: formData.SubjectId,
                SubjectPageId: formData.SubjectPageId,
                contentAvtar: formData.contentAvtar,
                title: formData.title,
                duration: formData.duration,
                objectives: formData.objectives,
                interactiveActivity: formData.interactiveActivity
            };

            const response = await subjectPageContentCreate(payload);

            if (response.data.success) {
                setSuccess(true);
                // Reset form
                setFormData({
                    classId: '',
                    SubjectId: '',
                    SubjectPageId: '',
                    contentAvtar: null,
                    title: '',
                    duration: '',
                    objectives: [
                        {
                            objectiveTitle: '',
                            objectiveValue: ''
                        }
                    ],
                    interactiveActivity: [
                        {
                            title: '',
                            link: '',
                            poster: null
                        }
                    ]
                });
                setSubjectPages([]);
            }
        } catch (error) {
            console.error('Failed to create content:', error);
            setError(error.response?.data?.message || error.message || 'Failed to create content');
        } finally {
            setLoading(prev => ({ ...prev, form: false }));
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add Subject Page Content</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    Content created successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Class, Subject, SubjectPage Selection */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg">
                    <div>
                        <label className="block font-medium">Class *</label>
                        <select
                            name="classId"
                            value={formData.classId}
                            onChange={handleClassChange}
                            className="w-full border p-2 rounded"
                            required
                            disabled={loading.classes}
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>{cls.className}</option>
                            ))}
                        </select>
                        {loading.classes && <p className="text-xs text-gray-500 mt-1">Loading classes...</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Subject *</label>
                        <select
                            name="SubjectId"
                            value={formData.SubjectId}
                            onChange={handleSubjectChange}
                            className="w-full border p-2 rounded"
                            required
                            disabled={!formData.classId || loading.subjects}
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                                <option key={subject._id} value={subject._id}>{subject.title}</option>
                            ))}
                        </select>
                        {loading.subjects && <p className="text-xs text-gray-500 mt-1">Loading subjects...</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Subject Page *</label>
                        <select
                            name="SubjectPageId"
                            value={formData.SubjectPageId}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                            disabled={!formData.SubjectId || loading.subjectPages}
                        >
                            <option value="">Select Subject Page</option>
                            {subjectPages.map((page) => (
                                <option key={page._id} value={page._id}>{page.title || `Page ${page.pageNumber}`}</option>
                            ))}
                        </select>
                        {loading.subjectPages && <p className="text-xs text-gray-500 mt-1">Loading pages...</p>}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg">
                    <div>
                        <label className="block font-medium">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Content Title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Duration *</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="e.g., 45 minutes"
                            required
                        />
                    </div>
                </div>

                {/* Content Avatar */}
                <div className="p-4 rounded-lg">
                    <label className="block font-medium mb-2">Content Avatar/Image *</label>
                    <input
                        type="file"
                        onChange={handleAvatarChange}
                        className="w-full border p-2 rounded"
                        accept="image/*"
                        required={!formData.contentAvtar}
                    />
                    {formData.contentAvtar && (
                        <div className="mt-2">
                            <img
                                src={formData.contentAvtar}
                                alt="Content Avatar Preview"
                                className="h-24 object-cover rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Objectives */}
                <div className="p-4 rounded-lg bg-white">
                    <label className="block font-medium mb-4">Objectives *</label>
                    {formData.objectives.map((obj, index) => (
                        <div key={index} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Objective {index + 1}</h3>
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeObjective(index)}
                                        className="flex items-center px-2 py-1 bg-red-500 text-white rounded-md"
                                    >
                                        <Trash2 size={16} className="mr-1" /> Remove
                                    </button>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={obj.objectiveTitle}
                                    onChange={(e) => handleObjectiveChange(index, 'objectiveTitle', e.target.value)}
                                    className="w-full border p-2 rounded"
                                    placeholder="Objective title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Content *</label>
                                <RichtoolEditor
                                    editorValue={obj.objectiveValue}
                                    onEditorChange={(newContent) =>
                                        handleObjectiveChange(index, 'objectiveValue', newContent)
                                    }
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addObjective}
                        className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                    >
                        <Plus size={20} className="inline mr-2" />
                        Add Objective
                    </button>
                </div>

                {/* Interactive Activities */}
                <div className="p-4 rounded-lg bg-white">
                    <label className="block font-medium mb-4">Interactive Activities</label>
                    {formData.interactiveActivity.map((activity, index) => (
                        <div key={index} className="grid grid-cols-1 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
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
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={activity.title}
                                    onChange={(e) => handleActivityChange(index, 'title', e.target.value)}
                                    className="w-full border p-2 rounded"
                                    placeholder="Activity title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Link</label>
                                <input
                                    type="url"
                                    value={activity.link}
                                    onChange={(e) => handleActivityChange(index, 'link', e.target.value)}
                                    className="w-full border p-2 rounded"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Poster Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleActivityPosterChange(index, e)}
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
                        <Plus size={20} className="inline mr-2" />
                        Add Activity
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-8 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-blue-400"
                        disabled={loading.form}
                    >
                        {loading.form ? 'Submitting...' : 'Create Content'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateSubjectPagesContent;