import { GetGrades, GetSchools } from '@/Network/Super_Admin/auth';
import { BookOutlined, EyeOutlined, FileAddOutlined, ReloadOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Table, Upload } from 'antd';
import { Option } from 'antd/es/mentions';
import { Gamepad2, Youtube } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const PlayListAssignment = () => {
  const [form] = Form.useForm();
  const [school, setSchools] = useState();
  const [addplaylistvisible, setAddPlaylistVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [grade, setGrade] = useState();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const dataSource = [
    {
      key: '1',
      title: 'Animals of World',
      description: 'Learn about animals',
      activitycount: 5,
      status: 'Active',
    },
    {
      key: '2',
      title: 'Earth Facts',
      description: 'Interesting facts about Earth',
      activitycount: 3,
      status: 'Inactive',
    },
  ];

  const [filteredData, setfilteredData] = useState(dataSource);

  const columns = [
    {
      title: 'Title of Playlist',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Activity Count',
      dataIndex: 'activitycount',
      key: 'activitycount',
      render: (count, record) => (
        <span>
          {count}{' '}
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => setShowPlaylists(true, record.id)}
          />
        </span>

      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const playlistViewDatalist = [
    {
      key: '1',
      type: <Gamepad2 />, // React component for game icon
      typeLabel: 'game', // Add a label for sorting purposes
      title: 'Aquatic Animals',
      preview: '🎮',
      domain: 'General Awareness',
      subdomain: 'Under the sea',
      learningObjective: 'Identify and classify sea animals',
    },
    {
      key: '2',
      type: <Youtube />,
      typeLabel: 'video',
      title: 'Wildlife Wonders',
      preview: '',
      domain: 'Science',
      subdomain: 'Ecology',
      learningObjective: 'Understand different ecosystems',
    },
  ];

  const PlaylistViewColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.typeLabel.localeCompare(b.typeLabel),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Preview',
      dataIndex: 'preview',
      key: 'preview',
      render: (preview) => <span>{preview || '📹'}</span>,
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setfilteredData(dataSource);
      return;
    }

    const filtered = dataSource.filter(item =>
      item.title.toLowerCase().includes(value)
    );
    setfilteredData(filtered);
  };

  const fetchGrade = async () => {
    const response = await GetGrades();
    setGrade(response.data);
  };

  const fetchSchools = async () => {
    const response = await GetSchools();
    setSchools(response.data);
  }

  const handleAddPlaylist = async () => {

  }

  useEffect(() => {
    fetchSchools();
    fetchGrade();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-700">Content</h1>
        <div>
          <Button
            type="primary"
            icon={<FileAddOutlined />}
            className="mr-2 bg-blue-500"
            onClick={() => setAddPlaylistVisible(true)}
          >
            Add Playlist
          </Button>
          <Button
            type="primary"
            icon={<BookOutlined />}
            className="mr-2 bg-blue-500"
          >
            Assign to Class
          </Button>
        </div>
      </div>
      <Row gutter={16} className="mb-6">
        <Col span={5}>
          <Select placeholder="Grade" style={{ width: '100%' }}>
            <Option value="">Grade</Option>
            <Option value="1">Grade 1</Option>
            <Option value="2">Grade 2</Option>
          </Select>
        </Col>
        <Col span={5}>
          <Select placeholder="Week" style={{ width: '100%' }}>
            <Option value="">Week</Option>
            <Option value="1">Week 1</Option>
            <Option value="2">Week 2</Option>
          </Select>
        </Col>
        <Col span={5}>
          <Select placeholder="Day" style={{ width: '100%' }}>
            <Option value="">Day</Option>
            <Option value="1">Monday</Option>
            <Option value="2">Tuesday</Option>
          </Select>
        </Col>
        <Col span={5}>
          <Input placeholder="Search" prefix={<SearchOutlined />} onChange={handleSearch} />
        </Col>
        <Col span={4}>
          <Button icon={<ReloadOutlined />}>Reset Filter</Button>
        </Col>
      </Row>
      <Table
        rowSelection={rowSelection}
        dataSource={filteredData}
        columns={columns}
        pagination={true}
      />






      {/* Modal For add Playlist*/}
      <Modal
        title="Add Playlist"
        open={addplaylistvisible}
        onCancel={() => setAddPlaylistVisible(false)}
        width={900}
        footer={[
          <Button key="back" onClick={() => setAddPlaylistVisible(false)}>Back</Button>,
          <Button key="submit" type="primary" className="bg-sky-600" onClick={() => form.submit()}>
            Confirm
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const formattedPayload = {
              ...values,
              contents: values.contents
                ? values.contents.split(',').map((id) => id.trim()).filter(Boolean)
                : [],
            };
            handleAddPlaylist(formattedPayload);
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Playlist Name"
                name="name"
                rules={[{ required: true, message: 'Please enter playlist name' }]}
              >
                <Input placeholder="Enter playlist name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Author (Branch ID)"
                name="author"
                rules={[{ required: true, message: 'Please enter author ID' }]}
              >
                <Input placeholder="Enter author (branch ID)" />
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
                name="class"
                label="class"
                rules={[{ required: true, message: 'Please select a Class' }]}
              >
                <Select placeholder="Select Class" showSearch optionFilterProp="children">
                  {school?.map((s) => (
                    <Option key={s._id} value={s._id}>
                      {s.schoolName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>


          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
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
                      const base64 = reader.result;
                      form.setFieldsValue({ thumbnail: base64 });
                      setImage(base64); 
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
              <Form.Item
                label="Content IDs (comma separated)"
                name="contents"
                rules={[{ required: false }]}
              >
                <Input placeholder="e.g. id1,id2,id3" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>













      {/* Playlist View List  */}
      <Modal
        title="Playlist"
        open={showPlaylists}
        onCancel={() => setShowPlaylists(false)}
        width={900}
        footer={[
          <Button key="back" onClick={() => setShowPlaylists(false)}>Back</Button>,
        ]}
      >
        <Table
          dataSource={playlistViewDatalist}
          columns={PlaylistViewColumns}
          pagination={true}
        />

      </Modal>
    </div>
  );
};
