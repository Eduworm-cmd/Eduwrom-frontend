import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle, Edit2, Trash2, Eye, EllipsisVertical,
  Search,
} from "lucide-react";
import { Space, Table, Button, Dropdown, Input } from "antd";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import "./BranchList.css";
import axios from "axios";

export const BranchList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const fetchBranches = async (page = 1, limit = 10, query = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/auth_SchoolBranch/allBranches?page=${page}&limit=${limit}`);
      const { data, totalBranches } = response.data;

      const formattedData = data.map((branch) => ({
        key: branch._id,
        id: branch._id,
        name: branch.name || branch.displayName,
        StartDate: new Date(branch.startDate).toLocaleDateString(),
        EndDate: new Date(branch.endDate).toLocaleDateString(),
        email: branch.contact?.email || "N/A",
        phone: branch.contact?.phone || "N/A",
        status: branch.isActive,
        students: branch.total_Students.length,
        AY: Array.isArray(branch.academicYear)
          ? branch.academicYear.map(ay => ay.name).join(", ")
          : "",
      }));

      setSchoolData(formattedData);
      setPagination({ current: page, pageSize: limit, total: totalBranches });

      if (query) {
        const filtered = formattedData.filter(branch =>
          branch.name.toLowerCase().includes(query.toLowerCase()) ||
          branch.email.toLowerCase().includes(query.toLowerCase()) ||
          branch.phone.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchBranches(pagination.current, pagination.pageSize, searchQuery);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchBranches(pagination.current, pagination.pageSize, value);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div>
          <div>{record.email}</div>
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Academic Year",
      dataIndex: "AY",
      key: "AY",
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      key: "StartDate",
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      key: "EndDate",
    },
    {
      title: "Students",
      dataIndex: "students",
      key: "students",
      render: (students, record) => (
        <div
          className="flex items-center gap-2 text-black cursor-pointer"
          onClick={() => navigate(`/eduworm-admin/students/list/${record.id}`)}
        >
          {students} <Eye size={14} />
        </div>
      ),
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
      title: "Action",
      key: "action",
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
                    onClick={() => navigate(`/eduworm-admin/schoolbranch/edit/${record.id}`)}
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
                    onClick={() => navigate(`/eduworm-admin/schoolbranch/view/${record.id}`)}
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
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this branch?")) {
                        try {
                          await axios.delete(`http://localhost:4000/api/auth_SchoolBranch/DeleteBranch/${record.id}`);
                          fetchBranches(pagination.current, pagination.pageSize, searchQuery); // Refresh table
                        } catch (error) {
                          console.error("Error deleting branch:", error);
                          alert("Failed to delete branch");
                        }
                      }
                    }}
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

  const exportColumns = [
    { key: "name", label: "Branch Name" },
    {
      key: "contact",
      label: "Contact",
      render: (value, row) => `${row.email} | ${row.phone}`,
    },
    { key: "StartDate", label: "Start Date" },
    { key: "EndDate", label: "End Date" },
    { key: "AY", label: "Academic Year" },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-wrap items-center justify-end gap-3 mb-3">
        <div className="relative mt-3.5">
          <input
            type="text"
            placeholder="Search by Branch Name, Contact, or Phone"
            className="w-[280px] bg-white rounded-md p-2 pl-10 border border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>

        <button
          onClick={() => navigate("/eduworm-admin/branch/add")}
          className="flex items-center gap-2 text-white py-2 mt-4 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] bg-sky-500"
        >
          <PlusCircle /> Add Branch
        </button>

        <DownloadButton />
        <ExportButton columns={exportColumns} currentItems={filteredData} />
      </div>



      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={filteredData}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          position: ["bottomRight"],
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          showLessItems: true,
        }}
        onChange={handleTableChange}
        scroll={{ x: "max-content", y: 350 }}
        className="custom-table"
      />
    </div>
  );
};
