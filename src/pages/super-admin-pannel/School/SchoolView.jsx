import React, { useEffect, useState } from 'react';
import { BookOpen, DollarSign, Edit, GraduationCap, Trash, User, User2, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetSchoolById } from '@/Network/Super_Admin/auth';
import user from "../../../assets/Images/teacher.webp";
import Barcharts from '@/components/Charts/Barcharts';
import { PieChart } from '@/components/Charts/PieChart';

export const SchoolView = () => {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const statusList = [
    {
      title: "Students",
      value: "15.00K",
      icon: <GraduationCap className="text-purple-500" size={30} />,
      bgColor: "bg-purple-100",
    },
    {
      title: "Teachers",
      value: "2.00K",
      icon: <User className="text-sky-600" size={30} />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Parents",
      value: "5.6K",
      icon: <Users className="text-orange-500" size={30} />,
      bgColor: "bg-orange-50",
    },
    {
      title: "Earnings",
      value: "$19.3K",
      icon: <DollarSign className="text-green-500" size={30} />,
      bgColor: "bg-green-50",
    },

  ];

  const SchoolApi = async (id) => {
    try {
      const response = await GetSchoolById(id);
      if (response.success) {
        setSchool(response.data);
      } else {
        console.error("Error:", response.message);
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
          <img src={school?.schoolLogo || user} alt="School Logo" className="w-32 h-32 rounded-full object-cover border-2 bg-slate-200 border-white shadow" />
          <h2 className="mt-4 text-lg font-bold text-gray-800">{school?.schoolName || '—'}</h2>
          <div className="space-x-4 mt-2 flex w-full justify-center items-center my-6">
            <button className='bg-yellow-500 px-4 py-2 cursor-pointer flex text-white rounded-sm gap-2' onClick={() => navigate(`/eduworm-admin/school/edit/${id}`)}>
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
            <div><strong>School Name:</strong> {school?.schoolName || '—'}</div>
            <div><strong>Display Name:</strong> {school?.displayName || '—'}</div>
            <div><strong>Classes:</strong> {school?.classes?.length || '0'}</div>
            <div><strong>Academic Year:</strong> {school?.academicYear?.length || '—'}</div>
            <div><strong>Start Date:</strong> {school?.startDate?.split('T')[0] || '—'}</div>
            <div><strong>End Date:</strong> {school?.endDate?.split('T')[0] || '—'}</div>
            <div><strong>Phone:</strong> {school?.phone || '—'}</div>
            <div><strong>Email:</strong> {school?.email || '—'}</div>
            <div><strong>Country:</strong> {school?.country || '—'}</div>
            <div><strong>State:</strong> {school?.state || '—'}</div>
            <div><strong>City:</strong> {school?.city || '—'}</div>
            <div><strong>Pincode:</strong> {school?.pincode || '—'}</div>
            <div><strong>Address:</strong> {school?.address || '—'}</div>
          </div>
        </div>
      </div>

      {/* Branch Info */}
      <div className="max-w-8xl w-full shadow-md rounded-md p-4 mt-10 bg-white">
        <h1 className='text-3xl text-sky-500 font-semibold'>Branch Admin Information</h1>
        <div className='my-3'><strong>Branch Name:</strong> {school?.branchName || '—'}</div>
        <div className='my-3'><strong>Branch Phone:</strong> {school?.branchPhone || '—'}</div>
        <div className='my-3'><strong>Branch Email:</strong> {school?.branchEmail || '—'}</div>
      </div>

      <section>
        <div className="max-w-8xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
            {
              Array.isArray(statusList) && statusList.map((s, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center rounded-md px-4 py-4 shadow-md ${s.bgColor}`}
                >
                  <div>
                    <h1 className="text-base sm:text-lg font-semibold mb-1">{s.title}</h1>
                    <p className="text-xl sm:text-2xl font-bold">{s.value}</p>
                  </div>
                  <div className="p-2">
                    {s.icon ? React.cloneElement(s.icon, { className: "w-12 h-12 sm:w-16 sm:h-16" }) : null}
                  </div>
                </div>
              ))
            }
          </div>


          <div className="max-w-full rounded-2xl grid grid-cols-2 gap-6">
            <Barcharts />
            <PieChart />
          </div>
        </div>
      </section>
    </div>
  );
};
