import React, { useEffect, useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetStaffById } from '@/Network/Super_Admin/auth';

export const StaffView = () => {
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetStaffById(id);
        setStaffData(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
  }

  if (!staffData) {
    return <div className="text-center mt-10 text-red-600">Staff not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-10">
      <div className="bg-white rounded-md shadow-md flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/3 bg-sky-100 flex flex-col justify-center items-center p-6">
          <img
            src={staffData.profile}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-white shadow bg-slate-200"
          />
          <h2 className="mt-4 text-lg font-bold text-gray-800">{`${staffData.firstName} ${staffData.lastName}`}</h2>
          <div className="space-x-4 mt-4 flex">
            <button
              className="bg-yellow-500 cursor-pointer px-4 py-2 text-white rounded-sm flex items-center gap-2"
              onClick={() => navigate(`/eduworm-admin/staff/edit/${staffData.id}`)}
            >
              <Edit size={18} /> Edit
            </button>
            <button className="bg-red-500 cursor-pointer px-4 py-2 text-white rounded-sm flex items-center gap-2">
              <Trash size={18} /> Deactivate
            </button>
          </div>
        </div>

        <div className="md:w-2/3 p-6">
          <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Detail label="First Name" value={staffData.firstName} />
            <Detail label="Last Name" value={staffData.lastName} />
            <Detail label="DOB" value={staffData.dateOfBirth} />
            <Detail label="Employee Id" value={staffData.employeeId} />
            <Detail label="Phone Number" value={staffData.phoneNumber} />
            <Detail label="Email Address" value={staffData.emailId} />
            <Detail label="Role" value={staffData.employeeRole} />
            <Detail label="Gender" value={staffData.gender} />
            <Detail label="Department" value={staffData.department} />
            <Detail label="Created At" value={staffData.createdAt.split("T")[0]} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-md p-6">
        <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Additional Details</h3>
        <div className="space-y-2">
          <DetailWithHR label="Current Address" value={staffData.currentAddress} />
          <DetailWithHR label="Parmanent Address" value={staffData.permanentAddress} />
          <DetailWithHR label="Pincode" value={staffData.pinCode} />
          <DetailWithHR label="Religion" value={staffData.religion} />
          <DetailWithHR label="City" value={staffData.city} />
          <DetailWithHR label="State" value={staffData.state} />
          <DetailWithHR label="Father's Name" value={staffData.fatherName} />
          <DetailWithHR label="Nationality" value={staffData.nationality} />
        </div>
      </div>
    </div>
  );
};

const DetailWithHR = ({ label, value }) => (
  <>
    <div className="text-lg"><span className="font-semibold">{label}:</span> {value || '—'}</div>
    <hr />
  </>
);

const Detail = ({ label, value }) => (
  <div className="text-lg">
    <span className="font-semibold">{label}:</span> {value || '—'}
  </div>
);
