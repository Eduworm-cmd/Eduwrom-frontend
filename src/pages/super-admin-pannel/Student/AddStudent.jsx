import { PlusCircle, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export const AddStudent = () => {
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classList, setClassList] = useState([]);

  const [familyMembers, setFamilyMembers] = useState([]);

  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    date: '',
    gender: '',
    school: '',
    schoolBranch: '',
    rollNo: '',
    admissionNumber: '',
    dateOfJoining: '',
    enrollmentStatus: '',
    bloodGroup: '',
    studentPhoto: null,
    academicYear: '',
    grade: '',
    className: '',
    class: ''
  });

  useEffect(() => {
    fetchSchools();
    fetchClassDropdown();
  }, []);

  useEffect(() => {
    if (studentData.school) {
      fetchBranches(studentData.school);
    }
  }, [studentData.school]);

  const fetchSchools = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/school/dropdown");
      const data = await res.json();
      setSchools(data?.data || []);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const fetchBranches = async (schoolId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth_SchoolBranch/${schoolId}`);
      const data = await res.json();
      setBranches(data?.data || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const fetchClassDropdown = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/class/dropdown");
      const data = await res.json();
      setClassList(data?.data || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", studentData.firstName);
    formData.append("lastName", studentData.lastName);
    formData.append("dateOfBirth", studentData.date);
    formData.append("gender", studentData.gender);
    formData.append("school", studentData.school);
    formData.append("schoolBranch", studentData.schoolBranch);
    formData.append("admissionNumber", studentData.admissionNumber);
    formData.append("rollNo", studentData.rollNo);
    formData.append("dateOfJoining", studentData.dateOfJoining);
    formData.append("enrollmentStatus", studentData.enrollmentStatus);
    formData.append("bloodGroup", studentData.bloodGroup);
    formData.append("academicYear", studentData.academicYear);
    formData.append("grade", studentData.grade);
    formData.append("class", studentData.class);
    if (studentData.studentPhoto) {
      formData.append("photo", studentData.studentPhoto);
    }

    familyMembers.forEach((member, index) => {
      for (const key in member) {
        formData.append(`parents[${index}][${key}]`, member[key]);
      }
    });

    try {
      const res = await fetch("http://localhost:4000/api/students/createStudent", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log("Success:", result);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-bold text-sky-500 mb-4">Student Information</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 shadow rounded">
        {/* Personal Info */}
        <input name="firstName" onChange={handleChange} value={studentData.firstName} placeholder="First Name" className="border p-2 rounded" />
        <input name="lastName" onChange={handleChange} value={studentData.lastName} placeholder="Last Name" className="border p-2 rounded" />
        <input name="date" type="date" onChange={handleChange} value={studentData.date} className="border p-2 rounded" />
        <select name="gender" onChange={handleChange} value={studentData.gender} className="border p-2 rounded">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {/* School & Class Info */}
        <select name="school" onChange={handleChange} value={studentData.school} className="border p-2 rounded">
          <option value="">Select School</option>
          {schools.map((s) => <option key={s._id} value={s._id}>{s.schoolName}</option>)}
        </select>

        <select name="schoolBranch" onChange={handleChange} value={studentData.schoolBranch} className="border p-2 rounded">
          <option value="">Select Branch</option>
          {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>

        <input name="admissionNumber" onChange={handleChange} value={studentData.admissionNumber} placeholder="Admission Number" className="border p-2 rounded" />
        <input name="rollNo" onChange={handleChange} value={studentData.rollNo} placeholder="Roll Number" className="border p-2 rounded" />
        <input name="dateOfJoining" type="date" onChange={handleChange} value={studentData.dateOfJoining} className="border p-2 rounded" />
        <input name="enrollmentStatus" onChange={handleChange} value={studentData.enrollmentStatus} placeholder="Enrollment Status" className="border p-2 rounded" />

        <select name="bloodGroup" onChange={handleChange} value={studentData.bloodGroup} className="border p-2 rounded">
          <option value="">Select Blood Group</option>
          <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
          <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
        </select>

        <input name="studentPhoto" type="file" onChange={handleChange} className="border p-2 rounded" />

        {/* Class Details */}
        <input name="academicYear" onChange={handleChange} value={studentData.academicYear} placeholder="Academic Year" className="border p-2 rounded" />
        <input name="grade" onChange={handleChange} value={studentData.grade} placeholder="Grade" className="border p-2 rounded" />
        
        <select name="class" onChange={handleChange} value={studentData.class} className="border p-2 rounded">
          <option value="">Select Class</option>
          {classList.map((c) => <option key={c._id} value={c._id}>{c.className}</option>)}
        </select>
      </form>

      {/* Family Members */}
      <div className="mt-8">
        <button onClick={handleAddMember} className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded">
          <PlusCircle size={18} /> Add Family Member
        </button>

        {familyMembers.map((member, index) => (
          <div key={index} className="mt-4 bg-white p-4 shadow rounded relative">
            <button onClick={() => handleRemoveMember(index)} className="absolute right-4 top-4 text-red-600">
              <Trash2 />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" value={member.firstName} onChange={(e) => handleMemberChange(index, e)} placeholder="First Name" className="border p-2 rounded" />
              <input name="lastName" value={member.lastName} onChange={(e) => handleMemberChange(index, e)} placeholder="Last Name" className="border p-2 rounded" />
              <input name="email" value={member.email} onChange={(e) => handleMemberChange(index, e)} placeholder="Email" className="border p-2 rounded" />
              <select name="relationship" value={member.relationship} onChange={(e) => handleMemberChange(index, e)} className="border p-2 rounded">
                <option value="">Select Relationship</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Guardian</option>
              </select>
              <input name="phone" value={member.phone} onChange={(e) => handleMemberChange(index, e)} placeholder="Phone" className="border p-2 rounded" />
              <input name="photo" type="file" onChange={(e) => handleMemberChange(index, e)} className="border p-2 rounded" />
              <textarea name="address" value={member.address} onChange={(e) => handleMemberChange(index, e)} placeholder="Address" className="border p-2 rounded col-span-2"></textarea>
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-6">
          <button onClick={handleSubmit} className="bg-sky-600 text-white px-6 py-2 rounded shadow">Submit</button>
        </div>
      </div>
    </div>
  );
};
