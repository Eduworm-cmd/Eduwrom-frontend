import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  EllipsisVertical,
} from "lucide-react";
import { Space, Table, Button, Dropdown } from "antd";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import { GetAcademicYear } from "@/Network/Super_Admin/auth";

export const AcademicList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [academicData, setAcademicData] = useState([]);

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Sr.No",
      key: "srno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Term Start Date",
      dataIndex: "termStartDate",
      key: "termStartDate",
    },
    {
      title: "Term End Date",
      dataIndex: "termEndDate",
      key: "termEndDate",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
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
                      navigate(`/eduworm-admin/academic/edit/${record.id}`)
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
                      navigate(`/eduworm-admin/academic/view/${record.id}`)
                    }
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
          <Button type="link" style={{ color: "black" }}>
            <EllipsisVertical />
          </Button>
        </Dropdown>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          className={`font-semibold ${
            status ? "text-green-600" : "text-red-500"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const exportColumns = [
    { key: "academicYear", label: "Academic Year" },
    { key: "termStartDate", label: "Term Start Date" },
    { key: "termEndDate", label: "Term End Date" },
    { key: "createdDate", label: "Created Date" },
  ];

  const fetchAcademicYears = async () => {
    try {
      const response = await GetAcademicYear();
      if (response?.status === "success" && Array.isArray(response.data)) {
        const transformed = response.data.map((item, index) => ({
          key: item._id,
          id: item._id,
          academicYear: item.name,
          termStartDate: new Date(item.startDate).toLocaleDateString("en-GB"),
          termEndDate: new Date(item.endDate).toLocaleDateString("en-GB"),
          createdDate: new Date(item.createdAt).toLocaleDateString("en-GB"),
          status: item.isActive,
        }));
        setAcademicData(transformed);
      }
    } catch (err) {
      console.error("Failed to fetch academic years:", err);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 justify-end mb-3">
        <button
          onClick={() => navigate("/eduworm-admin/academic/add")}
          className="flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] bg-sky-500"
        >
          <PlusCircle /> Add Academic Year
        </button>
        <DownloadButton />
        <ExportButton columns={exportColumns} currentItems={academicData} />
      </div>

      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={academicData}
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
