import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClassesDropdown, CreateSubject } from '@/Network/Super_Admin/auth';

const SubjectCreate = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setIsLoading(true);
                const response = await ClassesDropdown();
                setClasses(response.data);
            } catch (err) {
                setError('Failed to fetch classes');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, []);

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

        if (!selectedClass || !formData.title) {
            setError('Class and title are required');
            return;
        }

        try {
            setIsLoading(true);
            let imageUrl = '';

            // Process image if file was selected
            if (file) {
                setIsUploading(true);
                const base64Image = await convertToBase64(file);
                imageUrl = base64Image; // Send base64 directly to backend
            } else {
                imageUrl = formData.imageUrl; // Use existing URL if no new file
            }

            const payload = {
                classId: selectedClass,
                title: formData.title,
                imageUrl: imageUrl
            };

            const response = await CreateSubject(payload);
            console.log('Subject created:', response.data);

            setSuccess(true);
            setError(null);
            // Reset form
            setFormData({
                title: '',
                imageUrl: ''
            });
            setSelectedClass('');
            setPreviewImage('');
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create subject');
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Extract only base64 part
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Subject</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    Subject created successfully!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="class">
                        Class *
                    </label>
                    <select
                        id="class"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        required
                    >
                        <option value="">Select a class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.className}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                        Subject Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Subject Image (Optional)
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
                    disabled={isLoading || isUploading}
                >
                    {isLoading ? 'Creating...' : 'Create Subject'}
                </button>
            </form>
        </div>
    );
};

export default SubjectCreate;