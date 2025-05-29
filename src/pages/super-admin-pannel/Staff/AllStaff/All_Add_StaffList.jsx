import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, DatePicker, Row, Col, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ClassByBranchId, GetSchoolBranches, SchoolsDropdwon } from '@/Network/Super_Admin/auth';
import { createSchoolStaff, SchoolStaffByStaffId, updateSchoolStaff } from '@/Network/schooladminauth';

const { Option } = Select;

export const All_Add_StaffList = () => {
  const [form] = Form.useForm();
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // File and preview states
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  
  // Form-related states
  const [employeeRole, setEmployeeRole] = useState('staff');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [staffData, setStaffData] = useState(null);

  // Fetch schools for dropdown
  const fetchSchools = async () => {
    try {
      const res = await SchoolsDropdwon();
      setSchools(res.data || []);
    } catch (error) {
      message.error("Failed to fetch schools");
      console.error(error);
      setSchools([]);
    }
  };

  const fetchBranches = async (selectedSchoolId) => {
    if (!selectedSchoolId) {
      setBranches([]);
      return;
    }

    try {
      const res = await GetSchoolBranches(selectedSchoolId);
      setBranches(res.data);
      
      // Clear class selection
      setClasses([]);
      form.setFieldsValue({ classId: undefined });
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      message.error("Failed to fetch branches");
      setBranches([]);
    }
  };

  // Fetch classes based on branch ID
  const fetchClasses = async (selectedBranchId) => {
    if (!selectedBranchId) {
      console.log("No branch ID provided, skipping class fetch");
      return;
    }
    
    try {
      const res = await ClassByBranchId(selectedBranchId);
      if (res && res.data) {
        setClasses(res.data || []);
      } else {
        console.log("No class data returned");
        setClasses([]);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setClasses([]);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      fetchStaffDetails();
    }
  }, [id, isEditMode]);

  // Fetch staff details for editing
  const fetchStaffDetails = async () => {
    setIsLoading(true);
    try {
      const response = await SchoolStaffByStaffId(id);
      const data = response.data;
      setStaffData(data);

      // Format dates
      const formData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth) : null,
        dateofJoining: data.dateofJoining ? moment(data.dateofJoining) : null,
        marriageAnniversary: data.marriageAnniversary ? moment(data.marriageAnniversary) : null,
        password: '******',
      };

      // Set school and branch IDs
      if (data.school) {
        formData.schoolId = data.school._id;
        // Fetch branches for this school
        await fetchBranches(data.school._id);
      }

      if (data.branch) {
        formData.branchId = data.branch._id;
        
        // Only fetch classes if role is teacher
        if (data.employeeRole === 'teacher') {
          await fetchClasses(data.branch._id);
        }
      }

      // Set class ID for teachers
      if (data.class && data.employeeRole === 'teacher') {
        formData.classId = data.class._id;
      }

      // Extract address
      if (data.address) {
        formData.currentAddress = data.address.currentAddress;
        formData.permanentAddress = data.address.permanentAddress;
      }

      // Extract bank details
      if (data.employeeBankDeatils) {
        const bankDetails = data.employeeBankDeatils;
        formData.accountNumber = bankDetails.accountNumber;
        formData.nameAsPerBank = bankDetails.nameAsPerBank;
        formData.bankName = bankDetails.bankName;
        formData.bankBranch = bankDetails.bankBranch;
        formData.ifscCode = bankDetails.ifscCode;
      }

      // Set form values
      form.setFieldsValue(formData);

      setEmployeeRole(data.employeeRole);

      if (data.profile) {
        setProfilePreview(data.profile);
      }

    } catch (err) {
      toast.error("Failed to load staff details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile image preview
  const handleProfileUpload = (file) => {
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
    return false;
  };

  // Track employee role changes
  const handleRoleChange = (value) => {
    setEmployeeRole(value);
    
    // Only fetch classes if the role is teacher and we have a branch ID
    const branchId = form.getFieldValue('branchId');
    if (value === 'teacher' && branchId) {
      fetchClasses(branchId);
    }
  };

  // Track branch changes
  const handleBranchChange = (selectedBranchId) => {
    // Only fetch classes if the role is teacher
    if (employeeRole === 'teacher') {
      fetchClasses(selectedBranchId);
    }
  };

  // Convert uploaded files to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Form submission handler
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const profileBase64 = await convertFileToBase64(profileFile);
      const aadharBase64 = await convertFileToBase64(aadharFile);
      const panBase64 = await convertFileToBase64(panFile);

      // Create the payload
      const payload = {
        schoolId: values.schoolId,
        branchId: values.branchId,
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: moment(values.dateOfBirth).format("YYYY-MM-DD"),
        gender: values.gender,
        phoneNumber: values.phoneNumber,
        emailId: values.emailId,
        employeeRole: values.employeeRole,
        dateofJoining: moment(values.dateofJoining).format("YYYY-MM-DD"),
        bloodGroup: values.bloodGroup || '',
        maritalStatus: values.maritalStatus || '',
        marriageAnniversary: values.marriageAnniversary ? moment(values.marriageAnniversary).format("YYYY-MM-DD") : null,
        department: values.department,
        subDepartment: values.subDepartment,
        emergencyContact: values.emergencyContact,
        nationality: values.nationality,
        religion: values.religion,
        address: {
          currentAddress: values.currentAddress,
          permanentAddress: values.permanentAddress
        },
        employeeBankDeatils: {
          accountNumber: values.accountNumber,
          nameAsPerBank: values.nameAsPerBank,
          bankName: values.bankName,
          bankBranch: values.bankBranch,
          ifscCode: values.ifscCode
        }
      };

      // Add file uploads if present
      if (profileBase64) payload.profile = profileBase64;
      if (aadharBase64) payload.aadharCard = aadharBase64;
      if (panBase64) payload.panCard = panBase64;

      // Only include password if changed (not ****** placeholder)
      if (values.password && (!isEditMode || values.password !== '******')) {
        payload.password = values.password;
      }

      // Add teacher-specific fields
      if (employeeRole === 'teacher') {
        payload.classId = values.classId;
        payload.teacherName = values.teacherName || `${values.firstName} ${values.lastName}`;
      }

      // Submit the form (create or update)
      let response;
      if (isEditMode) {
        response = await updateSchoolStaff(id, payload);
      } else {
        response = await createSchoolStaff(payload);
      }

      if (response?.success) {
        toast.success(isEditMode ? "Staff updated successfully" : "Staff created successfully");
        form.resetFields();
        setProfilePreview(null);
        setProfileFile(null);
        setAadharFile(null);
        setPanFile(null);
        navigate('/eduworm-admin/schoolbranch/list');
      } else {
        toast.error(response?.message || "Operation failed");
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container p-4">
      <ToastContainer />
      {isLoading && <div className="text-center py-4"><Spin size="large" /></div>}

      <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ employeeRole: 'staff' }}
      >
        {/* Profile Picture Upload */}
        <Form.Item label="Profile Picture">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleProfileUpload}
          >
            <div className="w-32 h-32 border-dashed border-2 flex items-center justify-center cursor-pointer">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UploadOutlined className="text-xl" />
              )}
            </div>
          </Upload>
        </Form.Item>
        
        {/* School and Branch Selection */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="schoolId" label="School" rules={[{ required: true }]}>
              <Select 
                placeholder="Select School" 
                disabled={isEditMode} 
                onChange={(value) => {
                  fetchBranches(value);
                  form.setFieldsValue({ branchId: undefined, classId: undefined });
                }}
              >
                {Array.isArray(schools) && schools.length > 0 ? (
                  schools.map((s) => (
                    <Option key={s._id} value={s._id}>
                      {s.schoolName}
                    </Option>
                  ))
                ) : (
                  <Option value="" disabled>No schools available</Option>
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="branchId" label="Branch" rules={[{ required: true }]}>
              <Select 
                placeholder="Select Branch" 
                disabled={isEditMode}
                onChange={(value) => {
                  console.log("Branch selected:", value);
                  if (value) {
                    handleBranchChange(value);
                  } else {
                    // Clear class selection if branch is cleared
                    form.setFieldsValue({ classId: undefined });
                    setClasses([]);
                  }
                }}
              >
                {Array.isArray(branches) && branches.length > 0 ? (
                  branches.map((b) => (
                    <Option key={b._id} value={b._id}>
                      {b.name}
                    </Option>
                  ))
                ) : (
                  <Option value="" disabled>No branches available</Option>
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Basic Information */}
        <Row gutter={16}>
          <Col span={12}><Form.Item label="First Name" name="firstName" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input /></Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}><Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
          <Col span={12}><Form.Item label="Gender" name="gender" rules={[{ required: true }]}><Select><Option value="Male">Male</Option><Option value="Female">Female</Option><Option value="Other">Other</Option></Select></Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Employee Role" name="employeeRole" rules={[{ required: true }]}>
              <Select onChange={handleRoleChange} disabled={isEditMode}>
                <Option value="staff">Staff</Option>
                <Option value="teacher">Teacher</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}><Form.Item label="Date of Joining" name="dateofJoining" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
        </Row>

        {/* Teacher-specific Fields */}
        {employeeRole === 'teacher' && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Class" name="classId" rules={[{ required: true }]}>
                <Select placeholder="Select class" >
                  {Array.isArray(classes) && classes.length > 0 ? (
                    classes.map(cls => (
                      <Option key={cls._id} value={cls._id}>
                        {cls.className} {cls.section}
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>No classes available</Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Teacher Name" name="teacherName">
                <Input placeholder="Optional - Will use First Name + Last Name if blank" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Contact Information */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="Email Address" 
              name="emailId" 
              rules={[
                { required: true, message: "Email is required" }, 
                { type: 'email', message: "Invalid email format" }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Phone Number" 
              name="phoneNumber" 
              rules={[
                { required: true, message: "Phone number is required" }, 
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Department Information */}
        <Row gutter={16}>
          <Col span={12}><Form.Item label="Department" name="department" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="Sub Department" name="subDepartment" rules={[{ required: true }]}><Input /></Form.Item></Col>
        </Row>

        {/* Additional Information */}
        <Row gutter={16}>
          <Col span={12}><Form.Item label="Emergency Contact" name="emergencyContact" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}>
            <Form.Item label="Blood Group" name="bloodGroup">
              <Select allowClear>
                <Option value="A+">A+</Option>
                <Option value="B+">B+</Option>
                <Option value="O+">O+</Option>
                <Option value="AB+">AB+</Option>
                <Option value="A-">A-</Option>
                <Option value="B-">B-</Option>
                <Option value="O-">O-</Option>
                <Option value="AB-">AB-</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}><Form.Item label="Nationality" name="nationality" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item label="Religion" name="religion" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}>
            <Form.Item label="Marital Status" name="maritalStatus">
              <Select allowClear>
                <Option value="Single">Single</Option>
                <Option value="Married">Married</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Conditional field for marriage anniversary */}
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.maritalStatus !== currentValues.maritalStatus}>
          {({ getFieldValue }) =>
            getFieldValue('maritalStatus') === 'Married' ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Marriage Anniversary" name="marriageAnniversary">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : null
          }
        </Form.Item>

        {/* Address Information */}
        <Row gutter={16}>
          <Col span={12}><Form.Item label="Current Address" name="currentAddress" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item></Col>
          <Col span={12}><Form.Item label="Permanent Address" name="permanentAddress" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item></Col>
        </Row>

        {/* Bank Details */}
        <div className="border p-3 mb-4 rounded">
          <h3 className="mb-3 font-medium">Bank Details</h3>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Account Number" name="accountNumber" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="Name as per Bank" name="nameAsPerBank" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Bank Name" name="bankName" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Branch" name="bankBranch" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="IFSC Code" name="ifscCode" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
        </div>

        {/* Document Details */}
        <div className="border p-3 mb-4 rounded">
          <h3 className="mb-3 font-medium">Documents Details</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Aadhar Card"
                name="aadharCard"
                rules={[{ required: !isEditMode && !staffData?.document?.aadharCard, message: 'Please upload Aadhar Card' }]}
              >
                {staffData?.document?.aadharCard ? (
                  <div className="mb-2">
                    <span className="text-green-600">Aadhar card already uploaded</span>
                  </div>
                ) : null}
                <Upload
                  accept=".pdf,image/*"
                  showUploadList={{ showRemoveIcon: true }}
                  beforeUpload={() => false}
                  onChange={({ file }) => setAadharFile(file)}
                >
                  <Button icon={<UploadOutlined />}>
                    {staffData?.document?.aadharCard ? 'Change Aadhar' : 'Upload Aadhar'}
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="PAN Card"
                name="panCard"
              >
                {staffData?.document?.panCard ? (
                  <div className="mb-2">
                    <span className="text-green-600">PAN card already uploaded</span>
                  </div>
                ) : null}
                <Upload
                  accept=".pdf,image/*"
                  showUploadList={{ showRemoveIcon: true }}
                  beforeUpload={() => false}
                  onChange={({ file }) => setPanFile(file)}
                >
                  <Button icon={<UploadOutlined />}>
                    {staffData?.document?.panCard ? 'Change PAN' : 'Upload PAN'}
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Password fields */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                !isEditMode && { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ].filter(Boolean)}
            >
              <Input.Password placeholder={isEditMode ? "Leave blank to keep unchanged" : "Enter password"} />
            </Form.Item>
          </Col>
        </Row>

        {/* Form Buttons */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isEditMode ? "Update Staff" : "Create Staff"}
          </Button>
          <Button type="default" className="ml-2" onClick={() => window.history.back()}>Cancel</Button>
        </Form.Item>
      </Form>
    </div>
  );
};