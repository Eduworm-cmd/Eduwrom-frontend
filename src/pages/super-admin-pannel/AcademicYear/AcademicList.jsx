import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  EllipsisVertical,
} from "lucide-react";
import { Space, Table, Button, Dropdown, Modal, Form, Row, Col, Input, DatePicker } from "antd";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import { CreateAcademicYear, GetAllAcademicYear } from "@/Network/Super_Admin/auth";
import { toast, ToastContainer } from "react-toastify";

export const AcademicList = () => {
  const  [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [academicData, setAcademicData] = useState([]);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Sr.No",
      key: "srno",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Term Start Date",
      dataIndex: "termStartDate",
      key: "termStartDate",
    },
    {
      title: "Term End Date",
      dataIndex: "termEndDate",
      key: "termEndDate",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "edit",
                label: (
                  <div
                    className="flex items-center gap-2 text-black"
                    onClick={() =>
                      navigate(`/eduworm-admin/academic/edit/${record.id}`)
                    }
                  >
                    <Edit2 size={14} /> Edit
                  </div>
                ),
              },
              {
                key: "view",
                label: (
                  <div
                    className="flex items-center gap-2 text-black"
                    onClick={() =>
                      navigate(`/eduworm-admin/academic/view/${record.id}`)
                    }
                  >
                    <Eye size={14} /> View
                  </div>
                ),
              },
              {
                key: "delete",
                label: (
                  <div
                    className="flex items-center gap-2 text-red-500"
                    onClick={() => console.log("Delete", record.id)}
                  >
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          className={`font-semibold ${status ? "text-green-600" : "text-red-500"
            }`}
        >
          {status ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const exportColumns = [
    { key: "academicYear", label: "Academic Year" },
    { key: "termStartDate", label: "Term Start Date" },
    { key: "termEndDate", label: "Term End Date" },
    { key: "createdDate", label: "Created Date" },
  ];

  const fetchAcademicYears = async (page = 1, limit = 10) => {
    try {
      const response = await GetAllAcademicYear(page, limit);
      if (response?.data && Array.isArray(response.data)) {
        const transformed = response.data.map((item) => ({
          key: item._id,
          id: item._id,
          academicYear: item.name,
          termStartDate: new Date(item.startDate).toLocaleDateString("en-GB"),
          termEndDate: new Date(item.endDate).toLocaleDateString("en-GB"),
          createdDate: new Date(item.createdAt).toLocaleDateString("en-GB"),
          status: item.isActive,
        }));
        setAcademicData(transformed);
        setPagination({
          current: page,
          pageSize: limit,
          total: response.totalRecords || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch academic years:", err);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const handleTableChange = (pagination) => {
    fetchAcademicYears(pagination.current, pagination.pageSize);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };
      const response = await CreateAcademicYear(payload);
      toast.success(response.message || "Academic Year Created Successfully!");
      fetchAcademicYears();
    } catch (error) {
      console.log("Error creating academic year:", error);
    } finally {
      setLoading(false); 
      setIsModalOpen(false);
      form.resetFields();
    }
  };
  

  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <ToastContainer/>
      <div className="flex gap-2 justify-end mb-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] bg-sky-500"
        >
          <PlusCircle /> Add Academic Year
        </button>
        <DownloadButton />
        <ExportButton columns={exportColumns} currentItems={academicData} />
      </div>

      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={academicData}
        pagination={{
          ...pagination,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total}`,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
        scroll={{ x: "max-content", y: 350 }}
        className="custom-table"
      />





      <Modal
        title="Add Academic Year"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Submit"
      >
        <Form
          form={form}
          layout="vertical"
          className="form-container"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Academic Year Name"
                name="name"
                rules={[{ required: true, message: "Please enter a name" }]}
              >
                <Input type="number" placeholder="e.g. 2024-2025"/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "Start date is required" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: "End date is required" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    </div>
  );
};
