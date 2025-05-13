import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Edit2,
  Trash2,
  EllipsisVertical,
} from "lucide-react";
import {
  Table,
  Button,
  Dropdown,
  Modal,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import {
  CreateAcademicYear,
  DeleteAcademicYear,
  GetAcademicYearsById,
  GetAllAcademicYear,
  UpdateAcademicYear,
} from "@/Network/Super_Admin/auth";
import { toast, ToastContainer } from "react-toastify";

export const AcademicList = () => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const columns = [
    {
      title: "Sr.No",
      key: "srno",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Academic Year", dataIndex: "academicYear", key: "academicYear" },
    { title: "Term Start Date", dataIndex: "termStartDate", key: "termStartDate" },
    { title: "Term End Date", dataIndex: "termEndDate", key: "termEndDate" },
    { title: "Created Date", dataIndex: "createdDate", key: "createdDate" },
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
                    onClick={() => handleEdit(record.id)}
                  >
                    <Edit2 size={14} /> Edit
                  </div>
                ),
              },
              {
                key: "delete",
                label: (
                  <div
                    className="flex items-center gap-2 text-red-500"
                    onClick={() => handleDelete(record.id)}
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
        <span className={`font-semibold ${status ? "text-green-600" : "text-red-500"}`}>
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
      setTableLoading(true);
      const response = await GetAllAcademicYear(page, limit);
      if (Array.isArray(response.data)) {
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
      console.error("Fetch failed:", err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const handleTableChange = (pagination) => {
    fetchAcademicYears(pagination.current, pagination.pageSize);
  };

  const handleEdit = async (id) => {
    try {
      const response = await GetAcademicYearsById(id);
      const data = response.data;

      form.setFieldsValue({
        name: data.name,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        endDate: data.endDate ? dayjs(data.endDate) : null,
      });

      setSelectedAcademicYearId(data._id);
      setEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this academic year?")) return;

    try {
      const response = await DeleteAcademicYear(id);
      toast.success(response.message || "Deleted!", {
        autoClose: 1000,
        onClose: () => fetchAcademicYears(),
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      let response;
      if (editMode && selectedAcademicYearId) {
        response = await UpdateAcademicYear(selectedAcademicYearId, payload);
        toast.success(response.message || "Updated Successfully!", {
          autoClose: 1000,
          onClose: () => fetchAcademicYears(),
        });
      } else {
        response = await CreateAcademicYear(payload);
        toast.success(response.message || "Created Successfully!", {
          autoClose: 1000,
          onClose: () => fetchAcademicYears(),
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setEditMode(false);
      form.resetFields();
    }
  };

  const handleOk = () => form.submit();

  return (
    <div className="overflow-x-auto">
      <ToastContainer />
      <div className="flex gap-2 justify-end mb-3">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditMode(false);
            form.resetFields();
          }}
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
        loading={tableLoading}
        pagination={{
          ...pagination,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
        scroll={{ x: "max-content", y: 350 }}
        className="custom-table"
      />

      <Modal
        title={editMode ? "Edit Academic Year" : "Add Academic Year"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditMode(false);
          form.resetFields();
          setSelectedAcademicYearId(null);
        }}
        okText={loading ? (editMode ? "Updating..." : "Submitting...") : (editMode ? "Update" : "Submit")}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Academic Year Name"
                name="name"
                rules={[{ required: true, message: "Please enter a name" }]}
              >
                <Input placeholder="e.g. 2024-2025" />
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
