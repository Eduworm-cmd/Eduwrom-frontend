import React, { useState } from 'react';
import { 
  Table, Button, Input, Select, Space, Card, Typography, 
  Badge, Checkbox, Breadcrumb, Row, Col 
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  ArrowLeftOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const App = () => {
  const [currentView, setCurrentView] = useState('playlist');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  
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

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {currentView === 'playlist' ? (
        <Card bordered={false} className="rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <Title level={3} className="m-0">Playlist ({playlistData.length})</Title>
            <div className="flex space-x-2">
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
            dataSource={playlistData}
            columns={playlistColumns}
            pagination={{ 
              position: ['bottomRight'],
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              defaultPageSize: 100,
              total: playlistData.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            }}
            rowSelection={{ type: 'checkbox', selectedRowKeys: [] }}
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
    </div>
  );
};

// CSS that would be imported to customize Ant Design with Tailwind
const CustomStyles = () => {
  return (
    <style jsx global>{`
      /* Override Ant Design styles with Tailwind-like customizations */
      .ant-select-selector {
        @apply border border-gray-300 rounded;
      }
      
      .ant-table-thead > tr > th {
        @apply bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider;
      }
      
      .ant-table-tbody > tr > td {
        @apply py-4 whitespace-nowrap text-sm;
      }
      
      .ant-btn-primary {
        @apply bg-purple-800 border-purple-800;
      }
      
      .ant-btn-primary:hover {
        @apply bg-purple-700 border-purple-700;
      }
      
      .custom-table .ant-table-pagination {
        @apply mt-4;
      }
    `}</style>
  );
};

export default App;