import React, { useState } from 'react';
import {
  Table, Button, Input, Select, Space, Card, Typography,
  Badge, Checkbox, Breadcrumb, Row, Col,
  Modal,
  Form,
  Upload
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  FileAddOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { isSuperAdmin } from '@/auth/Proctected';

const { Title } = Typography;
const { Option } = Select;

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [addplaylistvisible, setAddPlaylistVisible] = useState(false);
  const [currentView, setCurrentView] = useState('playlist');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [form] = Form.useForm();
  // Mock data for playlists
  const playlistData = [
    {
      key: '1',
      title: 'Animals of World',
      id: 'P-2090',
      description: 'Learn about animals',
      activityCount: 5,
      status: 'active',
    },
    {
      key: '2',
      title: 'Demo Playlist',
      id: 'P-2175',
      description: 'Demo',
      activityCount: 26,
      status: 'active',
    },
    {
      key: '3',
      title: 'Earth Facts',
      id: 'P-2088',
      description: 'Learn about earth',
      activityCount: 3,
      status: 'active',
    },
    {
      key: '4',
      title: "Guransh's Playlist",
      id: 'P-2618',
      description: 'This playlist has all my counselling activities.',
      activityCount: 5,
      status: 'active',
    },
    {
      key: '5',
      title: 'Letter A to F',
      id: 'P-2623',
      description: 'A to F',
      activityCount: 4,
      status: 'active',
    },
    {
      key: '6',
      title: 'Logic time',
      id: 'P-2087',
      description: 'This is logic test',
      activityCount: 3,
      status: 'active',
    },
    {
      key: '7',
      title: 'Modes of transport',
      id: 'P-2617',
      description: 'Unit 1',
      activityCount: 3,
      status: 'active',
    },
  ];

  // Mock data for playlist details (Animals of World)
  const animalsOfWorldDetails = [
    {
      key: '1',
      type: 'game',
      title: 'Aquatic Animals',
      id: 'G-7326',
      domain: 'General Awareness',
      subdomain: 'Under the sea',
      learningObjective: 'identify and classify sea animals (N1291)',
    },
    {
      key: '2',
      type: 'video',
      title: 'Introduction of aquatic animal',
      id: 'V-7835',
      domain: 'Motor Skills',
      subdomain: 'Fine motor skills',
      learningObjective: 'Not Available (N1605)',
    },
    {
      key: '3',
      type: 'game',
      title: 'Wild Animals',
      id: 'G-7320',
      domain: 'General Awareness',
      subdomain: 'Life Science: Animals',
      learningObjective: 'To be able to identify and name Wild animals (N12032)',
    },
    {
      key: '4',
      type: 'game',
      title: 'Farm Animals',
      id: 'G-7256',
      domain: 'General Awareness',
      subdomain: 'Life Science: Animals',
      learningObjective: 'To be able to identify and name domestic animals (N12022)',
    },
    {
      key: '5',
      type: 'game',
      title: 'Farm Animals',
      id: 'G-7324',
      domain: 'General Awareness',
      subdomain: 'Life Science: Animals',
      learningObjective: 'To be able to identify and name domestic animals (N12022)',
    },
  ];

   // Handle row selection
   const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
};

  const handleViewPlaylist = (record) => {
    setSelectedPlaylist(record);
    setCurrentView('details');
  };

  const playlistColumns = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: () => <Checkbox />,
    },
    {
      title: 'Title Of Playlist',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div className="text-purple-800 font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.id}</div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Activity Count',
      dataIndex: 'activityCount',
      key: 'activityCount',
      align: 'center',
      render: (count, record) => (
        <Space>
          <span>{count}</span>
          <Button
            type="text"
            icon={<EyeOutlined className="text-gray-600 hover:text-purple-800" />}
            onClick={() => handleViewPlaylist(record)}
            className="flex items-center justify-center"
          />
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: () => <Badge color="green" />,
    },
  ];

  const detailColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type) => (
        <div className="text-center text-xl">
          {type === 'game' ? '🎮' : type === 'video' ? '📹' : '📄'}
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div className="text-purple-800 font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.id}</div>
        </div>
      ),
    },
    {
      title: 'Preview',
      dataIndex: 'preview',
      key: 'preview',
      width: 100,
      render: (_, record) => (
        <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">
          {record.type === 'game' ? '🎮' : '📹'}
        </div>
      ),
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: 'Subdomain',
      dataIndex: 'subdomain',
      key: 'subdomain',
    },
    {
      title: 'Learning Objective',
      dataIndex: 'learningObjective',
      key: 'learningObjective',
    },
  ];

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

  const handleAddContent = async () => {
    try {
      const values = await form.validateFields();

      const formData = {
        ...values,
        grade: "60d49d5b2e1b2f000f8d9c52",
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

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {currentView === 'playlist' ? (
        <Card className="rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <Title level={3} className="m-0">Playlist ({playlistData.length})</Title>
            <div className="flex space-x-2">
              {
                // isSuperAdmin() && (
                  <Button
                    type="primary"
                    icon={<FileAddOutlined />}
                    className="mr-2 bg-blue-500"
                    onClick={() => setAddPlaylistVisible(true)}
                  >
                    Add Content
                  </Button>

                // )
              }
              <Button
                type="default"
                className="border-purple-800 text-purple-800 flex items-center"
              >
                <span className="mr-2">📚</span>
                Assign to Class
              </Button>
              <Button type="link" className="text-purple-800">More</Button>
            </div>
          </div>

          <div className="mb-6">
            <Row gutter={16}>
              <Col span={5}>
                <Select defaultValue="" style={{ width: '100%' }} placeholder="Grade">
                  <Option value="">Grade</Option>
                  <Option value="1">Grade 1</Option>
                  <Option value="2">Grade 2</Option>
                </Select>
              </Col>
              <Col span={5}>
                <Select defaultValue="" style={{ width: '100%' }} placeholder="Week">
                  <Option value="">Week</Option>
                  <Option value="1">Week 1</Option>
                  <Option value="2">Week 2</Option>
                </Select>
              </Col>
              <Col span={5}>
                <Select defaultValue="" style={{ width: '100%' }} placeholder="Day">
                  <Option value="">Day</Option>
                  <Option value="1">Monday</Option>
                  <Option value="2">Tuesday</Option>
                </Select>
              </Col>
              <Col span={5}>
                <Input
                  placeholder="Search"
                  prefix={<SearchOutlined className="text-gray-400" />}
                />
              </Col>
              <Col span={4}>
                <Button
                  icon={<ReloadOutlined />}
                  className="flex items-center"
                >
                  Reset Filter
                </Button>
              </Col>
            </Row>
          </div>

          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: setSelectedRowKeys, 
            }} dataSource={playlistData}
            columns={playlistColumns}
            pagination={{
              position: ['bottomRight'],
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              defaultPageSize: 100,
              total: playlistData.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            }}
            className="custom-table"
          />
        </Card>
      ) : (
        <Card bordered={false} className="rounded-lg shadow">
          <div className="mb-6">
            <Title level={3}>Animals of World({animalsOfWorldDetails.length})</Title>
          </div>

          <Table
            dataSource={animalsOfWorldDetails}
            columns={detailColumns}
            pagination={{
              position: ['bottomRight'],
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              defaultPageSize: 10,
              total: animalsOfWorldDetails.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            }}
            className="custom-table"
          />

          <div className="mt-6">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentView('playlist')}
              className="bg-purple-800 hover:bg-purple-700 border-purple-800"
            >
              Back
            </Button>
          </div>
        </Card>
      )}

      {/* Add Playlist Model */}
      <Modal
        title="Add Content"
        open={addplaylistvisible}
        onCancel={() => setAddPlaylistVisible(false)}
        width={900}
        footer={[
          <Button key="back" onClick={() => setAddPlaylistVisible(false)}>
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
              <Form.Item label="Playlist Name" name="name" rules={[{ required: true }]}>
                <Input placeholder="Enter playlist name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Branch ID" name="author" rules={[{ required: true }]}>
                <Input placeholder="Enter branch ID (author)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Grade ID" name="grade" rules={[{ required: true }]}>
                <Input placeholder="Enter grade ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="School ID" name="schoolId" rules={[{ required: true }]}>
                <Input placeholder="Enter school ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                <Input.TextArea rows={3} placeholder="Enter playlist description" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thumbnail" name="thumbnail">
                <Upload
                  beforeUpload={(file) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      const base64String = reader.result;
                      form.setFieldsValue({ thumbnail: base64String });
                    };
                    return false;
                  }}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Content IDs (comma separated)" name="contents" rules={[{ required: true }]}>
                <Input placeholder="e.g. 680c909fcf846f58445bfcaa,680c915ecf846f58445bfcac" />
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </Modal>
    </div>
  );
};


export default App;