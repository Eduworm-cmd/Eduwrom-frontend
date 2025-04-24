import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreateGrade, GetGradeById, GetGrades, GetLevels, GetSchools } from '@/Network/Super_Admin/auth';
import { toast, ToastContainer } from 'react-toastify';
import { ChevronLeft, ChevronRight, PlusCircle, Search, Trash, Trash2 } from 'lucide-react';
import { ExportButton } from '@/components/Buttons/ExportButton/ExportButton';

// Main component that handles all grade management functionality
const GradeManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [grades, setGrades] = useState([]);
    const [schools, setSchools] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentView, setCurrentView] = useState('list');
    const [currentGradeId, setCurrentGradeId] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        minAge: 3,
        maxAge: 3,
        school: '',
        level: ''
    });

    // Fetch initial data
    useEffect(() => {
        fetchGrades();
        fetchSchools();
        fetchLevels();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdown(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Fetch grades from API
    const fetchGrades = async () => {
        try {
            setLoading(true);
            const response = await GetGrades()
            setGrades(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching grades:', error);
            setLoading(false);
        }
    };

    // Fetch schools from API with updated endpoint
    const fetchSchools = async () => {
        try {
            const response = await GetSchools();
            const mappedSchools = response.data?.map(school => ({
                _id: school._id,
                name: school.schoolName
            }));
            setSchools(mappedSchools);
        } catch (error) {
            console.error('Error fetching schools:', error);
        }
    };

    // Fetch levels from API
    const fetchLevels = async () => {
        try {
            const response = await GetLevels();
            setLevels(response);
        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };


    // Fetch single grade by ID
    const fetchGradeById = async (id) => {
        try {
            setLoading(true);
            const response = await GetGradeById(id);
            const grade = response.data;

            // Set form data with all the necessary fields
            setFormData({
                name: grade.name || '',
                type: grade.type || '',
                minAge: grade.minAge || 3,
                maxAge: grade.maxAge || 3,
                school: grade.school?._id || '',
                level: grade.level?._id || ''
            });

            setLoading(false);
            return grade;
        } catch (error) {
            console.error('Error fetching grade:', error);
            setLoading(false);
            return null;
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle slider changes for age inputs
    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: parseInt(value) });
    };

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Reset search filter
    const resetFilter = () => {
        setSearchTerm('');
    };

    // Toggle dropdown menu for a specific row
    const toggleDropdown = (e, id) => {
        e.stopPropagation(); // Prevent triggering document click
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // Navigate to add grade view
    const handleAddGrade = () => {
        setFormData({
            name: '',
            type: '',
            minAge: 3,
            maxAge: 3,
            school: '',
            level: ''
        });
        setCurrentView('add');
    };

    // Navigate to edit grade view
    const handleEditGrade = async (id) => {
        await fetchGradeById(id);
        setCurrentGradeId(id);
        setCurrentView('edit');
    };

    // Navigate to view grade details
    const handleViewGrade = async (id) => {
        await fetchGradeById(id);
        setCurrentGradeId(id);
        setCurrentView('view');
    };

    // Handle deactivate grade
    const handleDeactivateGrade = async (id) => {
        try {
            await axios.put(`http://localhost:4000/api/grade/${id}`, { isActive: false }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh grades list
            await fetchGrades();
        } catch (error) {
            console.error('Error deactivating grade:', error);
        }
    };

    // Navigate back to list view
    const handleBackToList = () => {
        setCurrentView('list');
        setCurrentGradeId(null);
    };

    // Submit form for create/update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (currentView === 'add') {
                const response = await CreateGrade(formData);
                toast.success('Grade created successfully!');
            } else if (currentView === 'edit') {
                await axios.put(`http://localhost:4000/api/grade/${currentGradeId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }

            await fetchGrades();
            setCurrentView('list');
            setCurrentGradeId(null);
        } catch (error) {
            console.error('Error saving grade:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter grades based on search term
    const filteredGrades = grades.filter(grade =>
        grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (grade.school?.name && grade.school.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (grade.type && grade.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Find current grade for view/edit
    const currentGrade = currentGradeId
        ? grades.find(grade => grade._id === currentGradeId)
        : null;

    // Render different views based on currentView state
    const renderView = () => {
        switch (currentView) {
            case 'add':
                return renderFormView('Add Grade');
            case 'edit':
                return renderFormView('Edit Grade');
            case 'view':
                return renderDetailView();
            default:
                return renderListView();
        }
    };

    const columns = [
        { key: "name", label: "School Name" },
        { key: "StartDate", label: "Start Date" },
        { key: "EndDate", label: "End Date" },
        { key: "AY", label: "Academic Year" },
    ];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Full filtered list (e.g., after search)
    const filteredData = filteredGrades; // Adjust if needed

    // Only show items on current page
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Function to change page
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Example pagination range builder (like 1 2 ... 10)
    const paginationRange = () => {
        const range = [];
        const delta = 2;
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push(1);
        if (left > 2) range.push("...");

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < totalPages - 1) range.push("...");
        if (totalPages > 1) range.push(totalPages);

        return range;
    };

    // Render list view
    const renderListView = () => {
        return (
            <div>
                {/* Header and Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-700">Grade ({grades.length})</h1>
                    <div className="space-x-2 flex items-center justify-between">
                        <button
                            onClick={handleAddGrade}
                            className="flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] bg-sky-500"
                        >
                            <PlusCircle /> Add Grade
                        </button>
                        <ExportButton columns={columns} currentItems={filteredGrades} />
                        <button
                            onClick={handleAddGrade}
                            className="flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] bg-red-500"
                        >
                            <Trash2 /> Deactivated
                        </button>
                    </div>
                </div>

                {/* Search + Filter */}
                <div className="flex items-center justify-between mb-4 bg-blue-400 rounded-sm shadow-md px-2 py-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-white max-w-[250px] p-2 pl-10 border rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="w-12 py-3"><input type="checkbox" /></th>
                                        <th className="text-left py-3 px-4">Sr.No</th>
                                        <th className="text-left py-3 px-4">School Name</th>
                                        <th className="text-left py-3 px-4">Grade Name</th>
                                        <th className="text-left py-3 px-4">Type</th>
                                        <th className="text-left py-3 px-4">No.of Classes</th>
                                        <th className="text-left py-3 px-4">No.of Students</th>
                                        <th className="text-left py-3 px-4">Created Date</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((grade, index) => (
                                        <tr key={grade._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4"><input type="checkbox" /></td>
                                            <td className="py-3 px-4">{indexOfFirstItem + index + 1}</td>
                                            <td className="py-3 px-4">{grade.school?.name || 'N/A'}</td>
                                            <td className="py-3 px-4">{grade.name}</td>
                                            <td className="py-3 px-4">{grade.type}</td>
                                            <td className="py-3 px-4">{grade.classes?.length || 0}</td>
                                            <td className="py-3 px-4">{grade.students?.length || 0}</td>
                                            <td className="py-3 px-4">
                                                {new Date(grade.createdAt).toLocaleDateString()},{" "}
                                                {new Date(grade.createdAt).toLocaleTimeString()}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className={`h-3 w-3 rounded-full ${grade.isActive ? 'bg-green-500' : 'bg-red-500'} mx-auto`}></div>
                                            </td>
                                            <td className="py-3 px-4 text-center relative">
                                                <button
                                                    onClick={(e) => toggleDropdown(e, grade._id)}
                                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                                >
                                                    ⋮
                                                </button>
                                                {activeDropdown === grade._id && (
                                                    <div className="absolute right-6 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                        <button onClick={() => { handleViewGrade(grade._id); setActiveDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View</button>
                                                        <button onClick={() => { handleEditGrade(grade._id); setActiveDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                                                        <button onClick={() => { handleDeactivateGrade(grade._id); setActiveDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Deactivate</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {/* ✅ Pagination Section */}
                        <div className="flex items-center justify-between mt-4 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                                <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> of{" "}
                                <span className="font-medium">{filteredData.length}</span> results
                            </div>

                            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                {paginationRange().map((page, idx) =>
                                    page === "..." ? (
                                        <span key={idx} className="px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={idx}
                                            onClick={() => paginate(page)}
                                            className={`px-4 py-2 text-sm font-semibold ${currentPage === page
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        );
    };


    // Render form view (used for both add and edit)
    const renderFormView = (title) => {
        return (
            <div>
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleBackToList}
                        className="mr-4 text-gray-600"
                    >
                        ←
                    </button>
                    <h1 className="text-3xl font-bold text-gray-700">{title}</h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1">
                                Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1">
                                Type<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-2 rounded"
                                required
                            >
                                <option value="">Select</option>
                                <option value="General">GENERAL</option>
                                <option value="Special">SPECIAL</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1">
                                Min Age<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="range"
                                name="minAge"
                                min="1"
                                max="18"
                                value={formData.minAge}
                                onChange={handleSliderChange}
                                className="w-full accent-purple-600"
                            />
                            <div className="text-right">{formData.minAge}</div>
                        </div>

                        <div>
                            <label className="block mb-1">
                                Max Age<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="range"
                                name="maxAge"
                                min="1"
                                max="18"
                                value={formData.maxAge}
                                onChange={handleSliderChange}
                                className="w-full accent-purple-600"
                            />
                            <div className="text-right">{formData.maxAge}</div>
                        </div>

                        <div>
                            <label className="block mb-1">
                                School<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-2 rounded"
                                required
                            >
                                <option value="">Select</option>
                                {schools.map(school => (
                                    <option key={school._id} value={school._id}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1">
                                Level<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-2 rounded"
                                required
                            >
                                <option value="">Select</option>
                                {levels.map(level => (
                                    <option key={level._id} value={level._id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex space-x-2">
                        <button
                            type="button"
                            onClick={handleBackToList}
                            className="px-6 py-2 border border-gray-300 rounded"
                        >
                            {currentView === 'add' ? 'Back' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-purple-700 text-white rounded"
                        >
                            {loading ? 'Processing...' : currentView === 'add' ? 'Add' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    // Render detail view for viewing a grade
    const renderDetailView = () => {
        if (!currentGrade) {
            return (
                <div className="text-center py-8">
                    Grade not found. <button onClick={handleBackToList} className="text-purple-700">Back to list</button>
                </div>
            );
        }

        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={handleBackToList}
                            className="mr-4 text-gray-600"
                        >

                        </button>
                        <h1 className="text-3xl font-bold text-gray-700">Grade Details</h1>
                    </div>
                    <button
                        onClick={() => handleEditGrade(currentGrade._id)}
                        className="flex items-center space-x-1 bg-purple-700 text-white py-2 px-4 rounded"
                    >
                        <span>✏️</span>
                        <span>Edit</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-gray-500 mb-1">Name</h3>
                            <p className="text-lg">{currentGrade.name}</p>
                        </div>

                        <div>
                            <h3 className="text-gray-500 mb-1">Type</h3>
                            <p className="text-lg">{currentGrade.type}</p>
                        </div>

                        <div>
                            <h3 className="text-gray-500 mb-1">Age Range</h3>
                            <p className="text-lg">{currentGrade.minAge} - {currentGrade.maxAge} years</p>
                        </div>

                        <div>
                            <h3 className="text-gray-500 mb-1">School</h3>
                            <p className="text-lg">{currentGrade.school?.name || 'N/A'}</p>
                        </div>

                        <div>
                            <h3 className="text-gray-500 mb-1">Level</h3>
                            <p className="text-lg">{currentGrade.level?.name || 'N/A'}</p>
                        </div>

                        <div>
                            <h3 className="text-gray-500 mb-1">Status</h3>
                            <div className="flex items-center">
                                <div className={`h-3 w-3 rounded-full ${currentGrade.isActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                                <p className="text-lg">{currentGrade.isActive ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-gray-500 mb-1">Created By</h3>
                                <p>{currentGrade.createdBy?.name || 'Unknown'} ({currentGrade.createdBy?.role || 'N/A'})</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(currentGrade.createdAt).toLocaleDateString()},
                                    {new Date(currentGrade.createdAt).toLocaleTimeString()}
                                </p>
                            </div>

                            {currentGrade.updatedBy && (
                                <div>
                                    <h3 className="text-gray-500 mb-1">Last Updated By</h3>
                                    <p>{currentGrade.updatedBy?.name || 'Unknown'} ({currentGrade.updatedBy?.role || 'N/A'})</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(currentGrade.updatedAt).toLocaleDateString()},
                                        {new Date(currentGrade.updatedAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            <ToastContainer />
            {renderView()}
        </div>
    );
};

export default GradeManagement;