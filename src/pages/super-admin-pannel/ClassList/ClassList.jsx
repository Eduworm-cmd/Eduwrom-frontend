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

export const ClassList = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classes, setClasses] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Fetch all classes from new endpoint
    const fetchClasses = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/class/all");
            if (res.data && Array.isArray(res.data.data)) {
                const formatted = res.data.data.map((item) => ({
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
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

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

    const handleSubmit = async (values) => {
        const payload = {
            className: values.className,
            type: values.type,
        };

        try {
            const res = await axios.post(
                "http://localhost:4000/api/class/create",
                payload
            );
            toast.success(res.data.message || "Class created successfully!");
            fetchClasses();
            form.resetFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating class:", error);
            toast.error(
                error.response?.data?.message || "Failed to create class."
            );
        }
    };

    return (
        <div className="p-4">
            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Class List</h2>
                <Button
                    type="primary"
                    icon={<PlusCircle size={18} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Class
                </Button>
            </div>

            {/* <Table
                columns={columns}
                dataSource={classes}
                pagination={{
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                    pageSize: 10,
                }}
                scroll={{ x: "max-content" }}
            /> */}

            <Table
                columns={columns}
                dataSource={classes}
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
                title="Add Class"
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                okText="Submit"
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
