import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import {
  Edit2,
  Eye,
  Trash2,
  PlusCircle,
  EllipsisVertical,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const GradeList = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classList, setClassList] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchSchools();
    fetchClassDropdown();
    // fetchGrades(); // If needed to list existing grades
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/school/dropdown");
      const data = await response.json();
      setSchools(data?.data || []);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const fetchBranches = async (schoolId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth_SchoolBranch/${schoolId}`
      );
      const data = await response.json();
      setBranches(data?.data || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const fetchClassDropdown = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/class/dropdown");
      const data = await response.json();
      setClassList(data?.data || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const columns = [
    {
      title: "Sr.No",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Grade Name",
      dataIndex: "className",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "edit",
                label: (
                  <div className="flex items-center gap-2 text-black">
                    <Edit2 size={14} /> Edit
                  </div>
                ),
              },
              {
                key: "view",
                label: (
                  <div className="flex items-center gap-2 text-black">
                    <Eye size={14} /> View
                  </div>
                ),
              },
              {
                key: "delete",
                label: (
                  <div className="flex items-center gap-2 text-red-500">
                    <Trash2 size={14} /> Delete
                  </div>
                ),
              },
            ],
          }}
        >
          <Button type="link" style={{ color: "black" }}>
            <EllipsisVertical />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    // fetchGrades(pagination.current, pagination.pageSize); // optional
  };

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      schoolId: values.schoolId,
      branchId: values.branchId,
      classId: values.classId,
      userId: "681c80cc1685bdce3c0b4d6c", // Replace with actual userId from context/auth
    };

    try {
      const response = await fetch("http://localhost:4000/api/grade/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Grade created successfully!");
        form.resetFields();
        setIsModalOpen(false);
        // Optionally refresh grade list here
      } else {
        throw new Error(result.message || "Failed to create grade");
      }
    } catch (error) {
      console.error("Create Grade Error:", error);
      toast.error("Error creating grade");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Grade List</h2>
        <Button
          type="primary"
          icon={<PlusCircle size={18} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Grade
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={classes} // You can replace with grades if needed
        pagination={{
          ...pagination,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total}`,
        }}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
      />

      {/* Modal for Add Grade */}
      <Modal
        title="Add Grade"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Submit"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="School"
                name="schoolId"
                rules={[{ required: true, message: "Please select school" }]}
              >
                <Select
                  placeholder="Select school"
                  onChange={(value) => {
                    form.setFieldsValue({ branchId: undefined });
                    fetchBranches(value);
                  }}
                >
                  {schools.map((school) => (
                    <Select.Option key={school._id} value={school._id}>
                      {school.schoolName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Branch"
                name="branchId"
                rules={[{ required: true, message: "Please select branch" }]}
              >
                <Select placeholder="Select branch">
                  {branches.map((branch) => (
                    <Select.Option key={branch._id} value={branch._id}>
                      {branch.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Class"
                name="classId"
                rules={[{ required: true, message: "Please select class" }]}
              >
                <Select placeholder="Select class">
                  {classList.map((cls) => (
                    <Select.Option key={cls._id} value={cls._id}>
                      {cls.className}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Grade Name"
                name="name"
                rules={[{ required: true, message: "Please enter grade name" }]}
              >
                <Input placeholder="e.g. Section-B" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
