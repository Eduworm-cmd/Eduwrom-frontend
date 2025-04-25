import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Input,
  Form,
  Select,
  Slider,
  Card,
  Dropdown,
  Menu,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Badge,
  Modal
} from 'antd';
import {
  LeftOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  MoreOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  StopOutlined
} from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import { CreateGrade, DeactivateGrade, GetGradeById, GetLevels, UpdateGrade } from '@/Network/Super_Admin/auth';

const { Title, Text } = Typography;
const { Option } = Select;

const GradeManagement = () => {
  const [grades, setGrades] = useState([]);
  const [schools, setSchools] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('list'); // list, add, edit, view
  const [currentGradeId, setCurrentGradeId] = useState(null);
  const [form] = Form.useForm();

  // Fetch initial data
  useEffect(() => {
    fetchGrades();
    fetchSchools();
    fetchLevels();
  }, []);

  // Fetch grades from API
  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/grade', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setGrades(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setLoading(false);
    }
  };

  // Fetch schools from API with updated endpoint
  const fetchSchools = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/schooladmin-auth', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Map the response to match our expected format
      const mappedSchools = response.data.data.map(school => ({
        _id: school._id,
        name: school.schoolName // Adjust for different property name
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

      // Handle both object and string reference formats
      const schoolId = typeof grade.school === 'object' ? grade.school?._id : grade.school;
      const levelId = typeof grade.level === 'object' ? grade.level?._id : grade.level;

      // Set form data with all the necessary fields
      form.setFieldsValue({
        name: grade.name || '',
        type: grade.type || '',
        minAge: grade.minAge || 3,
        maxAge: grade.maxAge || 3,
        school: schoolId || '',
        level: levelId || ''
      });

      setLoading(false);
      return grade;
    } catch (error) {
      console.error('Error fetching grade:', error);
      setLoading(false);
      return null;
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset search filter
  const resetFilter = () => {
    setSearchTerm('');
  };

  // Navigate to add grade view
  const handleAddGrade = () => {
    form.resetFields();
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

  // Deactivate grade with confirmation modal
  const handleDeactivateGrade = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to deactivate this grade?</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '6px 12px' }}
              onClick={async () => {
                closeToast();
                try {
                  await DeactivateGrade({ id, isActive: false });
                  toast.success('Grade successfully');
                  await fetchGrades();
                } catch (error) {
                  console.error('Error deactivating grade:', error);
                }
              }}
            >
              Yes
            </button>
            <button
              style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '6px 12px' }}
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };


  // Navigate back to list view
  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentGradeId(null);
    form.resetFields();
  };

  // Submit form for create/update
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      if (currentView === 'add') {
        // Create new grade
        await CreateGrade(values);
        toast.success('Grade added successfully');
      } else if (currentView === 'edit') {
        // Update existing grade
        await UpdateGrade(currentGradeId, values);
        toast.success('Grade updated successfully');
      }

      // Refresh grades list and go back to list view
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

  // Table columns
  const columns = [
    {
      title: 'Sr.No',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: 'School Name',
      dataIndex: ['school', 'name'],
      key: 'schoolName',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Grade Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'No.of Classes',
      dataIndex: ['classes', 'length'],
      key: 'classes',
      render: (text) => text || 0,
    },
    {
      title: 'No.of Students',
      dataIndex: ['students', 'length'],
      key: 'students',
      render: (text) => text || 0,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <>
          {new Date(date).toLocaleDateString()},{' '}
          {new Date(date).toLocaleTimeString()}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      align: 'center',
      render: (isActive) => (
        <Badge
          status={isActive ? 'success' : 'error'}
          text=""
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" onClick={() => handleViewGrade(record._id)}>
                <EyeOutlined /> View
              </Menu.Item>
              <Menu.Item key="edit" onClick={() => handleEditGrade(record._id)}>
                <EditOutlined /> Edit
              </Menu.Item>
              <Menu.Item key="deactivate" onClick={() => handleDeactivateGrade(record._id)}>
                <StopOutlined /> Deactivate
              </Menu.Item>

            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Render list view
  const renderListView = () => {
  
    return (
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Title level={4}>Grade ({grades.length})</Title>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddGrade}
              >
                Add Grade
              </Button>
            </Space>
          </Row>

          <Row justify="space-between" align="middle">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: 250 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={resetFilter}
            >
              Reset Filter
            </Button>
          </Row>

          <Table
            rowSelection={{
              type: 'checkbox',
            }}
            columns={columns}
            dataSource={filteredGrades}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
            }}
          />
        </Space>
      </Card>
    );
  };

  // Render form view (used for both add and edit)
  const renderFormView = (title) => {
    return (
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space align="center">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={handleBackToList}
            />
            <Title level={4}>{title}</Title>
          </Space>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  className=''
                  rules={[{ required: true, message: 'Please enter a name' }]}
                >
                  <Input placeholder="Grade name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: 'Please select a type' }]}
                >
                  <Select placeholder="Select type">
                    <Option value="General">GENERAL</Option>
                    <Option value="Special">SPECIAL</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="minAge"
                  label="Min Age"
                  rules={[{ required: true, message: 'Please select minimum age' }]}
                >
                  <Slider
                    min={1}
                    max={18}
                    marks={{
                      1: '1',
                      9: '9',
                      18: '18'
                    }}
                    tooltip={{
                      formatter: (value) => `${value} years`
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="maxAge"
                  label="Max Age"
                  rules={[{ required: true, message: 'Please select maximum age' }]}
                >
                  <Slider
                    min={1}
                    max={18}
                    marks={{
                      1: '1',
                      9: '9',
                      18: '18'
                    }}
                    tooltip={{
                      formatter: (value) => `${value} years`
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="school"
                  label="School"
                  rules={[{ required: true, message: 'Please select a school' }]}
                >
                  <Select placeholder="Select school">
                    {schools.map(school => (
                      <Option key={school._id} value={school._id}>
                        {school.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="level"
                  label="Level"
                  rules={[{ required: true, message: 'Please select a level' }]}
                >
                  <Select placeholder="Select level">
                    {levels.map(level => (
                      <Option key={level._id} value={level._id}>
                        {level.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button onClick={handleBackToList}>
                  {currentView === 'add' ? 'Back' : 'Cancel'}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {currentView === 'add' ? 'Add' : 'Save'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    );
  };

  // Render detail view for viewing a grade
  const renderDetailView = () => {
    if (!currentGrade) {
      return (
        <Card>
          <div className="text-center py-8">
            Grade not found. <Button type="link" onClick={handleBackToList}>Back to list</Button>
          </div>
        </Card>
      );
    }

    return (
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Space align="center">
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={handleBackToList}
              />
              <Title level={4}>Grade Details</Title>
            </Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditGrade(currentGrade._id)}
            >
              Edit
            </Button>
          </Row>          
          <Card>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Text type="secondary">Name</Text>
                <div>
                  <Text strong>{currentGrade.name}</Text>
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Type</Text>
                <div>
                  <Text strong>{currentGrade.type}</Text>
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Age Range</Text>
                <div>
                  <Text strong>{currentGrade.minAge} - {currentGrade.maxAge} years</Text>
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">School</Text>
                <div>
                  <Text strong>{currentGrade.school?.name || 'N/A'}</Text>
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Level</Text>
                <div>
                  <Text strong>{currentGrade.level?.name || 'N/A'}</Text>
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Status</Text>
                <div>
                  <Space>
                    <Badge
                      status={currentGrade.isActive ? 'success' : 'error'}
                    />
                    <Text strong>{currentGrade.isActive ? 'Active' : 'Inactive'}</Text>
                  </Space>
                </div>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Text type="secondary">Created By</Text>
                <div>
                  <Text>{currentGrade.createdBy?.name || 'Unknown'} ({currentGrade.createdBy?.role || 'N/A'})</Text>
                  <div>
                    <Text type="secondary">
                      {new Date(currentGrade.createdAt).toLocaleDateString()},{' '}
                      {new Date(currentGrade.createdAt).toLocaleTimeString()}
                    </Text>
                  </div>
                </div>
              </Col>

              {currentGrade.updatedBy && (
                <Col span={12}>
                  <Text type="secondary">Last Updated By</Text>
                  <div>
                    <Text>{currentGrade.updatedBy?.name || 'Unknown'} ({currentGrade.updatedBy?.role || 'N/A'})</Text>
                    <div>
                      <Text type="secondary">
                        {new Date(currentGrade.updatedAt).toLocaleDateString()},{' '}
                        {new Date(currentGrade.updatedAt).toLocaleTimeString()}
                      </Text>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        </Space>
      </Card>
    );
  };

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

  return (
    <div className="p-4">
      <ToastContainer />
      {renderView()}
    </div>
  );
};

export default GradeManagement;