import React, { useState } from 'react'

export const AddSchoolForm = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCode: "",
    type: "",
    board: "",
    establishedYear: "",

    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    latitude: "",
    longitude: "",

    contactPersonName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    website: "",

    logoUrl: "",
    faviconUrl: "",
    themeColorPrimary: "",
    themeColorSecondary: "",

    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",

    status: "",
    isApproved: false,
    createdBy: "",
    createdAt: "",
    updatedAt: "",

    affiliationNumber: "",
    totalStudents: "",
    totalTeachers: "",
    schoolMedium: "",
    timezone: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-md font-semibold">Basic Info</h2>

      <div className='grid grid-cols-2 gap-4'>
      <input  name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="School Name" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="schoolCode" value={formData.schoolCode} onChange={handleChange} placeholder="School Code" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="type" value={formData.type} onChange={handleChange} placeholder="Type" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="board" value={formData.board} onChange={handleChange} placeholder="Board" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="establishedYear" value={formData.establishedYear} onChange={handleChange} placeholder="Established Year" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>

      <h2 className="text-md font-semibold">Address</h2>
      <div className='grid grid-cols-3 gap-4'>
      <input  name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>

      <h2 className="text-md font-semibold">Contact</h2>
      <div className='grid grid-cols-3 gap-4'>
      <input  name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} placeholder="Contact Person Name" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} placeholder="Alternate Phone" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="website" value={formData.website} onChange={handleChange} placeholder="Website" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>

      <h2 className="text-md font-semibold">Admin Info</h2>
      <div className='grid grid-cols-2 gap-4'>
      <input  name="adminName" value={formData.adminName} onChange={handleChange} placeholder="Admin Name" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="adminEmail" value={formData.adminEmail} onChange={handleChange} placeholder="Admin Email" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="adminPhone" value={formData.adminPhone} onChange={handleChange} placeholder="Admin Phone" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="adminPassword" type="password" value={formData.adminPassword} onChange={handleChange} placeholder="Admin Password" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>

      <h2 className="text-md font-semibold">Additional Details</h2>
      <div  className='grid grid-cols-2 gap-4'>
      <input  name="affiliationNumber" value={formData.affiliationNumber} onChange={handleChange} placeholder="Affiliation Number" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="totalStudents" value={formData.totalStudents} onChange={handleChange} placeholder="Total Students" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="totalTeachers" value={formData.totalTeachers} onChange={handleChange} placeholder="Total Teachers" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="schoolMedium" value={formData.schoolMedium} onChange={handleChange} placeholder="School Medium" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      <input  name="timezone" value={formData.timezone} onChange={handleChange} placeholder="Timezone" className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>

      <button type="submit" className="bg-primary  text-white px-6 py-2 rounded">
        Submit And Next
      </button>
    </form>
  );
}
