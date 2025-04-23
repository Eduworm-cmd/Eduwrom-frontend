import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'create', 'edit'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    emailIDOfficial: '',
    gender: '',
    employeeRole: '',
    school: '',
    branch: '',
    employeeId: '',
    title: '',
    emailIDPersonal: '',
    bloodGroup: '',
    maritalStatus: '',
    marriageAnniversary: '',
    department: '',
    subDepartment: '',
    emergencyContact: '',
    nationality: '',
    religion: '',
    fatherName: '',
    currentAddress: '',
    permanentAddress: '',
    bankDetails: {
      accountNumber: '',
      nameAsPerBank: '',
      bankName: '',
      bankBranch: '',
      ifscCode: ''
    }
  });
  const [filters, setFilters] = useState({
    grade: '',
    class: '',
    role: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState({
    photo: null,
    aadhaarCard: null,
    panCard: null
  });
  
  const fetchStaff = async () => {
    try {
      setLoading(true);
      // Construct query params for filters and pagination
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', limit);
      
      if (filters.grade) params.append('grade', filters.grade);
      if (filters.class) params.append('class', filters.class);
      if (filters.role) params.append('role', filters.role);
      
      const response = await axios.get(`/api/staff?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setStaff(response.data.data);
      setTotalPages(Math.ceil(response.data.count / limit));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested bankDetails object
    if (name.startsWith('bank.')) {
      const bankField = name.split('.')[1];
      setFormData({
        ...formData,
        bankDetails: {
          ...formData.bankDetails,
          [bankField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      emailIDOfficial: '',
      gender: '',
      employeeRole: '',
      school: '',
      branch: '',
      employeeId: '',
      title: '',
      emailIDPersonal: '',
      bloodGroup: '',
      maritalStatus: '',
      marriageAnniversary: '',
      department: '',
      subDepartment: '',
      emergencyContact: '',
      nationality: '',
      religion: '',
      fatherName: '',
      currentAddress: '',
      permanentAddress: '',
      bankDetails: {
        accountNumber: '',
        nameAsPerBank: '',
        bankName: '',
        bankBranch: '',
        ifscCode: ''
      }
    });
    setFiles({
      photo: null,
      aadhaarCard: null,
      panCard: null
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'bankDetails') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append files if they exist
      if (files.photo) formDataToSend.append('photo', files.photo);
      if (files.aadhaarCard) formDataToSend.append('aadhaarCard', files.aadhaarCard);
      if (files.panCard) formDataToSend.append('panCard', files.panCard);
      
      let response;
      
      if (viewMode === 'edit' && selectedStaff) {
        // Update existing staff
        response = await axios.put(`/api/staff/${selectedStaff._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Create new staff
        response = await axios.post('/api/staff', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      
      setLoading(false);
      setViewMode('table');
      fetchStaff(); // Refresh the table
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      setLoading(false);
    }
  };
  
  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    
    // Populate form with staff data
    const staffData = {
      firstName: staffMember.firstName || '',
      lastName: staffMember.lastName || '',
      dateOfBirth: staffMember.dateOfBirth ? new Date(staffMember.dateOfBirth).toISOString().split('T')[0] : '',
      phoneNumber: staffMember.phoneNumber || '',
      emailIDOfficial: staffMember.emailIDOfficial || '',
      gender: staffMember.gender || '',
      employeeRole: staffMember.employeeRole || '',
      school: staffMember.school || '',
      branch: staffMember.branch?._id || staffMember.branch || '',
      employeeId: staffMember.employeeId || '',
      title: staffMember.title || '',
      emailIDPersonal: staffMember.emailIDPersonal || '',
      bloodGroup: staffMember.bloodGroup || '',
      maritalStatus: staffMember.maritalStatus || '',
      marriageAnniversary: staffMember.marriageAnniversary ? new Date(staffMember.marriageAnniversary).toISOString().split('T')[0] : '',
      department: staffMember.department || '',
      subDepartment: staffMember.subDepartment || '',
      emergencyContact: staffMember.emergencyContact || '',
      nationality: staffMember.nationality || '',
      religion: staffMember.religion || '',
      fatherName: staffMember.fatherName || '',
      currentAddress: staffMember.currentAddress || '',
      permanentAddress: staffMember.permanentAddress || '',
      bankDetails: staffMember.bankDetails || {
        accountNumber: '',
        nameAsPerBank: '',
        bankName: '',
        bankBranch: '',
        ifscCode: ''
      }
    };
    
    setFormData(staffData);
    setViewMode('edit');
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    fetchStaff();
  };
  
  const resetFilters = () => {
    setFilters({
      grade: '',
      class: '',
      role: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    fetchStaff();
  };
  
  useEffect(() => {
    fetchStaff();
  }, [currentPage, limit]);
  
  // Table component
  const StaffTable = () => (
    <div className="staff-table-container">
      <div className="table-header">
        <h1>Staff ({staff?.length})</h1>
        <div className="table-actions">
          <button 
            className="btn-download"
            onClick={() => alert('ID Card download functionality')}
          >
            📄 ID Card
          </button>
          <button 
            className="btn-export"
            onClick={() => alert('Export functionality')}
          >
            Export
          </button>
          <button 
            className="btn-add"
            onClick={() => {
              resetForm();
              setViewMode('create');
            }}
          >
            + Add Staff
          </button>
          <button 
            className="btn-deactivated"
            onClick={() => alert('View deactivated staff')}
          >
            Deactivated
          </button>
        </div>
      </div>
      
      <div className="filters-section">
        <div className="filter-controls">
          <select
            name="grade"
            value={filters.grade}
            onChange={handleFilterChange}
          >
            <option value="">Grade</option>
            <option value="KG-1">KG-1</option>
            <option value="KG-2">KG-2</option>
            <option value="Nursery">Nursery</option>
          </select>
          
          <select
            name="class"
            value={filters.class}
            onChange={handleFilterChange}
          >
            <option value="">Class</option>
            <option value="All Classes">All Classes</option>
            <option value="Nursery">Nursery</option>
          </select>
          
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="">Role</option>
            <option value="BRANCH_ADMIN">BRANCH_ADMIN</option>
            <option value="TEACHER">TEACHER</option>
          </select>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => applyFilters()}>🔍</button>
          </div>
          
          <button onClick={resetFilters}>Reset Filter</button>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>#</th>
              <th>Name</th>
              <th>Email/Phone</th>
              <th>Role</th>
              <th>Classrooms</th>
              <th>Created Date</th>
              <th>Login</th>
              <th>ID Card</th>
              <th>View/Edit Profile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff?.map((member, index) => (
              <tr key={member._id}>
                <td><input type="checkbox" /></td>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>
                  <div className="staff-name">
                    <div className="avatar">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={`${member.firstName} ${member.lastName}`} />
                      ) : (
                        <div className="avatar-placeholder">
                          {member.firstName?.charAt(0) || ''}
                          {member.lastName?.charAt(0) || ''}
                        </div>
                      )}
                    </div>
                    <div>
                      <div>{member.firstName} {member.lastName}</div>
                      <div className="dob">DOB: {member.dateOfBirth && new Date(member.dateOfBirth).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>Phone: {member.phoneNumber}</div>
                  <div>Email: {member.emailIDOfficial}</div>
                </td>
                <td>{member.employeeRole}</td>
                <td>
                  {member.classrooms?.map(classroom => (
                    <div key={classroom._id} className="classroom-tag">{classroom.name}</div>
                  )) || 'No classrooms'}
                </td>
                <td>{new Date(member.createdAt).toLocaleString()}</td>
                <td>
                  <button className="btn-login">
                    <span>→</span>
                  </button>
                </td>
                <td>
                  <button className="btn-id-card">
                    <span>📄</span>
                  </button>
                </td>
                <td>
                  <button 
                    className="btn-view-profile"
                    onClick={() => handleEdit(member)}
                  >
                    <span>👤</span>
                  </button>
                </td>
                <td>
                  <div className="action-menu">
                    <button className="btn-more">⋮</button>
                    <div className="status-indicator active"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <div>Rows per page: 
          <select 
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="page-controls">
          <span>{(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, staff?.length)} of {staff?.length}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
  
  // Form component for creating or editing staff
  const StaffForm = () => (
    <div className="staff-form-container">
      <div className="form-header">
        <h1>{viewMode === 'edit' ? 'Edit Staff Information' : 'Add Staff Information'}</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date Of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number*</label>
              <div className="phone-input">
                <select>
                  <option value="+91">+91</option>
                </select>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emailIDOfficial">Email ID Official*</label>
              <input
                id="emailIDOfficial"
                name="emailIDOfficial"
                type="email"
                value={formData.emailIDOfficial}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender*</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employeeRole">Employee Role*</label>
              <select
                id="employeeRole"
                name="employeeRole"
                value={formData.employeeRole}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="BRANCH_ADMIN">BRANCH_ADMIN</option>
                <option value="TEACHER">TEACHER</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="school">School*</label>
              <select
                id="school"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Toondemy SnC">Toondemy SnC</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="branch">Branch*</label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Toondemy SnC">Toondemy SnC</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="employeeId">Employee Id</label>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                value={formData.employeeId}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="emailIDPersonal">Email ID Personal</label>
              <input
                id="emailIDPersonal"
                name="emailIDPersonal"
                type="email"
                value={formData.emailIDPersonal}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
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
            </div>
            <div className="form-group">
              <label htmlFor="maritalStatus">Marital Status</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
          
          {formData.maritalStatus === 'Married' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="marriageAnniversary">Marriage Anniversary</label>
                <input
                  id="marriageAnniversary"
                  name="marriageAnniversary"
                  type="date"
                  value={formData.marriageAnniversary}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="subDepartment">Sub Department</label>
              <input
                id="subDepartment"
                name="subDepartment"
                type="text"
                value={formData.subDepartment}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emergencyContact">Emergency Contact</label>
              <input
                id="emergencyContact"
                name="emergencyContact"
                type="tel"
                value={formData.emergencyContact}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nationality">Nationality</label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                value={formData.nationality}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="religion">Religion</label>
              <input
                id="religion"
                name="religion"
                type="text"
                value={formData.religion}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="fatherName">Father Name</label>
              <input
                id="fatherName"
                name="fatherName"
                type="text"
                value={formData.fatherName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        {/* Bank Details Section */}
        <div className="form-section">
          <h2>Employee Bank Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bank.accountNumber">Account Number</label>
              <input
                id="bank.accountNumber"
                name="bank.accountNumber"
                type="text"
                value={formData.bankDetails?.accountNumber || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bank.nameAsPerBank">Name As Per Bank</label>
              <input
                id="bank.nameAsPerBank"
                name="bank.nameAsPerBank"
                type="text"
                value={formData.bankDetails?.nameAsPerBank || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bank.bankName">Bank Name</label>
              <input
                id="bank.bankName"
                name="bank.bankName"
                type="text"
                value={formData.bankDetails?.bankName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bank.bankBranch">Bank Branch</label>
              <input
                id="bank.bankBranch"
                name="bank.bankBranch"
                type="text"
                value={formData.bankDetails?.bankBranch || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bank.ifscCode">IFSC Code</label>
              <input
                id="bank.ifscCode"
                name="bank.ifscCode"
                type="text"
                value={formData.bankDetails?.ifscCode || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        {/* Address Section */}
        <div className="form-section">
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="currentAddress">Current Address</label>
              <textarea
                id="currentAddress"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="permanentAddress">Permanent Address</label>
              <textarea
                id="permanentAddress"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>
        </div>
        
        {/* Documents Section */}
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="aadhaarCard">Aadhaar Card</label>
              <div className="file-upload">
                <input
                  id="aadhaarCard"
                  name="aadhaarCard"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*, application/pdf"
                />
                <button type="button" className="upload-btn">Upload</button>
              </div>
              {viewMode === 'edit' && selectedStaff?.aadhaarCardUrl && (
                <div className="file-preview">
                  <a href={selectedStaff.aadhaarCardUrl} target="_blank" rel="noopener noreferrer">
                    View Current Aadhaar Card
                  </a>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="panCard">PAN Card</label>
              <div className="file-upload">
                <input
                  id="panCard"
                  name="panCard"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*, application/pdf"
                />
                <button type="button" className="upload-btn">Upload</button>
              </div>
              {viewMode === 'edit' && selectedStaff?.panCardUrl && (
                <div className="file-preview">
                  <a href={selectedStaff.panCardUrl} target="_blank" rel="noopener noreferrer">
                    View Current PAN Card
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="photo">Photo</label>
              <div className="file-upload">
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <button type="button" className="upload-btn">Upload Image</button>
              </div>
              {viewMode === 'edit' && selectedStaff?.photoUrl && (
                <div className="file-preview">
                  <img 
                    src={selectedStaff.photoUrl} 
                    alt="Staff Photo" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-back"
            onClick={() => setViewMode('table')}
          >
            Back
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={loading}
          >
            {loading ? 'Saving...' : (viewMode === 'edit' ? 'Update' : 'Add')}
          </button>
        </div>
      </form>
    </div>
  );
  
  return (
    <div className="staff-management-container">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {viewMode === 'table' ? <StaffTable /> : <StaffForm />}
      
      <style jsx>{`
        .staff-management-container {
          font-family: 'Arial', sans-serif;
          color: #333;
          padding: 20px;
        }
        
        .error-message {
          background-color: #ffecec;
          color: #f44336;
          padding: 10px;
margin-bottom: 15px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .error-message button {
          background: none;
          border: none;
          color: #f44336;
          cursor: pointer;
          font-size: 18px;
        }
        
        .staff-table-container, .staff-form-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .table-header, .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .table-header h1, .form-header h1 {
          font-size: 24px;
          margin: 0;
        }
        
        .table-actions {
          display: flex;
          gap: 10px;
        }
        
        .table-actions button {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        
        .btn-download, .btn-export {
          background-color: #f0f0f0;
          color: #333;
        }
        
        .btn-add {
          background-color: #6366f1;
          color: white;
        }
        
        .btn-deactivated {
          background-color: #f0f0f0;
          color: #666;
        }
        
        .filters-section {
          padding: 15px 20px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .filter-controls {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .filter-controls select, .filter-controls input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 150px;
        }
        
        .search-box {
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .search-box input {
          padding-right: 35px;
        }
        
        .search-box button {
          position: absolute;
          right: 5px;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .filter-controls button {
          padding: 8px 12px;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eaeaea;
        }
        
        th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        tr:hover {
          background-color: #f9fafb;
        }
        
        .staff-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e0e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4f46e5;
          font-weight: bold;
          overflow: hidden;
        }
        
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .dob {
          font-size: 12px;
          color: #666;
        }
        
        .classroom-tag {
          display: inline-block;
          background-color: #e0e7ff;
          color: #4338ca;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin-right: 5px;
          margin-bottom: 5px;
        }
        
        .btn-login, .btn-id-card, .btn-view-profile {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background-color: #f0f0f0;
          cursor: pointer;
        }
        
        .action-menu {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .btn-more {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          padding: 5px;
        }
        
        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-left: 8px;
        }
        
        .status-indicator.active {
          background-color: #10b981;
        }
        
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-top: 1px solid #eaeaea;
        }
        
        .pagination select {
          padding: 5px;
          margin-left: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .page-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .page-controls button {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background-color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .page-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Form Styles */
        .form-section {
          padding: 20px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .form-section h2 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .form-group {
          flex: 1;
        }
        
        .form-group.full-width {
          flex: 0 0 100%;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        .form-group textarea {
          resize: vertical;
        }
        
        .phone-input {
          display: flex;
          align-items: center;
        }
        
        .phone-input select {
          width: 80px;
          margin-right: 10px;
        }
        
        .file-upload {
          display: flex;
          align-items: center;
        }
        
        .file-upload input {
          flex: 1;
          opacity: 0;
          position: absolute;
        }
        
        .upload-btn {
          padding: 8px 16px;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .file-preview {
          margin-top: 10px;
        }
        
        .form-actions {
          padding: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 15px;
        }
        
        .btn-back {
          padding: 10px 20px;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-save {
          padding: 10px 20px;
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default StaffManagement;