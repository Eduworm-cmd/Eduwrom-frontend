import React, { useEffect, useState } from 'react';
import { BookOpen, DollarSign, Edit, GraduationCap, Trash, User, User2, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import user from "../../../assets/Images/teacher.webp";
import Barcharts from '@/components/Charts/Barcharts';
import { PieChart } from '@/components/Charts/PieChart';
import { GetBranchById, } from '@/Network/Super_Admin/auth';

export const BranchView = () => {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const statusList = [
    {
      title: "Students",
      value: school?.total_Students?.length || "15.00K",
      icon: <GraduationCap className="text-purple-500" size={30} />,
      bgColor: "bg-purple-100",
      link:`/eduworm-admin/students/list/${id}`
    },
    {
      title: "Class",
      value: school?.classes?.length|| "2.00K",
      icon: <User className="text-sky-600" size={30} />,
      bgColor: "bg-blue-50",
      // link:"/eduworm-admin/class/list"
    },
    {
      title: "Staff",
      value: school?.total_Staff?.length || "5.6K",
      icon: <Users className="text-orange-500" size={30} />,
      bgColor: "bg-orange-50",
      link:`/eduworm-admin/branchstaff/list/${id}`
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
      const response = await GetBranchById(id);
      setSchool(response.data);
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


  return (
    <div>
      {/* Main Profile Section */}
      <div className="max-w-8xl mx-auto mt-10 bg-white rounded-md shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4 bg-sky-100 flex flex-col justify-center items-center">
          <img src="" alt="School Logo" className="w-32 h-32 rounded-full object-cover border-2 bg-slate-200 border-white shadow" />
          <h2 className="mt-4 text-lg font-bold text-gray-800">{school?.name || '—'}</h2>
          <div className="space-x-4 mt-2 flex w-full justify-center items-center my-6">
            <button className='bg-yellow-500 px-4 py-2 cursor-pointer flex text-white rounded-sm gap-2' onClick={() => navigate(`/eduworm-admin/schoolbranch/edit/${id}`)}>
              <Edit /> Edit
            </button>
            <button className='bg-red-500 px-4 py-2 cursor-pointer flex text-white rounded-sm gap-2'>
              <Trash /> Deactivate
            </button>
          </div>
        </div>

        {/* School Info */}
        <div className="md:w-2/3 p-6 mb-3">
          <h3 className='text-2xl font-semibold text-sky-500 mb-4'>Branch Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><strong>Branch Name:</strong> {school?.name || '—'}</div>
            <div><strong>Display Name:</strong> {school?.displayName || '—'}</div>
            <div><strong>Classes:</strong> {school?.classes?.length || '0'}</div>
            <div><strong>Academic Year:</strong> {school?.academicYear?.length || '—'}</div>
            <div><strong>Start Date:</strong> {school?.startDate?.split('T')[0] || '—'}</div>
            <div><strong>End Date:</strong> {school?.endDate?.split('T')[0] || '—'}</div>
            <div><strong>Phone:</strong> {school?.contact?.phone || '—'}</div>
            <div><strong>Email:</strong> {school?.contact?.email || '—'}</div>
            <div><strong>Country:</strong> {school?.location?.country || '—'}</div>
            <div><strong>State:</strong> {school?.location?.state || '—'}</div>
            <div><strong>City:</strong> {school?.location?.city || '—'}</div>
            <div><strong>Pincode:</strong> {school?.location?.pincode || '—'}</div>
            <div><strong>Address:</strong> {school?.location?.address || '—'}</div>
          </div>
        </div>
      </div>

      {/* Branch Info */}
      <div className="max-w-8xl w-full shadow-md rounded-md p-4 mt-10 bg-white">
        <h1 className='text-3xl text-sky-500 font-semibold'>Branch Admin Information</h1>
        <div className='my-3'><strong>Branch Name:</strong> {school?.name || '—'}</div>
        <div className='my-3'><strong>Branch Phone:</strong> {school?.contact?.phone || '—'}</div>
        <div className='my-3'><strong>Branch Email:</strong> {school?.contact?.email || '—'}</div>
      </div>

      <section>
        <div className="max-w-8xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
            {
              Array.isArray(statusList) && statusList.map((s, index) => (
                <Link to={s.link}><div
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
                </Link>
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