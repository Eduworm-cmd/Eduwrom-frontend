import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit2, Trash2, Eye, EllipsisVertical } from "lucide-react";
import { Table, Button, Dropdown } from "antd";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import { GetAllSchools } from "@/Network/Super_Admin/auth";

export const SchoolList = () => {
    const navigate = useNavigate();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [schoolData, setSchoolData] = useState([]);

    const onSelectChange = (selectedKeys) => {
        setSelectedRowKeys(selectedKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
        {
            title: "School Name",
            dataIndex: "name",
            key: "name",
            width: 200,
        },
        {
            title: "Contact",
            key: "contact",
            width: 250,
            render: (_, record) => (
                <div>

                    <div className="whitespace-nowrap text-sm text-gray-700">
                        {record.email}
                    </div>
                    <div className="whitespace-nowrap text-sm text-gray-700">
                        {record.phone}
                    </div>
                </div>
            ),
        },
        {
            title: "Academic Year",
            dataIndex: "AY",
            key: "AY",
            width: 180,
        },
        {
            title: "Create Date",
            dataIndex: "CreateDate",
            key: "CreateDate",
            width: 180,
        },
        {
            title: "Branches",
            dataIndex: "Branches",
            key: "Branches",
            width: 120,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => (
                <span className={`font-semibold ${status ? "text-green-600" : "text-red-500"}`}>
                    {status ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: 100,
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
                                        onClick={() => navigate(`/eduworm-admin/branch/edit/${record.id}`)}
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
                                        onClick={() => navigate(`/eduworm-admin/branch/view/${record.id}`)}
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
                    <Button type="link" className="text-black">
                        <EllipsisVertical />
                    </Button>
                </Dropdown>
            ),
        },
    ];

    const exportColumns = [
        { key: "name", label: "School Name" },
        {
            key: "contact",
            label: "Contact",
            render: (value, row) => `${row.email} | ${row.phone}`,
        },
        { key: "StartDate", label: "Start Date" },
        { key: "EndDate", label: "End Date" },
        { key: "AY", label: "Academic Year" },
    ];

    const AllSchools = async () => {
        try {
            const response = await GetAllSchools();
            const rawData = response.allSchools || [];

            const formattedData = rawData.map((school) => ({
                id: school._id,
                AY: school.academicYear?.map((ay) => ay.name).join(", "),
                name: school.schoolName,
                StartDate: school.startDate,
                EndDate: school.endDate,
                phone: school.phone,
                email: school.branchEmail,
                CreateDate: new Date(school.createdAt).toLocaleDateString(),
                Branches: school.branchCount || "0",
                status: new Date(school.endDate) > new Date(),
            }));

            setSchoolData(formattedData);
        } catch (error) {
            console.log("Error fetching school data:", error);
        }
    };

    useEffect(() => {
        AllSchools();
    }, []);

    return (
        <div className="w-248 max-w-8xl">
            {/* <div className="min-w-[1200px] max-w-full"> */}

            <div className="flex gap-2 justify-end mb-3">

                <button
                    onClick={() => navigate("/eduworm-admin/branch/add")}
                    className="flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] bg-sky-500"
                >
                    <PlusCircle /> Add School
                </button>
                <DownloadButton />
                <ExportButton columns={exportColumns} currentItems={schoolData} />
            </div>

            <div className="overflow-auto border rounded-md">
                <Table
                    columns={columns}
                    rowSelection={rowSelection}
                    dataSource={schoolData}
                    pagination={{
                        position: ["bottomRight"],
                        pageSizeOptions: ["10", "20", "50"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                        pageSize: 8,
                        showLessItems: true,
                    }}
                    scroll={{ x: 1200, y: 400 }}
                    className="custom-table"
                />
            </div>
        </div>
    );
};
