import React, { useState } from "react";

export const WorkSheet = () => {
  const [worksheetData, setWorkSheetData] = useState({
    title: "",
    class: "",
    description: "",
    category: "",
    subCategory: "",
    worksheet: "",
  });

  const classes = [
    { name: "LKG", value: "LKG" },
    { name: "UKG", value: "UKG" },
    { name: "Nursary", value: "nursary" },
    { name: "Playgroup", value: "playgroup" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumbnail") {
      setWorkSheetData((prevData) => ({
        ...prevData,
        thumbnail: files[0] || null,
      }));
    } else {
      setGamesData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(worksheetData);
  };

  return (
    <div>
      <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold text-sky-500 mb-6">
          Add Games Information
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              onChange={handleChange}
              value={worksheetData.title}
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              name="class"
              onChange={handleChange}
              value={worksheetData.class}
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
              required
            >
              <option value="">Select Class</option>
              {classes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              value={worksheetData.description}
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
              rows={4}
              // required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>{" "}
            <select
              name="category"
              onChange={handleChange}
              value={worksheetData.category}
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
              required
            >
              <option value="">Select Category</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Sub Category <span className="text-red-500">*</span>
            </label>{" "}
            <select
              onChange={handleChange}
              value={worksheetData.subCategory}
              name="subCategory"
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
              required
            >
              <option value="">Select subCategory</option>
              <option value="Math">Numreacy</option>
              <option value="Science">Language</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-lg font-medium text-gray-700">
              WorkSheet <span className="text-red-500">*</span>
            </label>{" "}
            <input
              name="thumbnail"
              onChange={handleChange}
              type="file"
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>

          <div className="md:col-span-2 mt-12 space-x-2 text-right">
            <button
              onClick={() => window.history.back()}
              type="submit"
              className="bg-slate-100 font-semibold cursor-pointer text-black border-2 px-6 py-2 rounded hover:bg-slate-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-sky-500 text-white font-semibold cursor-pointer px-6 py-2 rounded hover:bg-sky-600"
            >
              Add WorkSheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
