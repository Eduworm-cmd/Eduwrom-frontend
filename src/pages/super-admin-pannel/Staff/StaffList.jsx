import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  Edit2,
  Trash2,
  EllipsisVertical,
  PlusCircle,
  Search,
} from "lucide-react";
import { Table, Button, Dropdown, Input } from "antd";
import { DeleteStaff, GetAllStaff } from "@/Network/Super_Admin/auth";
import { toast, ToastContainer } from "react-toastify";

export const StaffList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStaffData = async () => {
    try {
      const response = await GetAllStaff();

      if (Array.isArray(response)) {
        const data = response.map((item, index) => ({
          ...item,
          key: item._id,
          sno: index + 1,
        }));

        setStaffData(data);
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredData(staffData);
    } else {
      const lowerSearch = searchText.toLowerCase();
      const filtered = staffData.filter((item) =>
        item.firstName?.toLowerCase().includes(lowerSearch) ||
        item.lastName?.toLowerCase().includes(lowerSearch) ||
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(lowerSearch) ||
        item.emailId?.toLowerCase().includes(lowerSearch) ||
        item.phoneNumber?.toLowerCase().includes(lowerSearch) ||
        item.employeeRole?.toLowerCase().includes(lowerSearch) ||
        item.department?.toLowerCase().includes(lowerSearch) ||
        item.branch?.toLowerCase().includes(lowerSearch)
      );
      setFilteredData(filtered);
    }
  }, [searchText, staffData]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const response = await DeleteStaff(id);
      toast.success(response.message || "Deleted!", {
        autoClose: 1000,
        onClose: () => fetchStaffData(),
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      dataIndex: "firstName",
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
                    onClick={() =>
                      navigate(`/eduworm-admin/staff/edit/${record._id}`)
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
                      navigate(`/eduworm-admin/staff/view/${record._id}`)
                    }
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

  return (
    <div className="overflow-x-auto">
      <ToastContainer />
      <div className="flex justify-end gap-2 mb-4">
        <Input
          prefix={<Search />}
          placeholder="Search by Name, Role, Email, Phone, etc."
          value={searchText}
          onChange={handleSearch}
          allowClear
          style={{ width: 300 }}
        />
        <button
          onClick={() => navigate("/eduworm-admin/allstaff/add")}
          className="flex items-center gap-2 bg-sky-500 text-white font-semibold text-sm py-2 px-4 rounded"
        >
          <PlusCircle size={18} /> Staff For School
        </button>
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
        loading={loading}
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
