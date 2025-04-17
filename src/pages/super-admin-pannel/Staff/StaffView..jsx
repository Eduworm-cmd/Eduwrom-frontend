import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import user from "../../../assets/Images/teacher.webp";
import aadhar from "../../../assets/Images/Addhar.webp"
import pan from "../../../assets/Images/pan.webp"

export const StaffView = () => {
  const navigate = useNavigate();
  const staff = {
    firstName: 'Mohan',
    lastName: 'Kumar',
    phoneNumber: '93245859',
    dateOfBirth: '1990-01-15',
    emailAddress: 'mohan294@gmail.com',
    rollNo: '098767ijhj',
    classes: 'LKG, UKG',
    admissionNo: 'AD_DE86BSK',
    branch: 'Eduworm Delhi',
    profileImg: 'https://via.placeholder.com/100',
    country: 'India',
    state: 'New Delhi',
    city: 'Rohini Sec-7',
    pincode: '110024',
    address: '123, Street Name, Rohini Sec-7, New Delhi, 110024',
    nationality: 'Indian',
    religion: 'Hindu',
    aadharNumber: '1234-5678-9012',
    panNumber: 'ABCDE1234F',
    fatherName: 'Ramesh Kumar',
    maritalStatus: 'Single',
    accountNumber: '123456789012',
    bankName: 'State Bank of India',
    nameAsPerBank: 'Mohan Kumar',
    gender: 'Male',
    department: 'Teaching',
    subDepartment: 'Staff Cleaner',
    officialEmail: 'mohan.kumar@eduworm.com',
    bloodGroup: 'B+',
    id: '12345'
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-10">
      {/* Profile Section */}
      <div className="bg-white rounded-md shadow-md flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/3 bg-sky-100 flex flex-col justify-center items-center p-6">
          <img
            src={user}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-white shadow bg-slate-200"
          />
          <h2 className="mt-4 text-lg font-bold text-gray-800">{`${staff.firstName} ${staff.lastName}`}</h2>
          <div className="space-x-4 mt-4 flex">
            <button
              className="bg-yellow-500 cursor-pointer px-4 py-2 text-white rounded-sm flex items-center gap-2"
              onClick={() => navigate(`/eduworm-admin/staff/edit/${staff.id}`)}
            >
              <Edit size={18} /> Edit
            </button>
            <button className="bg-red-500 cursor-pointer px-4 py-2 text-white rounded-sm flex items-center gap-2">
              <Trash size={18} /> Deactivate
            </button>
          </div>
        </div>

        {/* Staff Details */}
        <div className="md:w-2/3 p-6">
          <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Detail label="First Name" value={staff.firstName} />
            <Detail label="Last Name" value={staff.lastName} />
            <Detail label="DOB" value={staff.dateOfBirth} />
            <Detail label="Admission No." value={staff.admissionNo} />
            <Detail label="Branch" value={staff.branch} />
            <Detail label="Phone Number" value={staff.phoneNumber} />
            <Detail label="Email Address" value={staff.emailAddress} />
            <Detail label="Classes" value={staff.classes} />
            <Detail label="Gender" value={staff.gender} />
            <Detail label="Department" value={staff.department} />
            <Detail label="Sub Department" value={staff.subDepartment} />
            <Detail label="Email Id Official" value={staff.officialEmail} />
            <Detail label="Blood Group" value={staff.bloodGroup} />
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white rounded-md shadow-md p-6">
        <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Additional Details</h3>
        <div className="space-y-2">
          <DetailWithHR label="Address" value={staff.address} />
          <DetailWithHR label="Nationality" value={staff.nationality} />
          <DetailWithHR label="Religion" value={staff.religion} />
          <DetailWithHR label="Aadhar Number" value={staff.aadharNumber} />
          <DetailWithHR label="Phone Number" value={staff.phoneNumber} />
          <DetailWithHR label="PAN Number" value={staff.panNumber} />
          <DetailWithHR label="Father's Name" value={staff.fatherName} />
          <DetailWithHR label="Marital Status" value={staff.maritalStatus} />
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-md shadow-md p-6">
        <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Bank Details</h3>
        <div className="space-y-2">
          <DetailWithHR label="Account Number" value={staff.accountNumber} />
          <DetailWithHR label="Name As Per Bank" value={staff.nameAsPerBank} />
          <DetailWithHR label="Bank Name" value={staff.bankName} />
          <DetailWithHR label="Aadhar Number" value={staff.aadharNumber} />
        </div>
      </div>

      {/* Document Section */}
      <div className="bg-white rounded-md shadow-md p-6">
        <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Documents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-lg font-semibold">
              Aadhar Card:
            </div>
            <div className="border-2 w-80 mt-5">
                <img src={aadhar} alt="" />
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold">
              Pan Card:
            </div>
            <div className="border-2 w-80 mt-5">
                <img src={pan} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Reusable detail with <hr />
const DetailWithHR = ({ label, value }) => (
  <>
    <div className="text-lg"><span className="font-semibold">{label}:</span> {value || '—'}</div>
    <hr />
  </>
);

// Simple detail (used in grid without <hr/>)
const Detail = ({ label, value }) => (
  <div className="text-lg">
    <span className="font-semibold">{label}:</span> {value || '—'}
  </div>
);
