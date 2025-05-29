import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import {
  PlusCircle, Edit2, Trash2, Eye, EllipsisVertical, Search,
} from "lucide-react";
import { Table, Button, Dropdown } from "antd";
import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import { GetAllBranch } from "@/Network/Super_Admin/auth";
import './Branchlist.css'
import axios from "axios";
export const BranchList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBranches = async (page = 1, limit = 10, query = "") => {
    setLoading(true);
    try {
      const { data, totalBranches } = await GetAllBranch(page, limit);

      const formatted = data.map(branch => ({
        key: branch._id,
        id: branch._id,
        name: branch.name || branch.displayName,
        StartDate: new Date(branch.startDate).toLocaleDateString(),
        EndDate: new Date(branch.endDate).toLocaleDateString(),
        email: branch.contact?.email || "N/A",
        phone: branch.contact?.phone || "N/A",
        status: branch.isActive,
        students: branch.total_Students.length,
        AY: branch.academicYear.name
      
      }));

      setPagination({ current: page, pageSize: limit, total: totalBranches });

      if (query) {
        const lower = query.toLowerCase();
        const startsWith = formatted.filter(b => b.name.toLowerCase().startsWith(lower));
        const includes = formatted.filter(
          b => !b.name.toLowerCase().startsWith(lower) && b.name.toLowerCase().includes(lower)
        );
        setFilteredData([...startsWith, ...includes]);
      } else {
        setFilteredData(formatted);
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchBranches(pagination.current, pagination.pageSize, query);
  };

  const handleDelete = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ",
        cancelButton: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/api/auth_SchoolBranch/DeleteBranch/${id}`);
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your branch has been deleted.",
            icon: "success"
          });
          fetchBranches(pagination.current, pagination.pageSize, searchQuery);
        } catch (err) {
          console.error("Error deleting branch:", err);
          Swal.fire("Error", "Something went wrong!", "error");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your branch is safe :)",
          icon: "error"
        });
      }
    });
  };
  

  useEffect(() => {
    fetchBranches();
  }, []);

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "name",
    },
    {
      title: "Contact",
      render: (_, r) => (
        <>
          <div>{r.email}</div>
          <div>{r.phone}</div>
        </>
      ),
    },
    {
      title: "Academic Year",
      dataIndex: "AY",
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
    },
    {
      title: "Students",
      dataIndex: "students",
      render: (val, r) => (
        <div
          className="flex items-center gap-2 text-black cursor-pointer"
          onClick={() => navigate(`/eduworm-admin/students/list/${r.id}`)}
        >
          {val} <Eye size={14} />
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className={`font-semibold ${status ? "text-green-600" : "text-red-500"}`}>
          {status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_, r) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "edit",
                label: (
                  <div onClick={() => navigate(`/eduworm-admin/schoolbranch/edit/${r.id}`)} className="flex items-center gap-2 text-black">
                    <Edit2 size={14} /> Edit
                  </div>
                ),
              },
              {
                key: "view",
                label: (
                  <div onClick={() => navigate(`/eduworm-admin/schoolbranch/view/${r.id}`)} className="flex items-center gap-2 text-black">
                    <Eye size={14} /> View
                  </div>
                ),
              },
              {
                key: "delete",
                label: (
                  <div onClick={() => handleDelete(r.id)} className="flex items-center gap-2 text-red-500">
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
      render: (_, row) => `${row.email} | ${row.phone}`,
    },
    { key: "StartDate", label: "Start Date" },
    { key: "EndDate", label: "End Date" },
    { key: "AY", label: "Academic Year" },
  ];

  return (
    <div className="w-full">
      {/* Header: Search + Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Branch Name"
            className="w-full pl-10 py-1 rounded-sm border border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-300 transition-all duration-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/eduworm-admin/schoolbranch/add")}
            className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-sm font-semibold text-sm hover:bg-green-600 transition"
          >
            <PlusCircle size={16} /> Add Branch
          </button>
          <DownloadButton />
          <ExportButton columns={exportColumns} currentItems={filteredData} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-md">
        <Table
          columns={columns}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            position: ["bottomRight"],
            pageSizeOptions: ["10", "20", "50"],
            showLessItems: true,
          }}
          onChange={({ current, pageSize }) => fetchBranches(current, pageSize, searchQuery)}
          scroll={{ x: "max-content", y: 350 }}
          className="custom-table"
        />
      </div>
    </div>
  );
};
