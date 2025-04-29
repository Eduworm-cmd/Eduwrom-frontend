import React, { useEffect, useState } from 'react';
import {
    Table, Button, Input, Select, DatePicker, TimePicker,
    Modal, Card, Tabs, Badge, Form, Row, Col,
    Upload
} from 'antd';
import {
    SearchOutlined, FilterOutlined, ReloadOutlined,
    BookOutlined, UserOutlined,
    FileAddOutlined,
    UploadOutlined,

} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Gamepad } from 'lucide-react';
import { AddContent, GetGrades } from '@/Network/Super_Admin/auth';
import { toast, ToastContainer } from 'react-toastify';
import { isSuperAdmin } from '@/auth/Proctected';

const { TabPane } = Tabs;
const { Option } = Select;

// Dummy data for the content table
const contentData = [
    {
        key: '1',
        id: 'G-10339',
        type: 'Game',
        title: 'स्वर - अं',
        domain: 'Language',
        subdomain: 'Hindi',
        preview: '/api/placeholder/50/50',
        learningObjective: 'To be able to identify the hindi swars and their corresponding sounds',
        description: 'This interactive game helps students learn Hindi vowel sounds through engaging activities. Students match sounds with visual representations and practice pronunciation in a fun environment.'
    },
    {
        key: '2',
        id: 'G-11480',
        type: 'Game',
        title: 'ડાર્થની છાપ',
        domain: 'Language',
        subdomain: 'Gujarati',
        preview: '/api/placeholder/50/50',
        learningObjective: 'Demo games with Gujarati introductions (N2355)',
        description: 'Introduction to Gujarati alphabet through interactive gameplay. Students can learn basic Gujarati characters and sounds through visual and audio cues.'
    },

    {
        key: '4',
        id: 'G-9935',
        type: 'Game',
        title: 'Letters and sounds Ff',
        domain: 'Language',
        subdomain: 'Letters and Sounds',
        preview: '/api/placeholder/50/50',
        learningObjective: 'to be able to identify, form and trace the letter \'Ff\'',
        description: 'Students learn to recognize, pronounce and write the letter F through interactive activities including letter recognition, sound association, and handwriting practice.'
    },
    {
        key: '5',
        id: 'G-7613',
        type: 'Game',
        title: 'Before numbers 1 to 10',
        domain: 'Language',
        subdomain: 'Phonics',
        preview: '/api/placeholder/50/50',
        learningObjective: 'Match the letter to the corresponding object/picture',
        description: 'This activity helps students understand number sequencing by identifying what comes before numbers 1-10, building foundational math concepts through interactive exercises.'
    },
    {
        key: '6',
        id: 'G-5322',
        type: 'Game',
        title: 'Recap letters',
        domain: 'Motor Skills',
        subdomain: 'Fine motor skills',
        preview: '/api/placeholder/50/50',
        learningObjective: 'Not Available (N1695)',
        description: 'A comprehensive review game that helps students practice all previously learned letters through various activities including tracing, matching, and sound recognition.'
    },
];

// Dummy data for classrooms
const classroomData = [
    {
        key: '1',
        srNo: '1',
        className: 'Class 1-A',
        grade: 'Grade 1',
        teacherName: 'Ms. Sarah Johnson',
        numberOfStudents: 30
    },
    {
        key: '2',
        srNo: '2',
        className: 'Class 2-B',
        grade: 'Grade 2',
        teacherName: 'Mr. Robert Adams',
        numberOfStudents: 28
    },
    {
        key: '3',
        srNo: '3',
        className: 'Class 3-C',
        grade: 'Grade 3',
        teacherName: 'Mrs. Elizabeth Chen',
        numberOfStudents: 25
    }
];

// Dummy data for students
const studentData = [
    {
        key: '1',
        id: '1',
        name: 'Aiden Smith',
        academicYear: '2025-2026',
        grade: 'Grade 1',
        class: 'Class 1-A'
    },
    {
        key: '2',
        id: '2',
        name: 'Olivia Johnson',
        academicYear: '2025-2026',
        grade: 'Grade 2',
        class: 'Class 2-B'
    },
    {
        key: '3',
        id: '3',
        name: 'Ethan Williams',
        academicYear: '2025-2026',
        grade: 'Grade 3',
        class: 'Class 3-C'
    }
];

