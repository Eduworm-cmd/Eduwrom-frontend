import React, { useState } from "react";
import { Pencil, Trash, Search, Eye } from "lucide-react";

const DataTable = ({ columns, data, title, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const filteredData = data.filter((item) =>
    columns.some((col) =>
      item[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white p-6 rounded-md w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold capitalize text-[#FF9800] font-mono tracking-wide">{title}</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white max-w-[250px] p-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          {/* Table Head */}
          <thead className="bg-gradient-to-r from-[#FFC107] to-[#FF9800] text-white">
            <tr className="text-left uppercase tracking-wide">
              <th className="p-3">
                <input type="checkbox" disabled className="cursor-not-allowed" />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="p-3 font-semibold">{col.label}</th>
              ))}
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-100 transition cursor-pointer"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                    className="accent-sky-600 cursor-pointer"
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="p-3 text-gray-700">
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => onView(item)}
                    className="bg-white shadow p-2 rounded-lg border border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white transition"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
