import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, Button, Input, Select, Form, DatePicker, Checkbox,
  Card, Space, Tag, Avatar, Typography, Modal, Tabs,
  Upload, Row, Col, Divider, Spin, message, Dropdown, Menu,
  Badge, Tooltip, Pagination,
  Alert
} from 'antd';
import {
  UserOutlined, PhoneOutlined, MailOutlined, EditOutlined,
  DeleteOutlined, SearchOutlined, PlusOutlined, FileOutlined,
  ExportOutlined, DownloadOutlined, LoginOutlined, IdcardOutlined,
  EyeOutlined, UserSwitchOutlined, MoreOutlined, UploadOutlined,
  SaveOutlined, RollbackOutlined, FilterOutlined, ClearOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { GetSchools } from '@/Network/Super_Admin/auth';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const [viewMode, setViewMode] = useState('table'); 
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const [filters, setFilters] = useState({
    grade: '',
    class: '',
    role: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [fileList, setFileList] = useState({
    photo: [],
    aadhaarCard: [],
    panCard: []
  });
  const fetchSchools = async () => {
    try {
      const response = await GetSchools();
      setSchools(response.data);
    } catch (err) {
      console.error('Failed to fetch schools:', err);
    }
  };
  useEffect(() => {
    fetchSchools();
  }, []);
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', pageSize);

      if (filters.grade) params.append('grade', filters.grade);
      if (filters.class) params.append('class', filters.class);
      if (filters.role) params.append('role', filters.role);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(`http://localhost:4000/api/staff?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setStaff(response.data.data);
      setTotalItems(response.data.count);
      setLoading(false);
      navigate('/eduworm-admin/staff');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff');
      setLoading(false);
      message.error('Failed to fetch staff data');
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [currentPage, pageSize]);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setFilters({
      grade: '',
      class: '',
      role: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    setTimeout(() => {
      fetchStaff();
    }, 0);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStaff();
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
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
  const handleEdit = (record) => {
    setSelectedStaff(record);

    // Set initial form values
    form.setFieldsValue({
      firstName: record.firstName,
      lastName: record.lastName,
      dateOfBirth: record.dateOfBirth ? moment(record.dateOfBirth) : null,
      phoneNumber: record.phoneNumber,
      emailIDOfficial: record.emailIDOfficial,
      gender: record.gender,
      employeeRole: record.employeeRole,
      school: record.school,
      branch: record.branch?._id || record.branch,
      employeeId: record.employeeId,
      title: record.title,
      emailIDPersonal: record.emailIDPersonal,
      bloodGroup: record.bloodGroup,
      maritalStatus: record.maritalStatus,
      marriageAnniversary: record.marriageAnniversary ? moment(record.marriageAnniversary) : null,
      department: record.department,
      subDepartment: record.subDepartment,
      emergencyContact: record.emergencyContact,
      nationality: record.nationality,
      religion: record.religion,
      fatherName: record.fatherName,
      currentAddress: record.currentAddress,
      permanentAddress: record.permanentAddress,
      // Bank Details
      'bankDetails.accountNumber': record.bankDetails?.accountNumber,
      'bankDetails.nameAsPerBank': record.bankDetails?.nameAsPerBank,
      'bankDetails.bankName': record.bankDetails?.bankName,
      'bankDetails.bankBranch': record.bankDetails?.bankBranch,
      'bankDetails.ifscCode': record.bankDetails?.ifscCode,
    });

    // Set file lists if available
    if (record.photoUrl) {
      setFileList(prev => ({
        ...prev,
        photo: [{
          uid: '-1',
          name: 'Current Photo',
          status: 'done',
          url: record.photoUrl,
        }]
      }));
    }

    if (record.aadhaarCardUrl) {
      setFileList(prev => ({
        ...prev,
        aadhaarCard: [{
          uid: '-1',
          name: 'Current Aadhaar Card',
          status: 'done',
          url: record.aadhaarCardUrl,
        }]
      }));
    }

    if (record.panCardUrl) {
      setFileList(prev => ({
        ...prev,
        panCard: [{
          uid: '-1',
          name: 'Current PAN Card',
          status: 'done',
          url: record.panCardUrl,
        }]
      }));
    }

    setViewMode('edit');
  };
  const handleSchoolChange = (value) => {
    setSelectedSchool(value);
    fetchBranches(value);
    form.setFieldsValue({ branchId: undefined });
  };
  const handleAdd = () => {
    form.resetFields();
    setSelectedStaff(null);
    setFileList({
      photo: [],
      aadhaarCard: [],
      panCard: []
    });
    setViewMode('create');
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      // Create a data object that will be sent directly as JSON
      const staffData = {
        // Basic info
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        phoneNumber: values.phoneNumber,
        emailIDOfficial: values.emailIDOfficial,
        gender: values.gender,
        employeeRole: values.employeeRole,
        school: values.school,
        branch: values.branch,
        title: values.title,
        emailIDPersonal: values.emailIDPersonal,

        // Additional info
        bloodGroup: values.bloodGroup,
        maritalStatus: values.maritalStatus,
        marriageAnniversary: values.marriageAnniversary ? values.marriageAnniversary.format('YYYY-MM-DD') : null,
        department: values.department,
        subDepartment: values.subDepartment,
        emergencyContact: values.emergencyContact,
        nationality: values.nationality,
        religion: values.religion,
        fatherName: values.fatherName,

        // Addresses
        currentAddress: values.currentAddress,
        permanentAddress: values.permanentAddress,

        // Bank details as an object
        bankDetails: {
          accountNumber: values['bankDetails.accountNumber'],
          nameAsPerBank: values['bankDetails.nameAsPerBank'],
          bankName: values['bankDetails.bankName'],
          bankBranch: values['bankDetails.bankBranch'],
          ifscCode: values['bankDetails.ifscCode']
        },

        // Base64 data for documents
        photoBase64: values.photoBase64,
        aadhaarCardBase64: values.aadhaarCardBase64,
        panCardBase64: values.panCardBase64
      };

      let response;

      // Remove null/undefined values to keep the request payload clean
      Object.keys(staffData).forEach(key => {
        if (staffData[key] === undefined || staffData[key] === null) {
          delete staffData[key];
        }
      });

      if (viewMode === 'edit' && selectedStaff) {
        // Update existing staff
        response = await axios.put(
          `http://localhost:4000/api/staff/${selectedStaff._id}`,
          staffData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        message.success('Staff updated successfully');
      } else {
        // Create new staff
        response = await axios.post(
          'http://localhost:4000/api/staff',
          staffData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        message.success('Staff added successfully');
      }

      setViewMode('table');
      fetchStaff();

    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || 'Operation failed');
      message.error('Operation failed: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = async ({ fileList }, type) => {
    setFileList(prev => ({
      ...prev,
      [type]: fileList
    }));

    // If there's a new file, convert it to base64
    if (fileList.length > 0 && fileList[0].originFileObj) {
      try {
        const base64Data = await getBase64(fileList[0].originFileObj);
        // Store base64 data in form
        form.setFieldsValue({
          [`${type}Base64`]: base64Data
        });
      } catch (error) {
        console.error(`Error converting ${type} to base64:`, error);
      }
    }
  };

  const handleBack = () => {
    setViewMode('table');
  };

  // Define columns for the table
  const columns = [
    {
      title: 'Sno',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.photoUrl}
            icon={!record.photoUrl && <UserOutlined />}
            size="large"
          >
            {!record.photoUrl && record.firstName?.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.firstName} {record.lastName}</Text>
            <div>
              <Text type="secondary">DOB: {record.dateOfBirth ? moment(record.dateOfBirth).format('DD/MM/YYYY') : 'N/A'}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email/Phone',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ marginLeft: '8px' }}>
          <Space>
            <PhoneOutlined />
            <Text>{record.phoneNumber || 'N/A'}</Text>
          </Space>
          <Space>
            <MailOutlined />
            <Text>{record.emailIDOfficial || 'N/A'}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'employeeRole',
      key: 'employeeRole',
      render: role => <Tag color={role === 'TEACHER' ? 'green' : 'blue'}>{role}</Tag>
    },
    {
      title: 'Classrooms',
      key: 'classrooms',
      render: (_, record) => (
        <Space size={[0, 8]} wrap>
          {record.classrooms?.length > 0 ?
            record.classrooms.map(classroom => (
              <Tag color="blue" key={classroom._id}>{classroom.name}</Tag>
            )) :
            <Text type="secondary">No classrooms</Text>
          }
        </Space>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Login',
      key: 'login',
      render: () => (
        <Tooltip title="Login as this user">
          <Button
            type="text"
            icon={<LoginOutlined />}
            shape="circle"
          />
        </Tooltip>
      ),
      width: 70,
    },
    {
      title: 'ID Card',
      key: 'idCard',
      render: () => (
        <Tooltip title="Download ID Card">
          <Button
            type="text"
            icon={<IdcardOutlined />}
            shape="circle"
          />
        </Tooltip>
      ),
      width: 70,
    },
    {
      title: 'Profile',
      key: 'profile',
      render: (_, record) => (
        <Tooltip title="View/Edit Profile">
          <Button
            type="text"
            icon={<EyeOutlined />}
            shape="circle"
            onClick={() => handleEdit(record)}
          />
        </Tooltip>
      ),
      width: 70,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" icon={<EditOutlined />}>Edit</Menu.Item>
                <Menu.Item key="2" icon={<UserSwitchOutlined />}>Change Status</Menu.Item>
                <Menu.Item key="3" icon={<DeleteOutlined />}>Deactivate</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
          <Badge status="success" />
        </Space>
      ),
      width: 100,
    },
  ];

  // Staff Data Table Component
  const StaffTable = () => (
    <Card bordered={false}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap:"295px", alignItems: 'center' }}>
          <Title level={4}>Staff Management ({totalItems})</Title>
          <Space>
            <Button icon={<DownloadOutlined />}>ID Card</Button>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Add Staff
            </Button>
          </Space>
        </div>

        <div style={{ display: 'flex', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <Select
            placeholder="Grade"
            style={{ width: 120 }}
            value={filters.grade || undefined}
            onChange={(value) => handleFilterChange('grade', value)}
            allowClear
          >
            <Option value="KG-1">KG-1</Option>
            <Option value="KG-2">KG-2</Option>
            <Option value="Nursery">Nursery</Option>
          </Select>

          <Select
            placeholder="Class"
            style={{ width: 120 }}
            value={filters.class || undefined}
            onChange={(value) => handleFilterChange('class', value)}
            allowClear
          >
            <Option value="All Classes">All Classes</Option>
            <Option value="Nursery">Nursery</Option>
          </Select>

          <Select
            placeholder="Role"
            style={{ width: 150 }}
            value={filters.role || undefined}
            onChange={(value) => handleFilterChange('role', value)}
            allowClear
          >
            <Option value="BRANCH_ADMIN">BRANCH_ADMIN</Option>
            <Option value="TEACHER">TEACHER</Option>
          </Select>

          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            style={{ width: 200 }}
            suffix={<SearchOutlined />}
            onPressEnter={handleSearch}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button
            icon={<ClearOutlined />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={staff}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Space>
    </Card>
  );

  // Staff Form Component (Create/Edit)
  const StaffForm = () => (
    <Card bordered={false}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>{viewMode === 'edit' ? 'Edit Staff Information' : 'Add Staff Information'}</Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            gender: '',
            employeeRole: '',
            school: '',
            branch: '',
            bloodGroup: '',
            maritalStatus: '',
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Basic Information" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter first name' }]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input
                      addonBefore={
                        <Select defaultValue="+91" style={{ width: 80 }}>
                          <Option value="+91">+91</Option>
                        </Select>
                      }
                      placeholder="Phone Number"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="emailIDOfficial"
                    label="Email ID (Official)"
                    rules={[
                      { required: true, message: 'Please enter official email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input placeholder="Official Email Address" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Please select gender' }]}
                  >
                    <Select placeholder="Select Gender">
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="employeeRole"
                    label="Employee Role"
                    rules={[{ required: true, message: 'Please select role' }]}
                  >
                    <Select placeholder="Select Role">
                      <Option value="BRANCH_ADMIN">BRANCH_ADMIN</Option>
                      <Option value="TEACHER">TEACHER</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="school"
                    label="School"
                  >
                    <Select
                      placeholder="Select School"
                      onChange={handleSchoolChange}
                      allowClear
                    >
                      {schools.map(school => (
                        <Option key={school._id} value={school._id}>
                          {school.schoolName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="branch"
                    label="branch"
                    rules={[{ required: true, message: 'Please select a branch' }]}
                  >
                    <Select
                      placeholder="Select Branch"
                      allowClear
                    >
                      {branches?.map(branch => (
                        <Option key={branch._id} value={branch._id}>
                          {branch.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="employeeId"
                    label="Employee ID"
                  >
                    <Input placeholder="Employee ID" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Additional Information" key="2">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="Title"
                  >
                    <Input placeholder="Title" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="emailIDPersonal"
                    label="Email ID (Personal)"
                    rules={[
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input placeholder="Personal Email Address" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="bloodGroup"
                    label="Blood Group"
                  >
                    <Select placeholder="Select Blood Group">
                      <Option value="A+">A+</Option>
                      <Option value="A-">A-</Option>
                      <Option value="B+">B+</Option>
                      <Option value="B-">B-</Option>
                      <Option value="AB+">AB+</Option>
                      <Option value="AB-">AB-</Option>
                      <Option value="O+">O+</Option>
                      <Option value="O-">O-</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maritalStatus"
                    label="Marital Status"
                  >
                    <Select placeholder="Select Marital Status">
                      <Option value="Single">Single</Option>
                      <Option value="Married">Married</Option>
                      <Option value="Divorced">Divorced</Option>
                      <Option value="Widowed">Widowed</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {form.getFieldValue('maritalStatus') === 'Married' && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="marriageAnniversary"
                      label="Marriage Anniversary"
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="department"
                    label="Department"
                  >
                    <Input placeholder="Department" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="subDepartment"
                    label="Sub Department"
                  >
                    <Input placeholder="Sub Department" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="emergencyContact"
                    label="Emergency Contact"
                  >
                    <Input placeholder="Emergency Contact Number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="nationality"
                    label="Nationality"
                  >
                    <Input placeholder="Nationality" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="religion"
                    label="Religion"
                  >
                    <Input placeholder="Religion" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="fatherName"
                    label="Father's Name"
                  >
                    <Input placeholder="Father's Name" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Bank Details" key="3">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="bankDetails.accountNumber"
                    label="Account Number"
                  >
                    <Input placeholder="Account Number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="bankDetails.nameAsPerBank"
                    label="Name As Per Bank"
                  >
                    <Input placeholder="Name As Per Bank" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="bankDetails.bankName"
                    label="Bank Name"
                  >
                    <Input placeholder="Bank Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="bankDetails.bankBranch"
                    label="Bank Branch"
                  >
                    <Input placeholder="Bank Branch" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="bankDetails.ifscCode"
                    label="IFSC Code"
                  >
                    <Input placeholder="IFSC Code" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Address" key="4">
              <Form.Item
                name="currentAddress"
                label="Current Address"
              >
                <Input.TextArea rows={4} placeholder="Current Address" />
              </Form.Item>

              <Form.Item
                name="permanentAddress"
                label="Permanent Address"
              >
                <Input.TextArea rows={4} placeholder="Permanent Address" />
              </Form.Item>
            </TabPane>

            <TabPane tab="Documents" key="5">
              <Form.Item
                name="photo"
                label="Photo"
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList.photo}
                  beforeUpload={() => false}
                  onChange={(info) => handleUploadChange(info, 'photo')}
                  maxCount={1}
                >
                  {fileList.photo.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                name="aadhaarCard"
                label="Aadhaar Card"
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList.aadhaarCard}
                  beforeUpload={() => false}
                  onChange={(info) => handleUploadChange(info, 'aadhaarCard')}
                  maxCount={1}
                >
                  {fileList.aadhaarCard.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                name="panCard"
                label="PAN Card"
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList.panCard}
                  beforeUpload={() => false}
                  onChange={(info) => handleUploadChange(info, 'panCard')}
                  maxCount={1}
                >
                  {fileList.panCard.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </TabPane>
          </Tabs>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                {viewMode === 'edit' ? 'Update Staff' : 'Add Staff'}
              </Button>
              <Button icon={<RollbackOutlined />} onClick={handleBack}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
          <Form.Item name="photoBase64" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name="aadhaarCardBase64" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name="panCardBase64" hidden={true}>
            <Input />
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );

  return (
    <div className="staff-management-container">
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {viewMode === 'table' ? <StaffTable /> : <StaffForm />}
    </div>
  );
};

export default StaffManagement;