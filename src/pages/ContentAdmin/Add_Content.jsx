import PostApi from '@/Api/PostApi';
import RichtoolEditor from '@/components/RichtoolEditor/RichtoolEditor';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

export const Add_Content = () => {
 
    const handleApi = async() =>{
        try{
            const response = await PostApi('courseContent/createCourseContent',Post,{},);
            console.log(response);
        }catch(error){
            console.log(error);
            
        }
    }

    const [formData, setFormData] = useState({
        unit: '',
        week: '',
        day: '',
        header: '',
        objectives: [{ objective: '', editorValue: '' }],
        title: '',
        url: '',
        poster: null, 
    });

    const [editorValue, setEditorValue] = useState('');

    const handleEditorChange = (newValue) => {
        setEditorValue(newValue);
        console.log('Editor content:', newValue);
    };


    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name === 'objective') {
            const updatedObjectives = [...formData.objectives];
            updatedObjectives[index].objective = value;
            setFormData({
                ...formData,
                objectives: updatedObjectives,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleAddObjective = () => {
        setFormData({
            ...formData,
            objectives: [...formData.objectives, { objective: '', richEditor: '' }],
        });
    };

    const handleRemoveObjective = (index) => {
        if (index !== 0) {
            const updatedObjectives = formData.objectives.filter((_, i) => i !== index);
            setFormData({
                ...formData,
                objectives: updatedObjectives,
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                poster: file, // Store file in formData
            });
            console.log('File selected: ', file); // Log the file to console
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Log the form data to the console
        console.log('Form submitted with data: ', formData);
    };

    return (
        <div>
            <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Form to Add Lessons</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                        <div className="col-span-1">
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                            <select
                                id="unit"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Unit</option>
                                <option value="Unit 1">Unit 1</option>
                                <option value="Unit 2">Unit 2</option>
                                <option value="Unit 3">Unit 3</option>
                            </select>
                        </div>

                        <div className="col-span-1">
                            <label htmlFor="week" className="block text-sm font-medium text-gray-700">Week</label>
                            <select
                                id="week"
                                name="week"
                                value={formData.week}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Week</option>
                                <option value="Week 1">Week 1</option>
                                <option value="Week 2">Week 2</option>
                                <option value="Week 3">Week 3</option>
                            </select>
                        </div>

                        <div className="col-span-1">
                            <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day</label>
                            <select
                                id="day"
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Day</option>
                                <option value="Monday">Day 1</option>
                                <option value="Tuesday">Day 2</option>
                                <option value="Wednesday">Day 3</option>
                                <option value="Thursday">Day 4</option>
                                <option value="Friday">Day 5</option>
                            </select>
                        </div>
                    </div>

                    {/* Header Input */}
                    <div className='bg-blue-50 p-4 rounded-lg'>
                        <label htmlFor="header" className="block text-sm font-medium text-gray-700">Header</label>
                        <input
                            type="text"
                            id="header"
                            name="header"
                            value={formData.header}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Header"
                        />
                    </div>

                    {/* Objective Section - Dynamic Fields */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <label htmlFor="objective" className="block text-sm font-medium text-gray-700">
                            Objectives
                        </label>
                        {formData.objectives.map((obj, index) => (
                            <div key={index} className="space-y-4 mb-4">
                                <div className="objective-input">
                                    <input
                                        type="text"
                                        name="objective"
                                        value={obj.objective}
                                        onChange={(e) => handleChange(e, index)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        placeholder={`Objective ${index + 1}`}
                                    />
                                </div>

                                {/* RichtoolEditor - In a separate div */}
                                <div className="richtool-editor">
                                    <RichtoolEditor
                                        editorValue={obj.editorValue}
                                        onEditorChange={(newContent) => {
                                            const updatedObjectives = [...formData.objectives];
                                            updatedObjectives[index].editorValue = newContent;
                                            setFormData({
                                                ...formData,
                                                objectives: updatedObjectives,
                                            });
                                        }}
                                    />
                                </div>

                                {/* Remove Button - Only for non-first objectives */}
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveObjective(index)}
                                        className="flex border-2 px-2 py-2 bg-red-500 text-white rounded-md"
                                    >
                                        <Trash2 /> Remove Objective
                                    </button>
                                )}
                            </div>
                        ))}
                        {/* Add Objective Button */}
                        <button
                            type="button"
                            onClick={handleAddObjective}
                            className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                        >
                            Add Objective
                        </button>
                    </div>

                    {/* Interactive Activities Section */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <label htmlFor="interactive-activities" className="block text-sm font-medium text-gray-700 mb-5">Interactive Activities</label>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Title Field */}
                            <div className="col-span-1">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter Title"
                                />
                            </div>

                            {/* URL Field */}
                            <div className="col-span-1">
                                <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
                                <input
                                    type="url"
                                    id="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter URL"
                                />
                            </div>

                            {/* File Input for Poster */}
                            <div className="col-span-1">
                                <label htmlFor="poster" className="block text-sm font-medium text-gray-700">Upload Poster</label>
                                <input
                                    type="file"
                                    id="poster"
                                    name="poster"
                                    onChange={handleFileChange} // Assuming you want to handle file change
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
