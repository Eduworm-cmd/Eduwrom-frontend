import { useState, useEffect } from 'react';
import { ChevronDown, Upload, X, ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function StudentManagement() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    academicYear: '',
    grade: '',
    class: '',
    name: '',
    branch: localStorage.getItem('branchId') || '' // Get branch from local storage
  });

  // Form data for creating/editing student
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    school: localStorage.getItem('schoolId') || '',
    rollNo: '',
    admissionNumber: '',
    dateOfJoining: '',
    enrollmentStatus: 'Active',
    bloodGroup: '',
    uniqueId: '',
    photo: null,
    branch: localStorage.getItem('branchId') || '',
    currentClass: {
      academicYear: '',
      grade: '',
      section: ''
    },
    parents: []
  });

  // Local state for parent forms
  const [parent1, setParent1] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    photo: null
  });

  const [parent2, setParent2] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    photo: null
  });

  // Load students on component mount and when filters change
  useEffect(() => {
    fetchStudents();
  }, [pagination.page, pagination.limit, filters]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });
      
      // Add filters
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.grade) params.append('grade', filters.grade);
      if (filters.class) params.append('section', filters.class);
      if (filters.name) params.append('name', filters.name);
      
      const response = await axios.get(`http://localhost:4000/api/students?${params.toString()}`);
      
      if (response.data.success) {
        setStudents(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.data.message || 'Error fetching students');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset to first page when filter changes
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      academicYear: '',
      grade: '',
      class: '',
      name: '',
      branch: localStorage.getItem('branchId') || ''
    });
  };

  const handleInputChange = (e, parent = null) => {
    const { name, value } = e.target;
    
    if (parent === 'parent1') {
      setParent1(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (parent === 'parent2') {
      setParent2(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name === 'academicYear' || name === 'grade' || name === 'class') {
      // Handle currentClass object
      setFormData(prev => ({
        ...prev,
        currentClass: {
          ...prev.currentClass,
          academicYear: name === 'academicYear' ? value : prev.currentClass.academicYear,
          grade: name === 'grade' ? value : prev.currentClass.grade,
          section: name === 'class' ? value : prev.currentClass.section
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      if (field === 'studentPhoto') {
        setFormData(prev => ({
          ...prev,
          photo: base64String
        }));
      } else if (field === 'parent1Photo') {
        setParent1(prev => ({
          ...prev,
          photo: base64String
        }));
      } else if (field === 'parent2Photo') {
        setParent2(prev => ({
          ...prev,
          photo: base64String
        }));
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepare parents array
      const parents = [];
      
      if (parent1.firstName) {
        parents.push({
          firstName: parent1.firstName,
          lastName: parent1.lastName,
          relationship: parent1.relationship,
          phone: parent1.phone,
          email: parent1.email,
          address: parent1.address
        });
      }
      
      if (parent2.firstName) {
        parents.push({
          firstName: parent2.firstName,
          lastName: parent2.lastName,
          relationship: parent2.relationship,
          phone: parent2.phone,
          email: parent2.email,
          address: parent2.address
        });
      }
      
      // Prepare data to send
      const studentData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth, // convert to format expected by backend if needed
        parents: parents
      };
      
      // Add parent photos separately
      if (parent1.photo) {
        studentData.parentPhoto0 = parent1.photo;
      }
      
      if (parent2.photo) {
        studentData.parentPhoto1 = parent2.photo;
      }
      
      // Send request to create student
      const response = await axios.post('http://localhost:4000/api/students', studentData);
      
      if (response.data.success) {
        // Reset form and switch to list view
        resetForm();
        setActiveTab('list');
        // Refresh student list
        fetchStudents();
      } else {
        setError(response.data.message || 'Error creating student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentStatus = async (studentId, isActive) => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/students/${studentId}/status`, {
        isActive: !isActive
      });
      
      if (response.data.success) {
        // Update student in state
        setStudents(prev => 
          prev.map(student => 
            student._id === studentId 
              ? { ...student, isActive: !isActive } 
              : student
          )
        );
      }
    } catch (err) {
      console.error('Error toggling student status:', err);
      // Show error notification here
    }
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }
    
    try {
      const response = await axios.delete(`http://localhost:4000/api/students/${studentId}`);
      
      if (response.data.success) {
        // Remove student from state
        setStudents(prev => prev.filter(student => student._id !== studentId));
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      // Show error notification here
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      school: localStorage.getItem('schoolId') || '',
      rollNo: '',
      admissionNumber: '',
      dateOfJoining: '',
      enrollmentStatus: 'Active',
      bloodGroup: '',
      uniqueId: '',
      photo: null,
      branch: localStorage.getItem('branchId') || '',
      currentClass: {
        academicYear: '',
        grade: '',
        section: ''
      }
    });
    
    setParent1({
      firstName: '',
      lastName: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      photo: null
    });
    
    setParent2({
      firstName: '',
      lastName: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      photo: null
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="bg-white min-h-screen">
      {activeTab === 'list' ? (
        <StudentList 
          students={students} 
          onAddClick={() => setActiveTab('add')}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          onToggleStatus={toggleStudentStatus}
          onDeleteStudent={deleteStudent}
        />
      ) : (
        <AddStudent 
          formData={formData}
          parent1={parent1}
          parent2={parent2}
          onChange={handleInputChange}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onBack={() => setActiveTab('list')}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

function StudentList({ 
  students, 
  onAddClick, 
  loading, 
  error, 
  pagination, 
  onPageChange,
  filters,
  onFilterChange,
  onResetFilters,
  onToggleStatus,
  onDeleteStudent
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Students ({pagination.total || students.length})
        </h1>
        <div className="flex gap-2">
          <button className="bg-gray-200 px-4 py-2 rounded">Promote</button>
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded flex items-center">
            <ChevronDown size={18} className="mr-1" /> ID Card
          </button>
          <button 
            onClick={onAddClick}
            className="bg-purple-100 text-purple-700 px-4 py-2 rounded flex items-center"
          >
            + Add Student
          </button>
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded flex items-center">
            + Bulk Upload Students
          </button>
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded">Deactivated</button>
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded">Export to Excel</button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative w-64">
          <select 
            name="academicYear"
            value={filters.academicYear}
            onChange={onFilterChange}
            className="w-full p-2 border rounded appearance-none"
          >
            <option value="">Academic Year</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
          <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
        </div>
        
        <div className="relative w-64">
          <select 
            name="grade"
            value={filters.grade}
            onChange={onFilterChange}
            className="w-full p-2 border rounded appearance-none"
          >
            <option value="">Grade</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
          </select>
          <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
        </div>
        
        <div className="relative w-64">
          <select 
            name="class"
            value={filters.class}
            onChange={onFilterChange}
            className="w-full p-2 border rounded appearance-none"
          >
            <option value="">Class/Section</option>
            <option value="ece">ECE</option>
            <option value="primary">Primary</option>
          </select>
          <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
        </div>
        
        <div className="relative flex-grow">
          <input 
            type="text" 
            name="name"
            value={filters.name}
            onChange={onFilterChange}
            placeholder="Search by name" 
            className="w-full p-2 border rounded pl-10"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
        </div>
        
        <button 
          onClick={onResetFilters}
          className="text-purple-700 px-4 py-2 rounded flex items-center"
        >
          Reset Filter
        </button>
      </div>
      
      {loading && <div className="text-center py-4">Loading students...</div>}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {!loading && !error && students.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No students found. Add a new student or change your filters.
        </div>
      )}
      
      {!loading && students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-t border-gray-200">
            <thead>
              <tr className="text-left text-purple-900">
                <th className="p-3 border-b"><input type="checkbox" /></th>
                <th className="p-3 border-b">Sno</th>
                <th className="p-3 border-b">Student Details</th>
                <th className="p-3 border-b">Parent and Contact</th>
                <th className="p-3 border-b">Academic Year</th>
                <th className="p-3 border-b">Class</th>
                <th className="p-3 border-b">Created Date</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        {student.photo ? (
                          <img 
                            src={student.photo} 
                            alt={student.firstName} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">👤</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-gray-500">DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">Roll.No: {student.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      {student.parents && student.parents.map((parent, idx) => (
                        <div key={idx} className="mb-1">
                          {parent.firstName} {parent.lastName}: {parent.phone}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{student.currentClass?.academicYear || '-'}</td>
                  <td className="p-3">
                    {student.currentClass?.grade ? (
                      `Grade ${student.currentClass.grade} ${student.currentClass.section || ''}`
                    ) : '-'}
                  </td>
                  <td className="p-3">{new Date(student.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-4 h-4 rounded-full ${student.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                        onClick={() => onToggleStatus(student._id, student.isActive)}
                        title={student.isActive ? "Deactivate" : "Activate"}
                        style={{ cursor: 'pointer' }}
                      ></div>
                      <button 
                        className="text-gray-500"
                        onClick={() => onDeleteStudent(student._id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {pagination.pages > 1 && (
        <div className="flex justify-end items-center mt-4">
          <div className="mr-4">
            Rows per page: 
            <select 
              className="ml-2 border rounded p-1"
              value={pagination.limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setPagination(prev => ({
                  ...prev,
                  limit: newLimit,
                  page: 1
                }));
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="mr-4">
            {((pagination.page - 1) * pagination.limit) + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </div>
          <button 
            className="p-1"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="p-1"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function AddStudent({ 
  formData, 
  parent1, 
  parent2, 
  onChange, 
  onImageChange, 
  onSubmit, 
  onBack,
  loading,
  error 
}) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add Student</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="bg-white rounded-lg shadow">
          <div className="border-b p-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Student Information</h2>
            <ChevronDown size={20} />
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">
                First Name<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={(e) => onChange(e)}
                className="w-full p-2 border rounded" 
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={(e) => onChange(e)}
                className="w-full p-2 border rounded" 
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">
                Date Of Birth<span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => onChange(e)}
                className="w-full p-2 border rounded" 
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">
                Gender<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => onChange(e)}
                  className="w-full p-2 border rounded appearance-none" 
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Admission Number</label>
              <input 
                type="text" 
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={(e) => onChange(e)}
                className="w-full p-2 border rounded" 
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Roll No.</label>
              <input 
                type="text" 
                name="rollNo"
                value={formData.rollNo}
                onChange={(e) => onChange(e)}
                className="w-full p-2 border rounded" 
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Date Of Joining</label>
              <input 
                type="date" 
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={(e) => onChange(e)}
                className="w-full p-2 border rounded" 
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Enrollment Status</label>
              <div className="relative">
                <select 
                  name="enrollmentStatus"
                  value={formData.enrollmentStatus}
                  onChange={(e) => onChange(e)}
                  className="w-full p-2 border rounded appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Transferred">Transferred</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Blood Group</label>
              <div className="relative">
                <select 
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) => onChange(e)}
                  className="w-full p-2 border rounded appearance-none"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="p-4">
            <label className="block mb-1 font-medium">Student UniqueId</label>
            <input 
              type="text" 
              name="uniqueId"
              value={formData.uniqueId}
              onChange={(e) => onChange(e)}
              className="w-full p-2 border rounded" 
            />
          </div>
          
          <div className="p-4">
            <label className="block mb-1 font-medium">Photo</label>
            <div className="border rounded p-2 flex items-center justify-center h-16">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageChange(e, 'studentPhoto')}
                className="hidden"
                id="studentPhoto"
              />
              <label htmlFor="studentPhoto" className="text-gray-500 flex items-center cursor-pointer">
                {formData.photo ? 'Change Image' : 'Upload Image'} <Upload size={18} className="ml-2" />
              </label>
              {formData.photo && (
                <div className="ml-4">
                  <img 
                    src={formData.photo} 
                    alt="Student" 
                    className="h-12 w-12 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium">
                Current Class<span className="text-red-500">*</span>
              </label>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <select 
                  name="academicYear"
                  value={formData.currentClass.academicYear}
                  onChange={(e) => onChange(e)}
                  className="w-full p-2 border rounded appearance-none" 
                  required
                >
                  <option value="">Academic Year</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
              </div>
              
              <div className="relative">
                <select 
                  name="grade"
                  value={formData.currentClass.grade}
                  onChange={(e) => onChange(e)}
                  className="w-full p-2 border rounded appearance-none" 
                  required
                >
                  <option value="">Grade</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
              </div>
              
              <div className="relative flex items-center">
                <div className="flex-grow relative">
                  <select 
                    name="class"
                    value={formData.currentClass.section}
                    onChange={(e) => onChange(e)}
                    className="w-full p-2 border rounded appearance-none" 
                    required
                  >
                    <option value="">Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="border-b p-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-purple-900">Family Information</h2>
            <ChevronDown size={20} />
          </div>
          
          <div className="border-b p-4 flex items-center justify-between">
            <h3 className="font-medium">Parent</h3>
          </div>
          
          {/* Parent 1 Information */}
          <div className="p-4 border-b">
            <h4 className="font-medium mb-4">Parent 1 Details</h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={parent1.firstName}
                  onChange={(e) => onChange(e, 'parent1')}
                  className="w-full p-2 border rounded" 
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={parent1.lastName}
                  onChange={(e) => onChange(e, 'parent1')}
                  className="w-full p-2 border rounded" 
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">
                  Relationship<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="relationship"
                    value={parent1.relationship}
                    onChange={(e) => onChange(e, 'parent1')}
                    className="w-full p-2 border rounded appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 font-medium">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="w-16 border rounded-l flex items-center justify-center bg-gray-50">
                    +91
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={parent1.phone}
                    onChange={(e) => onChange(e, 'parent1')}
                    className="flex-grow p-2 border-t border-r border-b rounded-r" 
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block mb-1 font-medium">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={parent1.email}
                  onChange={(e) => onChange(e, 'parent1')}
                  className="w-full p-2 border rounded" 
                />
              </div>
              
              <div className="col-span-2">
                <label className="block mb-1 font-medium">Current Address</label>
                <textarea 
                  name="address"
                  value={parent1.address}
                  onChange={(e) => onChange(e, 'parent1')}
                  className="w-full p-2 border rounded" 
                  rows="3"
                ></textarea>
              </div>
              
              <div className="col-span-2">
                <label className="block mb-1 font-medium">Parent 1 Photo</label>
                <div className="border rounded p-2 flex items-center justify-center h-16">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImageChange(e, 'parent1Photo')}
                    className="hidden"
                    id="parent1Photo"
                  />
                  <label htmlFor="parent1Photo" className="text-gray-500 flex items-center cursor-pointer">
                    {parent1.photo ? 'Change Image' : 'Upload Image'} <Upload size={18} className="ml-2" />
                  </label>
                  {parent1.photo && (
                    <div className="ml-4">
                      <img 
                        src={parent1.photo} 
                        alt="Parent 1" 
                        className="h-12 w-12 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Parent 2 Information */}
          <div className="p-4">
            <h4 className="font-medium mb-4">Parent 2 Details</h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={parent2.firstName}
                  onChange={(e) => onChange(e, 'parent2')}
                  className="w-full p-2 border rounded" 
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={parent2.lastName}
                  onChange={(e) => onChange(e, 'parent2')}
                  className="w-full p-2 border rounded" 
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Relationship</label>
                <div className="relative">
                  <select 
                    name="relationship"
                    value={parent2.relationship}
                    onChange={(e) => onChange(e, 'parent2')}
                    className="w-full p-2 border rounded appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-3 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <div className="flex">
                  <div className="w-16 border rounded-l flex items-center justify-center bg-gray-50">
                    +91
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={parent2.phone}
                    onChange={(e) => onChange(e, 'parent2')}
                    className="flex-grow p-2 border-t border-r border-b rounded-r" 
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block mb-1 font-medium">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={parent2.email}
                  onChange={(e) => onChange(e, 'parent2')}
                  className="w-full p-2 border rounded" 
                />
              </div>
              
              <div className="col-span-2">
                <label className="block mb-1 font-medium">Current Address</label>
                <textarea 
                  name="address"
                  value={parent2.address}
                  onChange={(e) => onChange(e, 'parent2')}
                  className="w-full p-2 border rounded" 
                  rows="3"
                ></textarea>
              </div>
              
              <div className="col-span-2">
                <label className="block mb-1 font-medium">Parent 2 Photo</label>
                <div className="border rounded p-2 flex items-center justify-center h-16">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImageChange(e, 'parent2Photo')}
                    className="hidden"
                    id="parent2Photo"
                  />
                  <label htmlFor="parent2Photo" className="text-gray-500 flex items-center cursor-pointer">
                    {parent2.photo ? 'Change Image' : 'Upload Image'} <Upload size={18} className="ml-2" />
                  </label>
                  {parent2.photo && (
                    <div className="ml-4">
                      <img 
                        src={parent2.photo} 
                        alt="Parent 2" 
                        className="h-12 w-12 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center mt-6 mb-10">
          <button 
            type="button"
            onClick={onBack}
            className="px-6 py-2 border rounded mr-4"
          >
            Back
          </button>
          <button 
            type="submit"
            className="px-6 py-2 bg-purple-700 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}