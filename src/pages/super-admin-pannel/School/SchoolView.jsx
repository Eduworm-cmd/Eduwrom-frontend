import React, { useEffect, useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetSchoolById } from '@/Network/Super_Admin/auth';
import user from "../../../assets/Images/teacher.webp";

export const SchoolView = () => {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const SchoolApi = async (id) => {
    try {
      const response = await GetSchoolById(id);
      if (response?.school) {
        setSchool(response.school);
      } else {
        console.error("Error:", response.message || "School not found");
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) SchoolApi(id);
  }, [id]);

  if (loading) return <p className="p-4 text-lg">Loading school data...</p>;
  if (!school) return <p className="p-4 text-red-600">School not found.</p>;

  return (
    <div>
      {/* Main Profile Section */}
      <div className="max-w-8xl mx-auto mt-10 bg-white rounded-md shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4 bg-sky-100 flex flex-col justify-center items-center">
          <img
            src={school.schoolLogo || user}
            alt="School Logo"
            className="w-32 h-32 rounded-full object-cover border-2 bg-slate-200 border-white shadow"
          />
          <h2 className="mt-4 text-lg font-bold text-gray-800">{school.schoolName || '—'}</h2>

          <div className="space-x-4 mt-4 flex justify-center">
            <button
              className='bg-yellow-500 px-4 py-2 cursor-pointer flex text-white rounded-sm gap-2'
              onClick={() => navigate(`/eduworm-admin/school/edit/${id}`)}
            >
              <Edit /> Edit
            </button>
            <button className='bg-red-500 px-4 py-2 cursor-pointer flex text-white rounded-sm gap-2'>
              <Trash /> Deactivate
            </button>
          </div>
        </div>

        {/* School Info */}
        <div className="md:w-2/3 p-6 mb-3">
          <h3 className='text-2xl font-semibold text-sky-500 mb-4'>School Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><strong>First Name:</strong> {school.firstName || '—'}</div>
            <div><strong>Last Name:</strong> {school.lastName || '—'}</div>
            <div><strong>School Name:</strong> {school.schoolName || '—'}</div>
            <div><strong>Email:</strong> {school.contact?.email || '—'}</div>
            <div><strong>Phone:</strong> {school.contact?.phone || '—'}</div>
            <div><strong>Status:</strong> {school.isActive ? 'Active' : 'Inactive'}</div>
            <div><strong>Total Branches:</strong> {school.branches?.length || 0}</div>
            <div><strong>Created At:</strong> {new Date(school.createdAt).toLocaleDateString()}</div>
            <div><strong>Updated At:</strong> {new Date(school.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
