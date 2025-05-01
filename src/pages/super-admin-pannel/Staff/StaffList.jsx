import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, EllipsisVertical, PlusCircle, UserCheck, Download, EyeIcon } from "lucide-react";
import { Table, Button, Dropdown } from "antd";

export const StaffList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const staffData = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "9876543210",
      role: "Math Teacher",
      classrooms: "5A, 5B",
      createdAt: "2024-03-10",
    },
    {
      id: 2,
      name: "Arjun Mehta",
      email: "arjun@example.com",
      phone: "9123456789",
      role: "Science Teacher",
      classrooms: "6A",
      createdAt: "2024-02-28",
    },
  ].map((item, index) => ({ ...item, key: item.id, sno: index + 1 }));

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Sno",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email/Phone",
      key: "contact",
      render: (_, record) => (
        <div>
          <div>{record.email}</div>
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Classrooms",
      dataIndex: "classrooms",
      key: "classrooms",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
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
                    onClick={() => navigate(`/eduworm-admin/staff/edit/${record.id}`)}
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
                    onClick={() => navigate(`/eduworm-admin/staff/view/${record.id}`)}
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
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => navigate("/eduworm-admin/staff/add")}
          className="flex items-center gap-2 bg-sky-500 text-white font-semibold text-sm py-2 px-4 rounded"
        >
          <PlusCircle size={18} /> Add Staff
        </button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={staffData}
        pagination={{
          position: ["bottomRight"],
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          pageSize: 8,
        }}
        scroll={{ x: "max-content" }}
        className="custom-table"
      />
    </div>
  );
};
