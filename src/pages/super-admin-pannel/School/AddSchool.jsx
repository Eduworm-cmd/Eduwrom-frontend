import React, { useState } from "react";
import { Upload } from "lucide-react";
import Select from "react-select";

export const AddSchool = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    displayName: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    startDate: "",
    endDate: "",
    academicYear: "",
    branchName: "",
    branchPhone: "",
    branchEmail: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);

  const classOptions = [
    { value: "Nursery", label: "Nursery" },
    { value: "LKG", label: "LKG" },
    { value: "UKG", label: "UKG" },
    { value: "1st", label: "1st" },
    { value: "2nd", label: "2nd" },
    { value: "3rd", label: "3rd" },
    { value: "4th", label: "4th" },
    { value: "5th", label: "5th" },
  ];

  const academicYearOptions = [
    { value: "AY 2023 - 2024", label: "AY 2023 - 2024" },
    { value: "AY 2024 - 2025", label: "AY 2024 - 2025" },
    { value: "AY 2025 - 2026", label: "AY 2025 - 2026" },
  ];

  const countryOptions = [
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "UK", label: "UK" },
  ];

  const stateOptions = [
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "California", label: "California" },
  ];

  const cityOptions = [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Los Angeles", label: "Los Angeles" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setLogoName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      selectedClasses: selectedClasses.map((c) => c.value),
      logoName,
    };
    console.log("Form submitted:", submissionData);
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "2px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      minHeight: "42px",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "42px",
    }),
  };

  return (
    <div className="">
      <form className="max-w-4xl mx-auto p-6 shadow-md">
        {/* Logo Upload */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            School Logo <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md  p-4 flex flex-col items-center justify-center gap-4">
            {logoPreview && (
              <>
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="h-32 object-contain rounded-md "
                />
                <p className="text-sm text-gray-600">{logoName}</p>
              </>
            )}
            <label className="cursor-pointer w-full text-center flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-md  hover:bg-blue-200 transition">
              <Upload className="w-5 h-5" />
              <span>{logoName || "Upload Logo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* School Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              School Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md  focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Select Classes & Academic Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Select Classes <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              options={classOptions}
              value={selectedClasses}
              onChange={setSelectedClasses}
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <Select
              options={academicYearOptions}
              value={academicYearOptions.find(opt => opt.value === formData.academicYear)}
              onChange={(opt) => handleSelectChange(opt, "academicYear")}
              placeholder="Select Academic Year"
              styles={selectStyles}
            />
          </div>
        </div>

        {/* Start & End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Country <span className="text-red-500">*</span>
            </label>
            <Select
              options={countryOptions}
              value={countryOptions.find(opt => opt.value === formData.country)}
              onChange={(opt) => handleSelectChange(opt, "country")}
              placeholder="Select Country"
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              State <span className="text-red-500">*</span>
            </label>
            <Select
              options={stateOptions}
              value={stateOptions.find(opt => opt.value === formData.state)}
              onChange={(opt) => handleSelectChange(opt, "state")}
              placeholder="Select State"
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <Select
              options={cityOptions}
              value={cityOptions.find(opt => opt.value === formData.city)}
              onChange={(opt) => handleSelectChange(opt, "city")}
              placeholder="Select City"
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
            required
          ></textarea>
        </div>

        {/* Map Preview */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">
            School Location on Map
          </label>
          <div className="w-full h-[200px] overflow-hidden rounded-md  border">
            <iframe
              title="School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2734.2862581827308!2d77.1350949!3d28.693044300000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03ffa2cad31d%3A0xcfc0692e9870bf55!2sEduworm!5e1!3m2!1sen!2sin!4v1744444825160!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </form>

      <div className="max-w-4xl mx-auto p-6 shadow-md mt-10">
        <h1 className="text-4xl text-sky-500 mb-8">Branch Admin Information</h1>
        {/* Branch Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md  focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Phone No <span className="text-red-500">*</span>
            </label>
            <input
              type="phone"
              name="branchPhone"
              value={formData.branchPhone}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="branchEmail"
              value={formData.branchEmail}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md  hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
