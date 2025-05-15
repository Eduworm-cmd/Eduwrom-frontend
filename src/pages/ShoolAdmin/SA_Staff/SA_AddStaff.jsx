import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, DatePicker, Row, Col, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ClassByBranchId } from '@/Network/Super_Admin/auth';

const { Option } = Select;

export const SA_AddStaff = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [employeeRole, setEmployeeRole] = useState('staff');
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const user = useSelector((state) => state.auth.user);

  const schoolId = user?.schoolId;
  const branchId = user?.id;
  
  console.log("School ID:", schoolId);
  console.log("Branch ID:", branchId);
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await ClassByBranchId(branchId);
        setClasses(res.data || []);
      } catch (err) {
        toast.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  // For editing mode - fetch staff details
  useEffect(() => {
    if (isEditMode && id) {
      const fetchStaffDetails = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/staff/${id}`);
          const staffData = res.data;
          
          // Format dates for form
          if (staffData.dateOfBirth) staffData.dateOfBirth = moment(staffData.dateOfBirth);
          if (staffData.dateofJoining) staffData.dateofJoining = moment(staffData.dateofJoining);
          if (staffData.marriageAnniversary) staffData.marriageAnniversary = moment(staffData.marriageAnniversary);
          
          form.setFieldsValue(staffData);
          setEmployeeRole(staffData.employeeRole);
          
          // Set profile preview if available
          if (staffData.profilePicture) {
            setProfilePreview(staffData.profilePicture);
          }
        } catch (err) {
          toast.error("Failed to load staff details");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchStaffDetails();
    }
  }, [id, isEditMode, form]);

  const handleProfileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  const handleRoleChange = (value) => {
    setEmployeeRole(value);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    if (!isEditMode && !aadharFile) {
      toast.error('Aadhar card is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      // Append scalar values
      formData.append('schoolId', schoolId);
      formData.append('branchId', branchId);
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('dateOfBirth', moment(values.dateOfBirth).format("YYYY-MM-DD"));
      formData.append('gender', values.gender);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('emailId', values.emailId);
      
      // Only append password for new staff
      if (!isEditMode && values.password) {
        formData.append('password', values.password);
      }
      
      formData.append('employeeRole', values.employeeRole);
      formData.append('dateofJoining', moment(values.dateofJoining).format("YYYY-MM-DD"));
      formData.append('bloodGroup', values.bloodGroup || '');
      formData.append('maritalStatus', values.maritalStatus || '');
      if (values.marriageAnniversary)
        formData.append('marriageAnniversary', moment(values.marriageAnniversary).format("YYYY-MM-DD"));

      formData.append('department', values.department);
      formData.append('subDepartment', values.subDepartment);
      formData.append('emergencyContact', values.emergencyContact);
      formData.append('nationality', values.nationality);
      formData.append('religion', values.religion);

      // Address
      formData.append('currentAddress', values.currentAddress);
      formData.append('permanentAddress', values.permanentAddress);

      // Bank Details
      formData.append('accountNumber', values.accountNumber);
      formData.append('nameAsPerBank', values.nameAsPerBank);
      formData.append('bankName', values.bankName);
      formData.append('bankBranch', values.bankBranch);
      formData.append('ifscCode', values.ifscCode);

      // Optional Teacher Fields
      if (employeeRole === 'teacher') {
        formData.append('classId', values.classId);
        formData.append('assignClassId', values.assignClassId || '');
        formData.append('teacherName', values.teacherName || `${values.firstName} ${values.lastName}`);
      }

      // Upload Files
      if (profilePreview && !profilePreview.startsWith('http')) {
        // Only append if it's a new upload (not a URL from the server)
        const blob = await fetch(profilePreview).then(res => res.blob());
        formData.append('profile', blob, 'profile.jpg');
      }

      // Only append files if they exist
      if (aadharFile) formData.append('aadharCard', aadharFile);
      if (panFile) formData.append('panCard', panFile);

      // Use the correct API endpoint - for PUT in edit mode, POST for create
      const endpoint = isEditMode 
        ? `/api/staff/${id}` 
        : 'http://localhost:4000/api/staff/create'; // Using the endpoint you specified
      
      const method = isEditMode ? 'put' : 'post';
      
      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(isEditMode ? "Staff updated successfully" : "Staff created successfully");
      
      if (!isEditMode) {
        // Only reset for new staff creation
        form.resetFields();
        setProfilePreview(null);
        setAadharFile(null);
        setPanFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} staff`);
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

        {/* Basic Fields (First Name, Last Name, etc.) */}
        <Row gutter={16}>
          <Col span={12}><Form.Item label="First Name" name="firstName" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input /></Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}><Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
          <Col span={12}><Form.Item label="Gender" name="gender" rules={[{ required: true }]}><Select><Option value="Male">Male</Option><Option value="Female">Female</Option><Option value="Other">Other</Option></Select></Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}><Form.Item label="Employee Role" name="employeeRole" rules={[{ required: true }]}><Select onChange={handleRoleChange}><Option value="staff">Staff</Option><Option value="teacher">Teacher</Option></Select></Form.Item></Col>
          <Col span={12}><Form.Item label="Date of Joining" name="dateofJoining" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
        </Row>

        {/* Teacher-specific Fields */}
        {employeeRole === 'teacher' && (
          <>
            <Row gutter={16}>
              <Col span={12}><Form.Item label="Class" name="classId" rules={[{ required: true }]}><Select placeholder="Select class">{classes.map(cls => (<Option key={cls._id} value={cls._id}>{cls.className} {cls.section}</Option>))}</Select></Form.Item></Col>
              <Col span={12}><Form.Item label="Assign Class (optional)" name="assignClassId"><Select allowClear placeholder="Optional">{classes.map(cls => (<Option key={cls._id} value={cls._id}>{cls.className} {cls.section}</Option>))}</Select></Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}><Form.Item label="Teacher Name" name="teacherName"><Input placeholder="Optional" /></Form.Item></Col>
            </Row>
          </>
        )}

        {/* Contact Info, Department, Address, etc. */}
        <Row gutter={16}>
          <Col span={12}><Form.Item label="Email Address" name="emailId" rules={[{ required: true }, { type: 'email' }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }, { pattern: /^[0-9]{10}$/, message: 'Invalid phone number' }]}><Input /></Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}><Form.Item label="Department" name="department" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="Sub Department" name="subDepartment" rules={[{ required: true }]}><Input /></Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}><Form.Item label="Emergency Contact" name="emergencyContact" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="Blood Group" name="bloodGroup"><Select allowClear><Option value="A+">A+</Option><Option value="B+">B+</Option><Option value="O+">O+</Option><Option value="AB+">AB+</Option><Option value="A-">A-</Option><Option value="B-">B-</Option><Option value="O-">O-</Option><Option value="AB-">AB-</Option></Select></Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}><Form.Item label="Nationality" name="nationality" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item label="Religion" name="religion" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item label="Marital Status" name="maritalStatus"><Select allowClear><Option value="Single">Single</Option><Option value="Married">Married</Option></Select></Form.Item></Col>
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

        {/* Address */}
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
                rules={[{ required: !isEditMode, message: 'Please upload Aadhar Card' }]}
              >
                <Upload
                  accept=".pdf,image/*"
                  showUploadList={{ showRemoveIcon: true }}
                  beforeUpload={() => false}
                  onChange={({ file }) => setAadharFile(file)}
                >
                  <Button icon={<UploadOutlined />}>Upload Aadhar</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="PAN Card"
                name="panCard"
              >
                <Upload
                  accept=".pdf,image/*"
                  showUploadList={{ showRemoveIcon: true }}
                  beforeUpload={() => false}
                  onChange={({ file }) => setPanFile(file)}
                >
                  <Button icon={<UploadOutlined />}>Upload PAN</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>
        
        {/* Password fields - only for new staff */}
        {!isEditMode && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Password" 
                name="password" 
                rules={[
                  { required: true, message: 'Please enter password' }, 
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        )}

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