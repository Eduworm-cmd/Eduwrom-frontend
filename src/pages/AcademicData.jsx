import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Table,
  Button,
  Input,
  Form,
  Select,
  DatePicker,
  Space,
  Spin,
  Alert,
  Modal,
  Checkbox,
  Dropdown,
  Menu,
  Tooltip,
  Typography,
  Row,
  Col,
  Card,
  Divider
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
  LoadingOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

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
  const [form] = Form.useForm();

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
          
          form.setFieldsValue({
            name: data.name,
            startDate: moment(data.startDate),
            endDate: moment(data.endDate),
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
  }, [view, editItemId, form]);

  const handleAddAcademicYear = () => {
    form.resetFields();
    setView('add');
  };

  const handleEditAcademicYear = (year) => {
    setEditItemId(year._id);
    setView('edit');
  };

  const handleViewAcademicYear = (yearId) => {
    // Implement view functionality here if needed
    console.log("Viewing academic year:", yearId);
    // For now, we'll just log it
  };

  const handleCancel = () => {
    setView('list');
    setEditItemId(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    
    try {
      const formattedData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      };

      if (view === 'add') {
        await axios.post('http://localhost:4000/api/academic', formattedData);
      } else if (view === 'edit') {
        await axios.patch(`http://localhost:4000/api/academic/${editItemId}`, formattedData);
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
    Modal.confirm({
      title: 'Are you sure you want to deactivate this academic year?',
      onOk: async () => {
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
    });
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedSchool(null);
  };

  const handleSchoolChange = (value) => {
    setSelectedSchool(value);
    fetchBranches(value);
    form.setFieldsValue({ branchId: undefined });
  };

  // Filter academic years
  const filteredAcademicYears = academicYears?.filter(year => {
    return year.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (year.branchName && year.branchName.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Table columns
  const columns = [
    {
      title: 'Sr.No',
      key: 'index',
      width: 70,
      render: (_, __, index) => (currentPage - 1) * rowsPerPage + index + 1,
    },
    {
      title: 'Branch School Name',
      dataIndex: 'branchName',
      key: 'branchName',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Academic Year Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => format(new Date(date), 'dd/MM/yyyy'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => format(new Date(date), 'dd/MM/yyyy'),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => format(new Date(date), 'dd/MM/yyyy, h:mm:ss a'),
    },
    {
      title: 'View',
      key: 'view',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" onClick={() => handleViewAcademicYear(record._id)}>
                <EyeOutlined /> View
              </Menu.Item>
              <Menu.Item key="edit" onClick={() => handleEditAcademicYear(record)}>
                <EditOutlined /> Edit
              </Menu.Item>
              <Menu.Item key="deactivate" danger onClick={() => handleDeactivate(record._id)}>
                <DeleteOutlined /> Deactivate
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
    {
      title: 'Edit',
      key: 'edit',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => handleEditAcademicYear(record)}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 80,
      align: 'center',
      render: () => (
        <div className="flex justify-center">
          <div className="h-3 w-3 bg-green-500 rounded-full" />
        </div>
      ),
    },
  ];

  // Render Add/Edit form
  const renderForm = () => {
    return (
      <Card className="container mx-auto p-4">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space align="center">
            <Button 
              type="text" 
              icon={<LeftOutlined />} 
              onClick={handleCancel} 
            />
            <Title level={4}>
              {view === 'add' ? 'Add Academic Year' : 'Edit Academic Year'}
            </Title>
          </Space>
          
          {error && <Alert message={error} type="error" showIcon />}
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              schoolId: selectedSchool || '',
            }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter a name' }]}
                >
                  <Input placeholder="e.g., 2025-2026" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="schoolId"
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
              
              <Col span={12}>
                <Form.Item
                  name="branchId"
                  label="Branch"
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
                  name="startDate"
                  label="Start Date"
                  rules={[{ required: true, message: 'Please select a start date' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="YYYY-MM-DD" 
                  />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="End Date"
                  rules={[{ required: true, message: 'Please select an end date' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="YYYY-MM-DD" 
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Space>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
              >
                {view === 'add' ? 'Add' : 'Save'}
              </Button>
            </Space>
          </Form>
        </Space>
      </Card>
    );
  };

  // Render list view
  const renderList = () => {
    return (
      <Card className="container mx-auto p-4">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Title level={4}>Academic Year ({filteredAcademicYears?.length})</Title>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddAcademicYear}
              >
                Add Academic Year
              </Button>
              <Button>
                Deactivated
              </Button>
            </Space>
          </Row>
          
          {error && <Alert message={error} type="error" showIcon />}
          
          <Row justify="space-between" align="middle">
            <Input
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              style={{ width: 200 }}
            />
            
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleResetFilter}
            >
              Reset Filter
            </Button>
          </Row>
          
          <Table
            rowSelection={{
              type: 'checkbox',
            }}
            columns={columns}
            dataSource={filteredAcademicYears}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: rowsPerPage,
              total: filteredAcademicYears?.length,
              onChange: (page) => setCurrentPage(page),
              onShowSizeChange: (_, size) => {
                setRowsPerPage(size);
                setCurrentPage(1);
              },
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </Space>
      </Card>
    );
  };

  // Main render
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {view === 'list' && renderList()}
      {(view === 'add' || view === 'edit') && renderForm()}
    </div>
  );
};

export default AcademicYearManagement;