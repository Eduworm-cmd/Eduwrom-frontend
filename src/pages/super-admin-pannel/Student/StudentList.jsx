import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, EllipsisVertical, PlusCircle } from "lucide-react";
import { Table, Button, Dropdown } from "antd";

export const StudentList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const studentData = [
    {
      id: 1,
      name: "John Doe",
      parentName: "Jane Doe",
      contact: "9876543210",
      academicYear: "2024-2025",
      studentClass: "5th Grade",
      createdAt: "2024-04-10",
      email: "johndoe@example.com",
    },
    {
      id: 2,
      name: "Alice Smith",
      parentName: "Robert Smith",
      contact: "9123456789",
      academicYear: "2023-2024",
      studentClass: "6th Grade",
      createdAt: "2024-03-15",
      email: "alice@example.com",
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
      title: "Student Details",
      key: "student",
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Parent and Contact",
      key: "parent",
      render: (_, record) => (
        <div>
          <div>{record.parentName}</div>
          <div>{record.contact}</div>
        </div>
      ),
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Class",
      dataIndex: "studentClass",
      key: "studentClass",
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
                key: "view",
                label: (
                  <div
                    className="flex items-center gap-2 text-black"
                    onClick={() => navigate(`/eduworm-admin/students/view/${record.id}`)}
                  >
                    <Eye size={14} /> View
                  </div>
                ),
              },
              {
                key: "edit",
                label: (
                  <div
                    className="flex items-center gap-2 text-black"
                    onClick={() => navigate(`/eduworm-admin/students/edit/${record.id}`)}
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
          onClick={() => navigate("/students/add")}
          className="flex items-center gap-2 bg-sky-500 text-white font-semibold text-sm py-2 px-4 rounded"
        >
          <PlusCircle size={18} /> Add Student
        </button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={studentData}
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
