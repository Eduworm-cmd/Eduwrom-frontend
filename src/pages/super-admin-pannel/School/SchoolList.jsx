import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit2, Trash2, Eye, EllipsisVertical } from "lucide-react";
import { Space, Table, Button, Dropdown } from "antd";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import "./SchoolList.css";
import { GetAllSchools, GetSchools } from "@/Network/Super_Admin/auth";

export const SchoolList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [schoolData, setSchoolData] = useState();
  // const schoolData = [
  //   {
  //     id: 2,
  //     AY: "2027-2029",
  //     name: "Diana Plenty",
  //     StartDate: "31/03/2025",
  //     EndDate: "01/04/2024",
  //     phone: "9988776655",
  //     email: "davidb@example.com",
  //     status: false,
  //   },
  //   {
  //     id: 3,
  //     AY: "2024-2025",
  //     name: "Adam Smith",
  //     StartDate: "01/04/2025",
  //     EndDate: "01/04/2024",
  //     phone: "9988776655",
  //     email: "davdb@example.com",
  //     status: true,
  //   },
  // ].map((item) => ({ ...item, key: item.id }));

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
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div>
          {record.email && <div>{record.email}</div>}
          {record.phone && <div>{record.phone}</div>}
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
                    onClick={() => navigate(`/eduworm-admin/school/edit/${record.id}`)}
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
                    onClick={() => navigate(`/eduworm-admin/school/view/${record.id}`)}
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
          <Button
            type="link"
            style={{ color: "black" }}
          >
            <EllipsisVertical />
          </Button>

        </Dropdown>
      )
    }

  ];

  const exportColumns = [
    { key: "name", label: "School Name" },
    {
      key: "contact",
      label: "Contact",
      render: (value, row) => (
        <div>
          {row.email} | {row.phone}
        </div>
      ),
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
        AY: school.academicYear?.map((ay) => {
            return ay.name;
        }),
        name: school.schoolName,
        StartDate: school.startDate,
        EndDate: school.endDate,
        phone: school.phone,
        email: school.branchEmail,
        status: new Date(school.endDate) > new Date(),
      }));
  
      setSchoolData(formattedData);
  
    } catch (error) {
      console.log("Error fetching school data:", error);
    }
  };
    
  useEffect(() => {
    AllSchools();    
  }, [])

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 justify-end mb-3">
        <button
          onClick={() => navigate("/eduworm-admin/school/add")}
          className="flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] bg-sky-500"
        >
          <PlusCircle /> Add School
        </button>
        <DownloadButton />
        <ExportButton columns={exportColumns} currentItems={schoolData} />
      </div>

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
        scroll={{ x: "max-content", y: 350 }}
        className="custom-table"
      />
    </div>
  );
};
