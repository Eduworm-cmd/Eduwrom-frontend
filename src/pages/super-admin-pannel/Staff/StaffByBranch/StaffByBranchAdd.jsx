import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, DatePicker, Row, Col, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ClassByBranchId } from '@/Network/Super_Admin/auth';
import { createSchoolStaff, SchoolStaffByStaffId, updateSchoolStaff } from '@/Network/schooladminauth';

const { Option } = Select;

export const StaffByBranchAdd = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [employeeRole, setEmployeeRole] = useState('staff');
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const user = useSelector((state) => state.auth.user);
  const schoolId = user?.schoolId;
  const branchId = user?.id;
  const branchIdState = location.state?.branchId;
  console.log("Branch Id : ", branchIdState);

  useEffect(() => {
    const fetchClasses = async () => {
      const effectiveBranchId = branchIdState || branchId;
      if (!effectiveBranchId) return
      try {
        const res = await ClassByBranchId(effectiveBranchId);
        setClasses(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchClasses();
  }, [branchId]);

  const fetchStaffDetails = async () => {
    setIsLoading(true);
    try {
      const response = await SchoolStaffByStaffId(id);
      const staffData = response.data;

      if (staffData.dateOfBirth) staffData.dateOfBirth = moment(staffData.dateOfBirth);
      if (staffData.dateofJoining) staffData.dateofJoining = moment(staffData.dateofJoining);
      if (staffData.marriageAnniversary) staffData.marriageAnniversary = moment(staffData.marriageAnniversary);

      if (staffData.address) {
        staffData.currentAddress = staffData.address.currentAddress;
        staffData.permanentAddress = staffData.address.permanentAddress;
      }

      if (staffData.employeeBankDeatils) {
        const bankDetails = staffData.employeeBankDeatils;
        staffData.accountNumber = bankDetails.accountNumber;
        staffData.nameAsPerBank = bankDetails.nameAsPerBank;
        staffData.bankName = bankDetails.bankName;
        staffData.bankBranch = bankDetails.bankBranch;
        staffData.ifscCode = bankDetails.ifscCode;
      }

      if (staffData.document) {
        if (staffData.document.aadharCard) {
          form.setFieldsValue({ aadharCard: staffData.document.aadharCard });
        }
        if (staffData.document.panCard) {
          form.setFieldsValue({ panCard: staffData.document.panCard });
        }
      }

      if (staffData.class && staffData.employeeRole === 'teacher') {
        staffData.classId = staffData.class._id;
      }

      form.setFieldsValue({
        ...staffData,
        password: '******'
      });

      setEmployeeRole(staffData.employeeRole);

      if (staffData.profile) {
        setProfilePreview(staffData.profile);
      }

    } catch (err) {
      toast.error("Failed to load staff details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode && id) {
      fetchStaffDetails();
    }
  }, [id, isEditMode, form]);

  const handleProfileUpload = (file) => {
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
    return false;
  };

  const handleRoleChange = (value) => {
    setEmployeeRole(value);
  };

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

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const profileBase64 = await convertFileToBase64(profileFile);
      const aadharBase64 = await convertFileToBase64(aadharFile);
      const panBase64 = await convertFileToBase64(panFile);

      const payload = {
        schoolId,
        branchId,
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

      if (profileBase64) payload.profile = profileBase64;
      if (aadharBase64) payload.aadharCard = aadharBase64;
      if (panBase64) payload.panCard = panBase64;

      if (values.password && (!isEditMode || values.password !== '******')) {
        payload.password = values.password;
      }

      if (employeeRole === 'teacher') {
        payload.classId = values.classId;
        payload.teacherName = values.teacherName || `${values.firstName} ${values.lastName}`;
      }

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
        navigate("/eduworm-school/staff/list");
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
                {form.getFieldValue('aadharCard') && isEditMode ? (
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
                    {form.getFieldValue('aadharCard') && isEditMode ? 'Change Aadhar' : 'Upload Aadhar'}
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="PAN Card"
                name="panCard"
              >
                {form.getFieldValue('panCard') && isEditMode ? (
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
                    {form.getFieldValue('panCard') && isEditMode ? 'Change PAN' : 'Upload PAN'}
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Password fields - only for new staff */}
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
