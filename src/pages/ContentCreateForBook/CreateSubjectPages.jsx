import React, { useState, useEffect } from 'react';
import { ClassesDropdown, createSubjectPage, getSubjectByClassId } from '@/Network/Super_Admin/auth';
import axios from 'axios';

const SubjectPageCreate = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState({
        classes: false,
        subjects: false,
        form: false
    });
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [file, setFile] = useState(null);

    // Fetch all classes on component mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setIsLoading(prev => ({ ...prev, classes: true }));
                const response = await ClassesDropdown();
                setClasses(response.data);
            } catch (err) {
                setError('Failed to fetch classes');
            } finally {
                setIsLoading(prev => ({ ...prev, classes: false }));
            }
        };

        fetchClasses();
    }, []);

    // Fetch subjects when class is selected
    useEffect(() => {
        const fetchSubjects = async () => {
            if (!selectedClass) {
                setSubjects([]);
                setSelectedSubject('');
                return;
            }

            try {
                setIsLoading(prev => ({ ...prev, subjects: true }));
                setSelectedSubject('');
                const response = await getSubjectByClassId(selectedClass);
                setSubjects(response.data);
            } catch (err) {
                setError('Failed to fetch subjects for selected class');
            } finally {
                setIsLoading(prev => ({ ...prev, subjects: false }));
            }
        };

        fetchSubjects();
    }, [selectedClass]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validate file type
        if (!selectedFile.type.match('image.*')) {
            setError('Please select an image file (JPEG, PNG, WEBP)');
            return;
        }

        // Validate file size (2MB max)
        if (selectedFile.size > 2 * 1024 * 1024) {
            setError('Image size should be less than 2MB');
            return;
        }

        setFile(selectedFile);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedClass || !selectedSubject || !formData.title) {
            setError('Class, Subject and Title are required');
            return;
        }

        try {
            setIsLoading(prev => ({ ...prev, form: true }));
            let imageUrl = '';

            // Process image if file was selected
            if (file) {
                setIsUploading(true);
                const base64Image = await convertToBase64(file);
                imageUrl = base64Image;
            } else {
                imageUrl = formData.imageUrl;
            }

            const payload = {
                classId: selectedClass,
                SubjectId: selectedSubject,
                title: formData.title,
                imageUrl: imageUrl
            };

            const response = await createSubjectPage(payload);
            console.log('Subject page created:', response.data);

            setSuccess(true);
            setError(null);
            // Reset form
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create subject page');
        } finally {
            setIsLoading(prev => ({ ...prev, form: false }));
            setIsUploading(false);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            imageUrl: ''
        });
        setSelectedClass('');
        setSelectedSubject('');
        setPreviewImage('');
        setFile(null);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Subject Page</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    Subject page created successfully!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Class Dropdown */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Class *
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        required
                        disabled={isLoading.classes}
                    >
                        <option value="">Select a class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.className || cls.name}
                            </option>
                        ))}
                    </select>
                    {isLoading.classes && (
                        <p className="mt-1 text-xs text-gray-500">Loading classes...</p>
                    )}
                </div>

                {/* Subject Dropdown */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Subject *
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        required
                        disabled={!selectedClass || isLoading.subjects}
                    >
                        <option value="">{selectedClass ? 'Select a subject' : 'First select a class'}</option>
                        {subjects.map((subject) => (
                            <option key={subject._id} value={subject._id}>
                                {subject.title}
                            </option>
                        ))}
                    </select>
                    {isLoading.subjects && (
                        <p className="mt-1 text-xs text-gray-500">Loading subjects...</p>
                    )}
                </div>

                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Page Title *
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Page Image (Optional)
                    </label>

                    {previewImage && (
                        <div className="mb-3 flex flex-col items-center">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="h-32 w-32 object-cover rounded-md mb-2"
                            />
                            <button
                                type="button"
                                className="text-sm text-red-600 hover:text-red-800"
                                onClick={() => {
                                    setPreviewImage('');
                                    setFile(null);
                                }}
                            >
                                Remove Image
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col items-start">
                        <label className={`cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 transition duration-200 ${isUploading ? 'opacity-50' : ''}`}>
                            {file ? 'Change Image' : 'Select Image'}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                            Max 2MB (JPEG, PNG, WEBP)
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={isLoading.form || isUploading}
                >
                    {isLoading.form ? 'Creating...' : 'Create Subject Page'}
                </button>
            </form>
        </div>
    );
};

export default SubjectPageCreate;