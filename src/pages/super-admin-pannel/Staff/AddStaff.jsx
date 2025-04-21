import { CreateStafff } from "@/Network/Super_Admin/auth";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export const AddStaff = () => {
  const [staffData, setStaffData] = useState({
    firstName: "",
    lastName: "",
    DateOfBirth: "",
    PhoneNumber: "",
    EmailID: "",
    Gender: "",
    EmployeeRole: "",
    School: "",
    Branch: "68029baa8337f09336b0cb07",
    EmployeeId: "",
    Title: "",
    DateOfJoining: "",
    EmailIDPersonal: "",
    BloodGroup: "",
    Marital_Status: "",
    Marriage_Anniversary: "",
    Department: "",
    Sub_Department: "",
    Emergency_Contact: "",
    Nationality: "",
    Religion: "",
    Father_Name: "",

    Account_Number: "",
    Name_As_Per_Bank: "",
    Bank_Name: "",
    Bank_Branch: "",
    IFSC_Code: "",
    Current_Address: "",
    Permanent_Address: "",
    Aadhaar_Card: null,
    Pan_card: null,
    Photo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setStaffData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleStaffApi = async (data) => {
    try {
      const response = await CreateStafff(data);
      if (response.message) {
        toast.error(response.message);
      } else {
        toast.success("Registration successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
      console.error("Registration error:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formattedData = {
      firstName: staffData.firstName,
      lastName: staffData.lastName,
      dateOfBirth: staffData.DateOfBirth,
      phoneNumber: staffData.PhoneNumber,
      emailIDOfficial: staffData.EmailID,
      gender: staffData.Gender,
      employeeRole: staffData.EmployeeRole,
      branch: staffData.Branch,
      employeeId: staffData.EmployeeId,
      title: staffData.Title,
      dateOfJoining: staffData.DateOfJoining,
      emailIDPersonal: staffData.EmailIDPersonal,
      bloodGroup: staffData.BloodGroup,
      maritalStatus: staffData.Marital_Status,
      marriageAnniversary: staffData.Marriage_Anniversary,
      department: staffData.Department,
      subDepartment: staffData.Sub_Department,
      emergencyContact: staffData.Emergency_Contact,
      nationality: staffData.Nationality,
      religion: staffData.Religion,
      fatherName: staffData.Father_Name,
      bankDetails: {
        accountNumber: staffData.Account_Number,
        nameAsPerBank: staffData.Name_As_Per_Bank,
        bankName: staffData.Bank_Name,
        bankBranch: staffData.Bank_Branch,
        ifscCode: staffData.IFSC_Code,
      },
      currentAddress: staffData.Current_Address,
      permanentAddress: staffData.Permanent_Address,
    };
  
    console.log("Formatted Payload:", formattedData);
    handleStaffApi(formattedData);
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer/>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <h2 className="md:col-span-2 text-2xl font-bold text-sky-600">
          Staff Information
        </h2>

        <Input
          name="firstName"
          label="First Name"
          value={staffData.firstName}
          onChange={handleChange}
        />
        <Input
          name="lastName"
          label="Last Name"
          value={staffData.lastName}
          onChange={handleChange}
        />
        <Input
          name="DateOfBirth"
          label="Date of Birth"
          type="date"
          value={staffData.DateOfBirth}
          onChange={handleChange}
        />
        <Input
          name="PhoneNumber"
          label="Phone Number"
          value={staffData.PhoneNumber}
          onChange={handleChange}
        />
        <Input
          name="EmailID"
          label="Official Email"
          value={staffData.EmailID}
          onChange={handleChange}
        />
        <Select
          name="Gender"
          label="Gender"
          value={staffData.Gender}
          onChange={handleChange}
          options={["Male", "Female", "Other"]}
        />
        <Select
          name="EmployeeRole"
          label="Employee Role"
          value={staffData.EmployeeRole}
          onChange={handleChange}
          options={["Teacher", "Admin", "Support Staff"]}
        />
        <Select
          name="School"
          label="School"
          value={staffData.School}
          onChange={handleChange}
          options={["Eduworm", "Global Academy"]}
        />
        <Input
          name="Branch"
          label="Branch"
          value={staffData.Branch}
          onChange={handleChange}
        />
        <Input
          name="EmployeeId"
          label="Employee ID"
          value={staffData.EmployeeId}
          onChange={handleChange}
        />
        <Input
          name="Title"
          label="Title"
          value={staffData.Title}
          onChange={handleChange}
        />
        <Input
          name="DateOfJoining"
          label="Date of Joining"
          type="date"
          value={staffData.DateOfJoining}
          onChange={handleChange}
        />
        <Input
          name="EmailIDPersonal"
          label="Personal Email"
          value={staffData.EmailIDPersonal}
          onChange={handleChange}
        />
        <Select
          name="BloodGroup"
          label="Blood Group"
          value={staffData.BloodGroup}
          onChange={handleChange}
          options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
        />
        <Select
          name="Marital_Status"
          label="Marital Status"
          value={staffData.Marital_Status}
          onChange={handleChange}
          options={["Single", "Married", "Widowed", "Divorced"]}
        />
        <Input
          name="Marriage_Anniversary"
          label="Marriage Anniversary"
          type="date"
          value={staffData.Marriage_Anniversary}
          onChange={handleChange}
        />
        <Input
          name="Department"
          label="Department"
          value={staffData.Department}
          onChange={handleChange}
        />
        <Input
          name="Sub_Department"
          label="Sub Department"
          value={staffData.Sub_Department}
          onChange={handleChange}
        />
        <Input
          name="Emergency_Contact"
          label="Emergency Contact"
          value={staffData.Emergency_Contact}
          onChange={handleChange}
        />
        <Input
          name="Nationality"
          label="Nationality"
          value={staffData.Nationality}
          onChange={handleChange}
        />
        <Input
          name="Religion"
          label="Religion"
          value={staffData.Religion}
          onChange={handleChange}
        />
        <Input
          name="Father_Name"
          label="Father's Name"
          value={staffData.Father_Name}
          onChange={handleChange}
        />
      </div>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        <h2 className="md:col-span-2 text-2xl font-bold text-sky-600">
          Staff Bank Details
        </h2>
        <Input
          name="Account_Number"
          label="Account Number"
          value={staffData.Account_Number}
          onChange={handleChange}
        />
        <Input
          name="Name_As_Per_Bank"
          label="Name as per Bank"
          value={staffData.Name_As_Per_Bank}
          onChange={handleChange}
        />
        <Input
          name="Bank_Name"
          label="Bank Name"
          value={staffData.Bank_Name}
          onChange={handleChange}
        />
        <Input
          name="Bank_Branch"
          label="Bank Branch"
          value={staffData.Bank_Branch}
          onChange={handleChange}
        />
        <Input
          name="IFSC_Code"
          label="IFSC Code"
          value={staffData.IFSC_Code}
          onChange={handleChange}
        />
        <Textarea
          name="Current_Address"
          label="Current Address"
          value={staffData.Current_Address}
          onChange={handleChange}
        />
        <Textarea
          name="Permanent_Address"
          label="Permanent Address"
          value={staffData.Permanent_Address}
          onChange={handleChange}
        />
        <FileUpload name="Photo" label="Upload Photo" onChange={handleChange} />
        <FileUpload
          name="Aadhaar_Card"
          label="Upload Aadhaar Card"
          onChange={handleChange}
        />
        <FileUpload
          name="Pan_card"
          label="Upload PAN Card"
          onChange={handleChange}
        />
      </div>

      <div className="md:col-span-2 text-right mt-4">
        <button
          type="submit"
          className="bg-sky-600 text-white px-8 py-2 rounded hover:bg-sky-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

const Input = ({ name, label, value, onChange, type = "text" }) => (
  <div>
    <label className="block mb-2 text-lg font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
    />
  </div>
);

// Reusable Select Component
const Select = ({ name, label, value, onChange, options }) => (
  <div>
    <label className="block mb-2 text-lg font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>{" "}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 mt-1 bg-white focus:ring-2 focus:ring-sky-500 outline-none"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// Reusable Textarea
const Textarea = ({ name, label, value, onChange }) => (
  <div className="md:col-span-2">
    <label className="block mb-2 text-lg font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>{" "}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 p-2 border rounded-md h-28 resize-none focus:ring-2 focus:ring-sky-500 outline-none"
    />
  </div>
);

// Reusable File Upload
const FileUpload = ({ name, label, onChange }) => (
  <div>
    <label className="block mb-2 text-lg font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>{" "}
    <input
      type="file"
      name={name}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
    />
  </div>
);
