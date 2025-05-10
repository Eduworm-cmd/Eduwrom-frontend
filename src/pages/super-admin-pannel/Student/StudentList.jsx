import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, Edit2, Trash2, EllipsisVertical, PlusCircle, Search } from "lucide-react";
import { Table, Button, Dropdown } from "antd";
import { GetAllStudentByBranch } from "@/Network/Super_Admin/auth";

export const StudentList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {id} = params;

  const page = 1;
  const limit = 10;

  const filteredData = schoolData.filter((item)=>{
    const search = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(search)
    );
  })

  console.log(filteredData);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);

  };

const fetchStudent = async () => {
  if (!id) return; 
  setLoading(true);
  try {
    const response = await GetAllStudentByBranch(id, page, limit);
    const { data } = response;

    const formattedData = data.map((student, index) => ({
      key: student._id,
      id: student._id,
      sno: index + 1,
      name: `${student.firstName} ${student.lastName}`,
      branchname: student.schoolBranch?.name,
      contact: student.parents?.[0]?.phoneNumber || "N/A",
      email: student.parents?.[0]?.email || "N/A",
      academicYear: "2023-2024", 
      studentClass: student.class?.className || "N/A", 
      createdAt: new Date(student.createdAt).toLocaleDateString(),
      status: student.isActive,
    }));

    setSchoolData(formattedData);
  } catch (error) {
    console.error("Error fetching students:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (id) {
    fetchStudent();
  }
}, [id]);

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
      title: "Student Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Branch Name",
      key: "branchname",
      dataIndex: "branchname",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`font-semibold ${status ? "text-green-600" : "text-red-500"}`}>
          {status ? "Active" : "Inactive"}
        </span>
      ),
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
        <div className="relative  ">
          <input
            type="text"
            placeholder="Search..."
            className="w-100 bg-white rounded-md    p-2 pl-10 border border-sky-500  focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search
            className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-500 "
            size={18}
          />
        </div>
        <button
          onClick={() => navigate("/eduworm-admin/students/add")}
          className="flex items-center gap-2 bg-sky-500 text-white font-semibold text-sm py-2 px-4 rounded"
        >
          <PlusCircle size={18} /> Add Student
        </button>
      </div>

      <Table
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
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
