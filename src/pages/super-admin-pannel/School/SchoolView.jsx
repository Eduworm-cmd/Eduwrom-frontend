import React from 'react'
import user from "../../../assets/Images/teacher.webp"
import { BookOpen, DollarSign, Edit, GraduationCap, Trash, User2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Barcharts from '@/components/Charts/Barcharts';
import { PieChart } from '@/components/Charts/PieChart';
export const SchoolView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const school = {
    name: 'Delhi Public School',
    phone: '9324589259',
    emailAddress: 'info@delhipublic.com',
    rollNo: '098767ijhj',
    startDate: '12/04/2014',
    endDate: '01/04/2024',
    classes: 'LKG, UKG,',
    admissionNo: 'AD_DE86BSK',
    branch: 'Eduworm delhi',
    profileImg: 'https://via.placeholder.com/100',
    country: 'India',
    state: 'New Delhi',
    city: 'Rohini sec-7',
    pincode: '110024',
    branchName: "Demo Account",
    branchEmail: "demo@454gmail.com",
    branchPhone: "8943427889",
  };


  const statusList = [
    {
      title: "Student",
      bgColor: "bg-sky-100",
      icon: <GraduationCap strokeWidth={0.75} />,
      value: "100.0k"
    },
    {
      title: "Teacher",
      bgColor: "bg-green-100",
      icon: <User2 strokeWidth={0.75} />,
      value: "25.0k"
    },
    {
      title: "Earnings",
      bgColor: "bg-yellow-100",
      icon: <DollarSign strokeWidth={0.75} />,
      value: "$500,000"
    },
    {
      title: "Classes",
      bgColor: "bg-purple-100",
      icon: <BookOpen strokeWidth={0.75} />,
      value: "120"
    }
  ];
  return (
    <div>
      <div className="max-w-8xl mx-auto mt-10 bg-white rounded-md shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 p-2 bg-sky-100 flex flex-col justify-center items-center">

          <img src={user} alt="" srcset="" className="w-32 h-32 rounded-full object-cover border-2 bg-slate-200 border-white shadow" />

          <h2 className="mt-4 text-lg font-bold text-gray-800">{school.name}</h2>

          <div className="space-x-4 mt-2 flex w-full justify-center items-center my-6">
            <button className='bg-yellow-500 px-4 py-2 cursor-pointer flex text-white rounded-sm gap-2' onClick={() => { navigate(`/eduworm-admin/school/edit/${id}`) }}><Edit />Edit</button>
            <button className='bg-red-500 px-4 py-2 cursor-pointer flex text-white rounded-sm gap-2'><Trash /> Deactivate</button>
          </div>
        </div>

        <div className="md:w-2/3 p-2 px-6 mb-3">
          <h3 className='text-2xl font-semibold text-sky-500 mb-4'>School Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className='mb-2'><span className="font-semibold text-xl">School Name:</span> {school.name || '—'}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Display Name:</span> {school.name || '—'}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Classes :</span> {school.classes || '—'}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Academic Year:</span> {school.rollNo || '—'}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Start Date :</span> {school.startDate}</div>
            <div className='mb-2'><span className="font-semibold text-xl">End Date :</span> {school.endDate || '—'}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Phone Number :</span> {school.phone}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Email Address :</span> {school.emailAddress}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Country :</span> {school.country}</div>
            <div className='mb-2'><span className="font-semibold text-xl">State :</span> {school.state}</div>
            <div className='mb-2'><span className="font-semibold text-xl">City :</span> {school.city}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Pin Code :</span> {school.pincode}</div>
            <div className='mb-2'><span className="font-semibold text-xl">Address :</span> {school.city}</div>
          </div>
        </div>


      </div>
      <div className="max-w-8xl w-full shadow-md rounded-md p-4 mt-10">
        <h1 className='text-3xl text-sky-500 font-semibold'>Branch Admin Information</h1>
        <div className='my-3'><span className="font-semibold text-xl">Branch Name:</span> {school.branchName}</div>
        <div className='my-3'><span className="font-semibold text-xl">Phone Number :</span> {school.branchPhone}</div>
        <div className='my-3'><span className="font-semibold text-xl">Email Address :</span> {school.branchEmail}</div>
      </div>

      <section>
        <div className="max-w-8xl">
          <div className="grid grid-cols-4 py-10 gap-8">

            {
              Array.isArray(statusList) && (
                statusList.map((s, index) => (
                  <div key={index} className={`flex justify-between items-center rounded-md px-2 py-2 max-w-full mb-4 shadow-md ${s.bgColor}`}>
                    <div className="">
                      <h1 className="text-xl font-semibold mb-2">{s.title}</h1>
                      <p className="text-2xl font-bold">{s.value}</p>
                    </div>
                    <div className="p-3 font-light">
                      {s.icon ? React.cloneElement(s.icon, { className: "w-20 h-20" }) : null}
                    </div>

                  </div>
                ))
              )
            }

          </div>

          <div className="max-w-full rounded-2xl grid grid-cols-2 gap-6">
            <Barcharts />
            <PieChart />
          </div>
        </div>
      </section>
    </div>
  )
}
