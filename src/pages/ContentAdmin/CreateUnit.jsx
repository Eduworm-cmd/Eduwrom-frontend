import { ClassesDropdown, PostUnit } from '@/Network/Super_Admin/auth';
import React, { useEffect, useState } from 'react'

const CreateUnit = () => {
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        classId: "",
        name: "",
        totalDays: ""
    });

  
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await ClassesDropdown();
                setClasses(res.data);
                console.log(res.data);
            } catch (err) {
                console.error("Failed to load classes:", err);
            }
        };
        fetchClasses();
    }, []);

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await PostUnit(formData);
            alert("Unit created successfully!");
            setFormData({ classId: "", name: "", totalDays: "" });
        } catch (error) {
            console.error("Error creating unit:", error);
            alert("Failed to create unit.");
        }
    };
  return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Create New Unit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Class Dropdown */}
                <div>
                    <label className="block font-medium">Select Class</label>
                    <select
                        name="classId"
                        value={formData.classId}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Class --</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.className}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Unit Name */}
                <div>
                    <label className="block font-medium">Unit Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="e.g. Unit 2: Introduction to Science"
                        required
                    />
                </div>

                {/* Total Days */}
                <div>
                    <label className="block font-medium">Total Days</label>
                    <input
                        type="number"
                        name="totalDays"
                        value={formData.totalDays}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                        min={1}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                >
                    Create Unit
                </button>
            </form>
        </div>
    );
};


export default CreateUnit
