import { DeleteStudent, GetAllStudentByBranch } from '@/Network/Super_Admin/auth';
import { Button, Dropdown, Table } from 'antd';
import {
  Edit2,
  EllipsisVertical,
  Eye,
  PlusCircle,
  Search,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export const SA_StundentList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [studentData, setStundentData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = params;
  const user = useSelector((state) => state.auth.user);
  const page = 1;
  const limit = 10;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const featchStudentData = async () => {
    try {
      setLoading(true);
      const response = await GetAllStudentByBranch(user.id, page, limit);
      const formatted = response.data.map((item, index) => ({
        key: item._id,
        id: item._id,
        sno: index + 1,
        name: `${item.firstName} ${item.lastName}`,
        contact: item.parents?.[0]?.email || 'N/A',
        parentsphone: item.parents?.[0]?.phoneNumber || 'N/A',
        studentClass: item.class?.className || 'N/A',
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        status: item.isActive,
      }));
      setStundentData(formatted);
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    featchStudentData();
  }, []);

  const filteredData = studentData?.filter((item) => {
    const search = searchTerm.toLowerCase();
    return item.name.toLowerCase().includes(search);
  });

  // ✅ Direct Delete (No confirmation popup)
  const handleDelete = async (studentId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this student?');
      if (!confirmed) return;

      setLoading(true);
      await DeleteStudent(studentId);
      setStundentData((prev) => prev.filter((student) => student.id !== studentId));
    } catch (err) {
      console.error('Failed to delete student:', err);
    } finally {
      setLoading(false);
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
      title: 'Sno',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, row) => (
        <div>
          <div>{row.contact}</div>
          <div>{row.parentsphone}</div>
        </div>
      )
    },
    {
      title: 'Class',
      dataIndex: 'studentClass',
      key: 'studentClass',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`font-semibold ${status ? 'text-green-600' : 'text-red-500'}`}>
          {status ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'view',
                label: (
                  <div
                    className="flex items-center gap-2 text-black"
                    onClick={() => navigate(`/eduworm-school/stundent/view/${record.id}`)}
                  >
                    <Eye size={14} /> View
                  </div>
                ),
              },
              {
                key: 'edit',
                label: (
                  <div
                    className="flex items-center gap-2 text-black"
                    onClick={() => navigate(`/eduworm-school/stundent/edit/${record.id}`)}
                  >
                    <Edit2 size={14} /> Edit
                  </div>
                ),
              },
              {
                key: 'delete',
                label: (
                  <div
                    className="flex items-center gap-2 text-red-500"
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </div>
                ),
              },
            ],
          }}
        >
          <Button type="link" style={{ color: 'black' }}>
            <EllipsisVertical />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex justify-end gap-2 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-100 bg-white rounded-md p-2 pl-10 border border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>
          <button
            onClick={() => navigate('/eduworm-school/stundent/add')}
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
            position: ['bottomRight'],
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            pageSize: 8,
          }}
          scroll={{ x: 'max-content' }}
          className="custom-table"
          locale={{ emptyText: 'No students found' }}
        />
      </div>
    </div>
  );
};
