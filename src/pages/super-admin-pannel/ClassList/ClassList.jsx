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
import axios from "axios";
import { Class_By_Id, CreateClass, DeleteClass, GetClasses, UpdateClass } from "@/Network/Super_Admin/auth";

export const ClassList = () => {
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classes, setClasses] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [editMode, setEditMode] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);

    // Fetch all classes
    const fetchClasses = async () => {
        setTableLoading(true);
        try {
            const res = await GetClasses();
            if (res.data && Array.isArray(res.data)) {
                const formatted = res.data.map((item) => ({
                    key: item._id,
                    id: item._id,
                    className: item.className,
                    type: item.type,
                    createdAt: new Date(item.createdAt).toLocaleDateString("en-GB"),
                }));
                setClasses(formatted);
            }
        } catch (error) {
            console.error("Error fetching class list:", error);
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this class?");
        if (!confirm) return;

        try {
            const response = await DeleteClass(id);
            if (response) {
                toast.success(response.message, { autoClose: 1000 });
                fetchClasses();
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };


    const handleEdit = async (id) => {
        try {
            const res = await Class_By_Id(id);
            const classData = res?.data;

            if (classData) {
                form.setFieldsValue({
                    className: classData.className,
                    type: classData.type,
                });
                setSelectedClassId(classData._id);
                setEditMode(true);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error fetching class by ID:", error);
        }
    };

    const handleSubmit = async (values) => {
        const payload = {
            className: values.className,
            type: values.type,
        };

        try {
            setLoading(true);
            let res;

            if (editMode && selectedClassId) {
                res = await UpdateClass(selectedClassId, payload);
                toast.success(res.message || "Class updated successfully!", {
                    autoClose: 1000,
                    onClose: () => fetchClasses(),
                });
            } else {
                res = await CreateClass(payload);
                toast.success(res.message || "Class created successfully!", {
                    autoClose: 1000,
                    onClose: () => fetchClasses(),
                });
            }

            // Reset form and modal state
            form.resetFields();
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedClassId(null);
        } catch (error) {
            console.error("Error saving class:", error);
        } finally {
            setLoading(false);
        }
    };


    const columns = [
        {
            title: "Sr.No",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Class Name",
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
                                    <div className="flex items-center gap-2 text-red-500"
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
    ];

    return (
        <div className="p-4">
            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Class List</h2>
                <Button
                    type="primary"
                    icon={<PlusCircle size={18} />}
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditMode(false);
                        setSelectedClassId(null);
                        form.resetFields();
                    }}
                >
                    Add Class
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={classes}
                loading={tableLoading}
                pagination={{
                    ...pagination,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total}`,
                    pageSizeOptions: ["5", "10", "20", "50"],
                }}
                scroll={{ x: "max-content", y: 350 }}
                className="custom-table"
            />

            <Modal
                title={editMode ? "Edit Class" : "Add Class"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setSelectedClassId(null);
                    form.resetFields();
                }}
                okText={editMode ? "Update" : "Submit"}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Class Name"
                                name="className"
                                rules={[{ required: true, message: "Please enter class name" }]}
                            >
                                <Input placeholder="e.g. UKG" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Type"
                                name="type"
                                rules={[{ required: true, message: "Please select type" }]}
                            >
                                <Select placeholder="Select type">
                                    <Select.Option value="General">General</Select.Option>
                                    <Select.Option value="Special">Special</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};
