import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  Button, 
  Form, 
  Input, 
  Select, 
  Modal, 
  Space, 
  Card, 
  Row, 
  Col, 
  Badge, 
  Typography, 
  Divider,
  Tooltip,
  Popconfirm,
  message
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const ClassManagement = () => {
  const [form] = Form.useForm();
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    academicYear: '',
    grade: '',
    search: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchClasses();
    fetchSchools();
    fetchAcademicYears();
    fetchGrades();
    fetchTeachers();
  }, []);

  // Fetch classes API
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/class');
      const data = response.data.data;
      setClasses(data);
      setPagination({
        ...pagination,
        total: data.length
      });
    } catch (error) {
      message.error('Failed to fetch classes');
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schools API
  const fetchSchools = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/schooladmin-auth');
      setSchools(response.data.data);
    } catch (error) {
      message.error('Failed to fetch schools');
      console.error('Error fetching schools:', error);
    }
  };

  // Fetch branches based on selected school
  const fetchBranches = async (schoolId) => {
    if (!schoolId) {
      setBranches([]);
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:4000/api/branches/forschool`, {
        params: { schoolId }
      });
      setBranches(response.data.data);
    } catch (error) {
      message.error('Failed to fetch branches');
      console.error('Error fetching branches:', error);
    }
  };

  // Fetch academic years API
  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/academic');
      setAcademicYears(response.data.data);
    } catch (error) {
      message.error('Failed to fetch academic years');
      console.error('Error fetching academic years:', error);
    }
  };

  // Fetch grades API
  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/grade');
      setGrades(response.data.data);
    } catch (error) {
      message.error('Failed to fetch grades');
      console.error('Error fetching grades:', error);
    }
  };

  // Fetch teachers API
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/staff');
      setTeachers(response.data.data);
    } catch (error) {
      message.error('Failed to fetch teachers');
      console.error('Error fetching teachers:', error);
    }
  };

  // Handle school change to fetch branches
  const handleSchoolChange = (value) => {
    form.setFieldsValue({ branch: undefined });
    fetchBranches(value);
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      
      if (isEditing) {
        // Update existing class
        await axios.put(`http://localhost:4000/api/class/${editingId}`, values);
        message.success('Class updated successfully');
      } else {
        // Create new class
        await axios.post('http://localhost:4000/api/class', values);
        message.success('Class created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchClasses();
    } catch (error) {
      if (error.errorFields) {
        message.error('Please check form fields');
      } else {
        message.error('Failed to save class');
        console.error('Error saving class:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show add modal
  const showAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Show edit modal
  const showEditModal = (record) => {
    setIsEditing(true);
    setEditingId(record._id);
    
    // Fetch branches for the selected school
    fetchBranches(record.school);
    
    // Set form values
    form.setFieldsValue({
      name: record.name,
      school: record.school,
      branch: record.branch,
      grade: record.grade,
      academicYear: record.academicYear,
      teacher: record.teacher
    });
    
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
    
    // Reset to first page when filter changes
    setPagination({
      ...pagination,
      current: 1
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      academicYear: '',
      grade: '',
      search: ''
    });
  };

  // Apply filters to data
  const getFilteredData = () => {
    return classes.filter(item => {
      const matchAcademicYear = !filters.academicYear || item.academicYear === filters.academicYear;
      const matchGrade = !filters.grade || item.grade === filters.grade;
      const matchSearch = !filters.search || 
        item.name.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchAcademicYear && matchGrade && matchSearch;
    });
  };

  // Handle row selection
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // Table row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Helper functions to get names from IDs
  const getSchoolName = (id) => {
    const school = schools.find(s => s._id === id);
    return school ? school.name : '';
  };

  const getBranchName = (id) => {
    const branch = branches.find(b => b._id === id);
    return branch ? branch.name : '';
  };

  const getGradeName = (id) => {
    const grade = grades.find(g => g._id === id);
    return grade ? grade.name : '';
  };

  const getTeacherName = (id) => {
    const teacher = teachers.find(t => t._id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName || ''}` : '';
  };

  const getAcademicYearName = (id) => {
    const year = academicYears.find(y => y._id === id);
    return year ? year.name : '';
  };

  // Table columns
  const columns = [
    {
      title: 'Sr.No',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      render: (_, __, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      render: (branchId) => getBranchName(branchId)
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (gradeId) => getGradeName(gradeId)
    },
    {
      title: 'Teacher Name',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacherId) => getTeacherName(teacherId)
    },
    {
      title: 'Student Count',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count) => count || 0
    },
    {
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
      render: (yearId) => getAcademicYearName(yearId)
    },
    {
      title: 'View',
      key: 'view',
      width: 80,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button type="text" icon={<EyeOutlined />} />
        </Tooltip>
      ),
    },
    {
      title: 'Edit',
      key: 'edit',
      width: 80,
      render: (_, record) => (
        <Tooltip title="Edit">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)} 
          />
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Badge 
          status={record.status === 'active' ? 'success' : 'error'} 
          text={record.status === 'active' ? 'Active' : 'Inactive'} 
        />
      ),
    },
  ];

  const filteredData = getFilteredData();

  return (
    <div>
      <Card>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={4}>Class ({classes.length})</Title>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showAddModal}
            >
              Add Class
            </Button>
            <Button>
              Deactivated
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6} lg={5}>
            <Select
              placeholder="Academic Year"
              style={{ width: '100%' }}
              value={filters.academicYear || undefined}
              onChange={(value) => handleFilterChange('academicYear', value)}
              allowClear
            >
              {academicYears.map(year => (
                <Option key={year._id} value={year._id}>{year.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={5}>
            <Select
              placeholder="Grade"
              style={{ width: '100%' }}
              value={filters.grade || undefined}
              onChange={(value) => handleFilterChange('grade', value)}
              allowClear
            >
              {grades.map(grade => (
                <Option key={grade._id} value={grade._id}>{grade.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={16} md={8} lg={10}>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={4} lg={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={resetFilters}
            >
              Reset Filter
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData.map(item => ({ ...item, key: item._id }))}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize
              });
            }
          }}
        />
      </Card>

      {/* Add/Edit Class Modal */}
      <Modal
        title={isEditing ? "Edit Class" : "Add Class"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter class name' }]}
              >
                <Input placeholder="Enter class name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="school"
                label="School"
                rules={[{ required: true, message: 'Please select school' }]}
              >
                <Select
                  placeholder="Select school"
                  onChange={handleSchoolChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {schools.map(school => (
                    <Option key={school._id} value={school._id}>{school.schoolName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="branch"
                label="Branch"
                rules={[{ required: true, message: 'Please select branch' }]}
              >
                <Select
                  placeholder="Select branch"
                  showSearch
                  optionFilterProp="children"
                  disabled={!form.getFieldValue('school')}
                >
                  {branches.map(branch => (
                    <Option key={branch._id} value={branch._id}>{branch.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="grade"
                label="Grade"
                rules={[{ required: true, message: 'Please select grade' }]}
              >
                <Select
                  placeholder="Select grade"
                  showSearch
                  optionFilterProp="children"
                >
                  {grades.map(grade => (
                    <Option key={grade._id} value={grade._id}>{grade.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="academicYear"
                label="Academic Year"
                rules={[{ required: true, message: 'Please select academic year' }]}
              >
                <Select
                  placeholder="Select academic year"
                  showSearch
                  optionFilterProp="children"
                >
                  {academicYears.map(year => (
                    <Option key={year._id} value={year._id}>{year.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teacher"
                label="Teacher"
              >
                <Select
                  placeholder="Select teacher"
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {teachers.map(teacher => (
                    <Option key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName || ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassManagement;