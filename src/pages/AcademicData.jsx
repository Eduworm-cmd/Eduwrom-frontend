import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AcademicYearManagement = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [academicYears, setAcademicYears] = useState([]);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editItemId, setEditItemId] = useState(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    schoolId: '',
    branchId: ''
  });

  // Fetch academic years
  const fetchAcademicYears = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/academic', {
        params: {
          schoolId: selectedSchool || '',
        }
      });
      setAcademicYears(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch academic years');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch schools for dropdown
  const fetchSchools = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/schooladmin-auth');
      setSchools(response.data.data);
    } catch (err) {
      console.error('Failed to fetch schools:', err);
    }
  };

  // Fetch branches based on selected school
  const fetchBranches = async (schoolId) => {
    if (!schoolId) return;
    try {
      const response = await axios.get(`http://localhost:4000/api/branches/forschool`, {
        params: { schoolId }
      });
      setBranches(response.data.data);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      fetchBranches(selectedSchool);
    }
  }, [selectedSchool]);

  // For editing
  useEffect(() => {
    if (view === 'edit' && editItemId) {
      const fetchAcademicYear = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/academic/${editItemId}`);
          const data = response.data.data;
          setFormData({
            name: data.name,
            startDate: format(new Date(data.startDate), 'yyyy-MM-dd'),
            endDate: format(new Date(data.endDate), 'yyyy-MM-dd'),
            schoolId: data.schoolId,
            branchId: data.branchId
          });
          
          // Fetch branches for the school
          if (data.schoolId) {
            setSelectedSchool(data.schoolId);
            fetchBranches(data.schoolId);
          }
        } catch (err) {
          setError('Failed to fetch academic year details');
          console.error(err);
        }
      };
      
      fetchAcademicYear();
    }
  }, [view, editItemId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // If school is changed, update branches
    if (name === 'schoolId') {
      setSelectedSchool(value);
      fetchBranches(value);
      setFormData(prev => ({
        ...prev,
        branchId: '' // Reset branch when school changes
      }));
    }
  };

  const handleAddAcademicYear = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      schoolId: selectedSchool || '',
      branchId: ''
    });
    setView('add');
  };

  const handleEditAcademicYear = (year) => {
    setEditItemId(year._id);
    setView('edit');
    setFormData({
      name: year.name,
      startDate: format(new Date(year.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(year.endDate), 'yyyy-MM-dd'),
      schoolId: year.schoolId,
      branchId: year.branchId
    });
  };

  const handleViewAcademicYear = (yearId) => {
    // Implement view functionality here if needed
    console.log("Viewing academic year:", yearId);
    // For now, we'll just log it
  };

  const handleCancel = () => {
    setView('list');
    setEditItemId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (view === 'add') {
        await axios.post('http://localhost:4000/api/academic', formData);
      } else if (view === 'edit') {
        await axios.patch(`http://localhost:4000/api/academic/${editItemId}`, formData);
      }
      
      setView('list');
      setEditItemId(null);
      fetchAcademicYears();
      setError(null);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred');
      } else {
        setError('An error occurred');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async (yearId) => {
    if (window.confirm('Are you sure you want to deactivate this academic year?')) {
      try {
        // This is a placeholder - backend needs a proper endpoint for deactivation
        await axios.patch(`/api/academic-years/${yearId}`, { active: false });
        fetchAcademicYears();
        setError(null);
      } catch (err) {
        setError('Failed to deactivate academic year');
        console.error(err);
      }
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedSchool(null);
  };

  // Filter and paginate academic years
  const filteredAcademicYears = academicYears?.filter(year => {
    return year.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (year.branchName && year.branchName.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredAcademicYears?.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAcademicYears?.length / rowsPerPage);

  // Render Add/Edit form
  const renderForm = () => {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleCancel} 
            className="text-gray-600 mr-2"
          >
            &lt;
          </button>
          <h1 className="text-2xl font-semibold">
            {view === 'add' ? 'Add Academic Year' : 'Edit Academic Year'}
          </h1>
        </div>
        
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded p-2"
                placeholder="e.g., 2025-2026"
              />
            </div>
            
            <div>
              <label className="block mb-1">School</label>
              <select
                name="schoolId"
                value={formData.schoolId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Select School</option>
                {schools.map(school => (
                  <option key={school._id} value={school._id}>
                    {school.schoolName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">
                Branch<span className="text-red-500">*</span>
              </label>
              <select
                name="branchId"
                value={formData.branchId}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Select Branch</option>
                {branches?.map(branch => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            
            <div>
              <label className="block mb-1">
                End Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          
          <div className="flex justify-start space-x-2 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-700 text-white px-6 py-2 rounded"
            >
              {isLoading ? 'Saving...' : view === 'add' ? 'Add' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Render list view
  const renderList = () => {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Academic Year ({filteredAcademicYears?.length})</h1>
          <div className="space-x-2">
            <button
              onClick={handleAddAcademicYear}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded"
            >
              + Add Academic Year
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              Deactivated
            </button>
          </div>
        </div>
        
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
        
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search"
              className="border border-gray-300 rounded p-2 pr-8"
            />
            <span className="absolute right-2 top-2 text-gray-400">🔍</span>
          </div>
          
          <button
            onClick={handleResetFilter}
            className="flex items-center text-gray-500"
          >
            ↺ Reset Filter
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="w-10 px-6 py-3 text-left">
                      <input type="checkbox" />
                    </th>
                    <th className="px-6 py-3 text-left">Sr.No</th>
                    <th className="px-6 py-3 text-left">Branch School Name</th>
                    <th className="px-6 py-3 text-left">Academic Year Name</th>
                    <th className="px-6 py-3 text-left">Start Date</th>
                    <th className="px-6 py-3 text-left">End Date</th>
                    <th className="px-6 py-3 text-left">Created Date</th>
                    <th className="px-6 py-3 text-center">View</th>
                    <th className="px-6 py-3 text-center">Edit</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords?.length > 0 ? (
                    currentRecords?.map((year, index) => (
                      <tr key={year._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input type="checkbox" />
                        </td>
                        <td className="px-6 py-4">{indexOfFirstRecord + index + 1}</td>
                        <td className="px-6 py-4">{year.branchName || 'N/A'}</td>
                        <td className="px-6 py-4">{year.name}</td>
                        <td className="px-6 py-4">
                          {format(new Date(year.startDate), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          {format(new Date(year.endDate), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          {format(new Date(year.createdAt), 'dd/M/yyyy, h:mm:ss a')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-gray-500 relative group">
                            ⋯
                            <div className="absolute hidden group-hover:block right-0 mt-2 w-24 bg-white border border-gray-200 rounded shadow-lg z-10">
                              <button 
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleViewAcademicYear(year._id)}
                              >
                                View
                              </button>
                              <button 
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleEditAcademicYear(year)}
                              >
                                Edit
                              </button>
                              <button 
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                                onClick={() => handleDeactivate(year._id)}
                              >
                                Deactivate
                              </button>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleEditAcademicYear(year)}
                            className="text-gray-500"
                          >
                            ✏️
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="flex justify-center">
                            <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center">
                        No academic years found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div>
                <span className="mr-2">Rows per page:</span>
                <select 
                  value={rowsPerPage} 
                  onChange={handleRowsPerPageChange}
                  className="border border-gray-300 rounded p-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              
              <div>
                <span>{indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredAcademicYears?.length)} of {filteredAcademicYears?.length}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="ml-2 px-2 py-1 border rounded disabled:opacity-50"
                >
                  &lt;
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="ml-2 px-2 py-1 border rounded disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div className="bg-gray-50 min-h-screen">
      {view === 'list' && renderList()}
      {(view === 'add' || view === 'edit') && renderForm()}
    </div>
  );
};

export default AcademicYearManagement;