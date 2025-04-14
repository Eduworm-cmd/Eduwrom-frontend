import { PlusCircle, Trash2 } from "lucide-react";
import React, { useState } from "react";

export const AddStudent = () => {
  const [familyMembers, setFamilyMembers] = useState([0]);
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    date: '',
    gender: '',
    school: '',
    admissionNumber: '',
    rollNo: '',
    dateOfJoining: '',
    enrollmentStatus: '',
    bloodGroup: '',
    studentPhoto: null,
    academicYear: '',
    grade: '',
    className: ''
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleAddMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        firstName: '',
        lastName: '',
        email: '',
        relationship: '',
        phone: '',
        address: '',
        photo: null,
      },
    ]);
  };

  const handleRemoveMember = (index) => {
    const updated = [...familyMembers];
    updated.splice(index, 1);
    setFamilyMembers(updated);
  };

  const handleMemberChange = (index, e) => {
    const { name, value, type, files } = e.target;
    const updated = [...familyMembers];
    updated[index] = {
      ...updated[index],
      [name]: type === 'file' ? files[0] : value,
    };
    setFamilyMembers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Family Members Data:', familyMembers);
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold text-sky-500 mb-6">Student Information</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          <div>
            <label className="block font-medium">First Name<span className="text-red-500 ml-2">*</span></label>
            <input name="firstName" onChange={handleChange} value={studentData.firstName} type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          </div>

          <div>
            <label className="block font-medium">Last Name</label>
            <input name="lastName" onChange={handleChange} value={studentData.lastName} type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          </div>

          <div>
            <label className="block font-medium">Date Of Birth</label>
            <input name="date" onChange={handleChange} value={studentData.date} type="date" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          </div>

          <div>
            <label className="block font-medium">Gender</label>
            <select name="gender" onChange={handleChange} value={studentData.gender} className="w-full border rounded px-3 py-2 mt-1">
              <option>Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">School</label>
            <select name="school" onChange={handleChange} value={studentData.school} className="w-full border rounded px-3 py-2 mt-1">
              <option>Eduworm</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Admission Number</label>
            <input name="admissionNumber" onChange={handleChange} value={studentData.admissionNumber} type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          </div>

          <div>
            <label className="block font-medium">Roll No</label>
            <input name="rollNo" onChange={handleChange} value={studentData.rollNo} type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          </div>

          <div>
            <label className="block font-medium">Date of Joining</label>
            <input name="dateOfJoining" onChange={handleChange} value={studentData.dateOfJoining} type="date" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          </div>

          <div>
            <label className="block font-medium">Enrollment Status</label>
            <input name="enrollmentStatus" onChange={handleChange} value={studentData.enrollmentStatus} type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          </div>

          <div>
            <label className="block font-medium">Blood Group</label>
            <select name="bloodGroup" onChange={handleChange} value={studentData.bloodGroup} className="w-full border rounded px-3 py-2 mt-1">
              <option>Select</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Photo</label>
            <input name="studentPhoto" onChange={handleChange} type="file" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          </div>
        </form>

        <p className="block font-medium">Current Class</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-1">
          <input placeholder="Academic Year" name="academicYear" onChange={handleChange} value={studentData.academicYear} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          <input placeholder="Grade" name="grade" onChange={handleChange} value={studentData.grade} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
          <input placeholder="Class" name="className" onChange={handleChange} value={studentData.className} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none mt-1" />
        </div>
      </div>


      {/* Family Information */}
      <div className="py-8">
        <button
          onClick={handleAddMember}
          className="flex gap-2 text-white py-2 px-5 bg-sky-500 rounded-sm font-semibold text-sm mb-4"
        >
          <PlusCircle size={18} /> Add Member
        </button>

        {familyMembers.map((member, index) => (
          <div
            key={index}
            className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-4 relative"
          >
            <h2 className="text-xl font-bold text-sky-500 mb-6">Family Member #{index + 1}</h2>

            <button
              onClick={() => handleRemoveMember(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              title="Remove Member"
            >
              <Trash2 />
            </button>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-medium">
                  First Name<span className="text-red-500 ml-2">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={member.firstName}
                  onChange={(e) => handleMemberChange(index, e)}
                  className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={member.lastName}
                  onChange={(e) => handleMemberChange(index, e)}
                  className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={member.email}
                  onChange={(e) => handleMemberChange(index, e)}
                  className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium">
                  Relationship<span className="text-red-500 ml-2">*</span>
                </label>
                <select
                  name="relationship"
                  value={member.relationship}
                  onChange={(e) => handleMemberChange(index, e)}
                  className="w-full border rounded px-3 py-2 mt-1 bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={member.phone}
                  onChange={(e) => handleMemberChange(index, e)}
                  className="w-full border rounded px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium">Upload Photo</label>
                <input
                  type="file"
                  name="photo"
                  onChange={(e) => handleMemberChange(index, e)}
                  className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium">Current Address</label>
                <textarea
                  name="address"
                  value={member.address}
                  onChange={(e) => handleMemberChange(index, e)}
                  className="w-full mt-1 p-2 border rounded-md h-32 resize-none focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Type here..."
                />
              </div>
            </form>
          </div>
        ))}

        <div className="w-full flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="flex gap-2 text-white py-2 px-8 bg-sky-500 rounded-sm font-semibold text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

