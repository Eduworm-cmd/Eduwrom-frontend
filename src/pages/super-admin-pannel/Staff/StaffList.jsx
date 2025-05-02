import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, EllipsisVertical, PlusCircle, EyeIcon } from "lucide-react";
import { Table, Button, Dropdown } from "antd";
import axios from "axios"; // You'll need to install axios: `npm install axios`

export const StaffList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [staffData, setStaffData] = useState([]); // State to hold the fetched staff data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/SA_Staff/all");

        // Check if the response contains an array of staff data
        if (Array.isArray(response.data)) {
          const data = response.data; // Directly assign response.data since it's an array

          // Format the data to include `sno` for serial number and `key` for unique row identifier
          const formattedData = data.map((item, index) => ({
            ...item,
            key: item._id, // Use `_id` as the unique key
            sno: index + 1, // Serial number starting from 1
          }));

          setStaffData(formattedData); // Update state with fetched data
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        setError("Failed to fetch staff data"); // Set error message
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    fetchStaffData(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

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
      render: (_, record) => `${record.firstName} ${record.lastName}`, // Display full name
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
      render: (createdAt) => new Date(createdAt).toLocaleDateString(), // Format the created date
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
                    onClick={() => navigate(`/eduworm-admin/staff/edit/${record._id}`)}
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
                    onClick={() => navigate(`/eduworm-admin/staff/view/${record._id}`)}
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
                    onClick={() => console.log("Delete", record._id)}
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
        dataSource={staffData} // Use the fetched staff data
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
