import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EyeIcon, Edit2, Trash2, EllipsisVertical, PlusCircle } from "lucide-react";
import { Table, Button, Dropdown, Input, Select } from "antd";
import { DeleteStaff } from "@/Network/Super_Admin/auth";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { deleteSchoolStaff, SchoolStaffById } from "@/Network/schooladminauth";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
const { Search } = Input;
const { Option } = Select;

export const StaffByBranch = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [staffData, setStaffData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStaff, setTotalStaff] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const { id } = params;
    const branchId = id;
    const pageSize = 8;

    const fetchStaffData = async (id, page = 1, limit = pageSize) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await SchoolStaffById(id, limit, page);

            if (!response.data || response.data.length === 0) {
                setStaffData([]);
                setFilteredData([]);
                setTotalStaff(0);
                return;
            }

            const { data, totalStaff } = response;
            const formattedData = data.map((item, index) => ({
                ...item,
                sno: (page - 1) * limit + index + 1,
                key: item._id,
            }));

            setStaffData(formattedData);
            setFilteredData(formattedData);
            setTotalStaff(totalStaff);
        } catch (error) {
            console.error("Failed to fetch staff data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (id) {
            fetchStaffData(id, currentPage);
        }
    }, [id, currentPage]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff member?")) return;
        try {
            const response = await deleteSchoolStaff(id);
            toast.success(response.message || "Deleted!", {
                autoClose: 1000,
                onClose: () => fetchStaffData(branchId, currentPage),
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
        filterData(value, selectedRole);
    };

    const handleRoleFilter = (value) => {
        setSelectedRole(value);
        filterData(searchText, value);
    };

    const filterData = (search = "", role = "") => {
        const filtered = staffData.filter((staff) => {
            const matchesSearch =
                staff.firstName.toLowerCase().includes(search) ||
                staff.lastName.toLowerCase().includes(search) ||
                staff.emailId.toLowerCase().includes(search) ||
                staff.phoneNumber.includes(search);

            const matchesRole = role ? staff.employeeRole === role : true;
            return matchesSearch && matchesRole;
        });
        setFilteredData(filtered);
    };

    const columns = [
        {
            title: "Sno",
            dataIndex: "sno",
            key: "sno",
        },
        {
            title: "Name",
            key: "name",
            render: (_, record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: "Email/Phone",
            key: "contact",
            render: (_, record) => (
                <div>
                    <div>{record.emailId}</div>
                    <div>{record.phoneNumber}</div>
                </div>
            ),
        },
        {
            title: "Role",
            dataIndex: "employeeRole",
            key: "role",
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => new Date(createdAt).toLocaleDateString(),
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
                                        onClick={() => navigate(`/eduworm-admin/allstaff/edit/${record._id}`, {
                                            state: {
                                                branchId: id,
                                            },
                                        })}
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
                                        onClick={() => navigate(`/eduworm-school/staff/view/${record._id}`)}
                                    >
                                        <EyeIcon size={14} /> View
                                    </div>
                                ),
                            },
                            {
                                key: "delete",
                                label: (
                                    <div
                                        className="flex items-center gap-2 text-red-500"
                                        onClick={() => handleDelete(record._id)}
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

    const roleOptions = [...new Set(staffData.map((staff) => staff.employeeRole))];

    return (
        <div className="overflow-x-auto">
            {/* Add Staff & Filters */}
            <ToastContainer />
            <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
                <Search
                    placeholder="Search by name, email, phone"
                    onSearch={handleSearch}
                    allowClear
                    style={{ width: 250 }}
                />

                <Select
                    allowClear
                    placeholder="Filter by Role"
                    onChange={handleRoleFilter}
                    style={{ width: 180 }}
                >
                    {roleOptions.map((role) => (
                        <Option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Option>
                    ))}
                </Select>

                {/* <button
                    onClick={() => navigate("/eduworm-school/staff/add")}
                    className="flex items-center gap-2 bg-sky-500 text-white py-2 px-4 rounded-sm font-semibold text-sm cursor-pointer">
                    <PlusCircle size={18} /> Add Staff
                </button> */}

                <ExportButton />
                <DownloadButton />
            </div>


            {/* Staff Table */}
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                columns={columns}
                loading={loading}
                dataSource={filteredData}
                pagination={{
                    current: currentPage,
                    total: totalStaff,
                    pageSize,
                    onChange: (page) => setCurrentPage(page),
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                }}
                scroll={{ x: "max-content" }}
                className="custom-table"
            />
        </div>
    );
};
