import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit2, Trash2, Eye, EllipsisVertical, Search } from "lucide-react";
import { Table, Button, Dropdown } from "antd";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import { DeleteSchoolById, GetAllSchools } from "@/Network/Super_Admin/auth";

export const SchoolList = () => {
 
  const [tableLoading, setTableLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolData, setSchoolData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const filteredData = schoolData.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(search)
    );
  });



  
 

  


  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    
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
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this school?")) {
                        handleDelete(record.id);
                      }
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </div>
                ),
              }
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
    { key: "CreateDate", label: "Create Date" },
    { key: "Branches", label: "Branches" },
  ];


  const handleDelete = async (schoolId) => {
    try {
      await DeleteSchoolById(schoolId);
      setSchoolData((prev) => prev.filter((school) => school.id !== schoolId));
    } catch (error) {
      console.error("Failed to delete school:", error);
    }
  };
  

  

  const fetchAllSchools = async () => {
    try {
      setTableLoading(true);
      const response = await GetAllSchools();

      const formattedData = response.data.map((school) => ({
        id: school._id,
        name: school.schoolName,
        email: school.contact?.email,
        phone: school.contact?.phone,
        CreateDate: new Date(school.createdAt).toLocaleDateString(),
        Branches: school.branches.length,
        status: school.isActive,
      }));

      setSchoolData(formattedData);
    } catch (error) {
      console.log("Error fetching school data:", error);
    }
    finally{
      setTableLoading(false);
    }
  };




  useEffect(() => {
    fetchAllSchools();
  }, []);

  return (
    <div className="w-full  ">
   <div className="flex items-center justify-between align-center relative">
        <div className="w-[400px]  relative border-sky-300 mb-3 rounded-1  ml-135 ">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 rounded-sm border border-sky-500  focus:outline-none focus:ring-1 focus:ring-sky-300 transition-all duration-200  "
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2 justify-end mb-3 ">

          <div>
            <button
              onClick={() => navigate("/eduworm-admin/school/add")}
              className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-sm font-semibold text-sm cursor-pointer"
            >
              <PlusCircle /> Add School
            </button>
          </div>
          <div className="flex gap-2">
            <DownloadButton />

            <ExportButton columns={exportColumns} currentItems={schoolData} />
          </div>
        </div>
   </div>

      <div className="overflow-auto border rounded-md">
        <Table
          loading={tableLoading}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={filteredData}
          pagination={{
            position: ["bottomRight"],
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`, 
            pageSize: 8,
            showLessItems: true,
          }}
          scroll={{ x: 1200, y: 400 }}
          className="custom-table"
          rowKey="id"
        />
      </div>
    </div>
  );
};