const ContentManagement = () => {
    // State variables
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [grade, setGrade] = useState();
    const [addcontentVisible, setAddContentVisible] = useState(false);
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [assignType, setAssignType] = useState('');
    const [assignFilteredInfo, setAssignFilteredInfo] = useState({});
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [currentTime, setCurrentTime] = useState(dayjs('01:50:00', 'HH:mm:ss'));
    const [activeTab, setActiveTab] = useState('1');
    const [image, setImage] = useState(null);
    const [form] = Form.useForm();

    // Domain counts
    const domainCounts = {
        Numeracy: 862,
        Language: 1312,
        'General Awareness': 753,
        'Motor Skills': 1147,
        'Creative Expression': 18,
        'Social-Emotional': 38
    };

    // Toggle row expansion
    const handleExpand = (expanded, record) => {
        setExpandedRowKeys(expanded ? [record.key] : []);
    };

    // Handle row selection
    const onSelectChange = (selectedKeys) => {
        setSelectedRowKeys(selectedKeys);
    };

    // Open assignment modal
    const openAssignModal = (type) => {
        setAssignType(type);
        setAssignModalVisible(true);
        setActiveTab('1');
    };

    const openContentModel = () => {
        setAddContentVisible(true)
    }

    // Reset filters
    const resetFilters = () => {
        setAssignFilteredInfo({});
    };

    // Content table columns
    const contentColumns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (
                record.type === 'Game' ? <Gamepad className="text-purple-700 text-lg" /> : <BookOutlined className="text-blue-600 text-lg" />
            ),
            width: 80
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-gray-500 text-xs">{record.id}</div>
                </div>
            ),
            width: 200
        },
        {
            title: 'Preview',
            dataIndex: 'preview',
            key: 'preview',
            render: (src) => <img src={src} alt="Preview" className="w-10 h-10 object-cover rounded" />,
            width: 100
        },
        {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
            width: 150
        },
        {
            title: 'Subdomain',
            dataIndex: 'subdomain',
            key: 'subdomain',
            width: 180
        },
        {
            title: 'Learning Objective',
            dataIndex: 'learningObjective',
            key: 'learningObjective',
            ellipsis: true,
            width: 300
        }
    ];

    // Classroom table columns for assignment
    const classroomColumns = [
        {
            title: 'Sr.No',
            dataIndex: 'srNo',
            key: 'srNo',
            width: 80
        },
        {
            title: 'Class Name',
            dataIndex: 'className',
            key: 'className',
            width: 200
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            width: 150
        },
        {
            title: 'Teacher Name',
            dataIndex: 'teacherName',
            key: 'teacherName',
            width: 200
        },
        {
            title: 'No. of Students',
            dataIndex: 'numberOfStudents',
            key: 'numberOfStudents',
            width: 150
        }
    ];

    // Student table columns for assignment
    const studentColumns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 50
        },
        {
            title: 'Student Details',
            dataIndex: 'name',
            key: 'name',
            width: 250
        },
        {
            title: 'Academic Year',
            dataIndex: 'academicYear',
            key: 'academicYear',
            width: 150
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            width: 100
        },
        {
            title: 'Class',
            dataIndex: 'class',
            key: 'class',
            width: 100
        }
    ];

    const getTypeIcon = (domain) => {
        switch (domain) {
            case 'Numeracy': return <span className="text-blue-500">N</span>;
            case 'Language': return <span className="text-pink-500">L</span>;
            case 'General Awareness': return <span className="text-gray-500">GA</span>;
            case 'Motor Skills': return <span className="text-yellow-500">MS</span>;
            case 'Creative Expression': return <span className="text-green-500">CE</span>;
            case 'Social-Emotional': return <span className="text-purple-500">SE</span>;
            default: return <span>?</span>;
        }
    };



    const handleImageUpload = (e) => {
        const file = e.file;
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                setImage(base64String);
            };
        }
        return false;
    };

    // Add Content API Here 
    const handleAddContent = async () => {
        try {
            const values = await form.validateFields();

            const formData = {
                ...values,
                previewImageBuffer: image,
            };

            const response = await AddContent(formData);
            if (response) {
                toast.success("Content Added Successfully");
            }
            setAddContentVisible(false);
            form.resetFields();

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchGrades = async () => {
            const response = await GetGrades();
            setGrade(response.data)
        }

        fetchGrades();
    }, [])

    return (
        <div className="bg-gray-50 min-h-screen">
            <ToastContainer />
            <Card className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold text-gray-700">Content</h1>
                    <div>
                        {
                            isSuperAdmin() && (
                                <Button
                                    type="primary"
                                    icon={<FileAddOutlined />}
                                    className="mr-2 bg-blue-500"
                                    onClick={openContentModel}
                                >
                                    Add Content
                                </Button>
                            )
                        }
                        <Button
                            type="primary"
                            icon={<BookOutlined />}
                            className="mr-2 bg-blue-500"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => openAssignModal('class')}
                        >
                            Assign to Class
                        </Button>
                        <Button
                            type="primary"
                            icon={<UserOutlined />}
                            className="bg-blue-500"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => openAssignModal('student')}
                        >
                            Assign to Student
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                    {Object.entries(domainCounts).map(([domain, count]) => (
                        <Badge
                            key={domain}
                            count={count}
                            className="cursor-pointer"
                            style={{
                                backgroundColor: domain === 'Numeracy' ? '#0ea5e9' :
                                    domain === 'Language' ? '#ec4899' :
                                        domain === 'General Awareness' ? '#9ca3af' :
                                            domain === 'Motor Skills' ? '#eab308' :
                                                domain === 'Creative Expression' ? '#22c55e' :
                                                    '#a855f7'
                            }}
                        >
                            <div className="flex items-center px-3 py-2 bg-white rounded-md border">
                                {getTypeIcon(domain)}
                                <span className="ml-2 text-gray-700">{domain}</span>
                            </div>
                        </Badge>
                    ))}
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={resetFilters}
                        className="ml-auto"
                    >
                        Reset Filter
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <Input
                        placeholder="Search With Title"
                        prefix={<SearchOutlined className="text-gray-400" />}
                    />
                    <Select placeholder="Type" allowClear>
                        <Option value="game">Game</Option>
                        <Option value="book">Book</Option>
                        <Option value="video">Video</Option>
                    </Select>
                    <Input placeholder="Content ID" />
                    <Select placeholder="Grade" allowClear>
                        <Option value="grade1">Grade 1</Option>
                        <Option value="grade2">Grade 2</Option>
                        <Option value="grade3">Grade 3</Option>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Select placeholder="Domain" allowClear>
                        <Option value="language">Language</Option>
                        <Option value="numeracy">Numeracy</Option>
                        <Option value="motorSkills">Motor Skills</Option>
                        <Option value="generalAwareness">General Awareness</Option>
                    </Select>
                    <Select placeholder="Subdomain" allowClear>
                        <Option value="hindi">Hindi</Option>
                        <Option value="gujarati">Gujarati</Option>
                        <Option value="phonics">Phonics</Option>
                        <Option value="spaceExplorer">Space Explorer</Option>
                    </Select>
                    <Select placeholder="Learning Objective" allowClear>
                        <Option value="identify">Identify letters</Option>
                        <Option value="match">Match objects</Option>
                        <Option value="learn">Learn facts</Option>
                    </Select>
                </div>

                <Table
                    dataSource={contentData}
                    columns={contentColumns}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: onSelectChange,
                    }}
                    expandable={{
                        expandedRowKeys,
                        onExpand: handleExpand,
                        expandedRowRender: (record) => (
                            <p className="p-4 bg-gray-50 rounded">{record.description}</p>
                        ),
                    }}
                    pagination={{
                        position: ['bottomRight'],
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                        pageSize: 10
                    }}
                    size="middle"
                    className="content-table"
                />
            </Card>

            {/* Assignment Modal */}
            <Modal
                title={assignType === 'class' ? "Assign To Classrooms" : "Assign To Students"}
                open={assignModalVisible}
                onCancel={() => setAssignModalVisible(false)}
                width={900}
                footer={[
                    <Button key="back" onClick={() => setAssignModalVisible(false)}>
                        Back
                    </Button>,
                    <Button key="submit" type="primary" className="bg-green-500">
                        Confirm
                    </Button>,
                ]}
            >
                <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Date:</label>
                            <DatePicker
                                value={currentDate}
                                onChange={setCurrentDate}
                                format="DD/MM/YYYY"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Time:</label>
                            <TimePicker
                                value={currentTime}
                                onChange={setCurrentTime}
                                format="hh:mm A"
                                use12Hours
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mb-4">
                    <Select defaultValue="2025-2026" style={{ width: 150 }}>
                        <Option value="2025-2026">2025-2026</Option>
                        <Option value="2024-2025">2024-2025</Option>
                    </Select>

                    <Select placeholder="Grade" style={{ width: 150 }}>
                        <Option value="grade1">Grade 1</Option>
                        <Option value="grade2">Grade 2</Option>
                        <Option value="grade3">Grade 3</Option>
                    </Select>

                    {assignType === 'student' && (
                        <Select placeholder="Class" style={{ width: 150 }}>
                            <Option value="class1a">Class 1-A</Option>
                            <Option value="class2b">Class 2-B</Option>
                            <Option value="class3c">Class 3-C</Option>
                        </Select>
                    )}

                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                    />

                    <Button icon={<FilterOutlined />} onClick={resetFilters}>
                        Reset Filter
                    </Button>
                </div>

                {assignType === 'class' ? (
                    <Table
                        dataSource={classroomData}
                        columns={classroomColumns}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: ['1'],
                        }}
                        pagination={{
                            position: ['bottomRight'],
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                            pageSize: 10
                        }}
                        size="middle"
                    />
                ) : (
                    <Table
                        dataSource={studentData}
                        columns={studentColumns}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: ['1'],
                        }}
                        pagination={{
                            position: ['bottomRight'],
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                            pageSize: 10
                        }}
                        size="middle"
                    />
                )}
            </Modal>


            {/* Add Content Model */}
            <Modal
                title="Add Content"
                open={addcontentVisible}
                onCancel={() => setAddContentVisible(false)}
                width={900}
                footer={[
                    <Button key="back" onClick={() => setAddContentVisible(false)}>
                        Back
                    </Button>,
                    <Button key="submit" type="primary" className="bg-sky-600" onClick={handleAddContent}>
                        Confirm
                    </Button>
                ]}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Content Type"
                                name="contentType"
                                rules={[{ required: true, message: 'Please select a content type' }]}
                            >
                                <Select placeholder="Select content type">
                                    <Option value="video">Video</Option>
                                    <Option value="game">Game</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: 'Please enter the title' }]}
                            >
                                <Input placeholder="Enter content title" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Domain"
                                name="domain"
                                rules={[{ required: true, message: 'Please enter the domain' }]}
                            >
                                <Input placeholder="Enter domain" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Subdomain"
                                name="subdomain"
                                rules={[{ required: true, message: 'Please enter the subdomain' }]}
                            >
                                <Input placeholder="Enter subdomain" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="grade"
                                label="Grade"
                                rules={[{ required: true, message: 'Please select a grade' }]}
                            >
                                <Select placeholder="Select grade" showSearch optionFilterProp="children">
                                    {grade?.map((g) => (
                                        <Option key={g._id} value={g._id}>
                                            {g.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Learning Objective"
                                name="learningObjective"
                                rules={[{ required: true, message: 'Please enter a learning objective' }]}
                            >
                                <Input placeholder="Enter learning objective" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Redirect Link"
                                name="redirectLink"
                                rules={[
                                    { required: true, message: 'Please enter a redirect link' },
                                    { type: 'url', message: 'Enter a valid URL (e.g., https://example.com)' }
                                ]}
                            >
                                <Input placeholder="https://example.com/..." />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Preview Image"
                                name="previewImageBuffer"
                                rules={[{ required: true, message: 'Please upload a preview image' }]}
                                valuePropName="file"
                            >
                                <Upload
                                    beforeUpload={handleImageUpload}
                                    showUploadList={false}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        </div>
    );
}

export default ContentManagement;