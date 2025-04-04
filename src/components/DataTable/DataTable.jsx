import React, { useState } from "react";
import { Pencil, Trash, Search, Eye } from "lucide-react";

const DataTable = ({ columns, data, title, onEdit, onDelete }) => {
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
    <div className="p-4 bg-white rounded-lg border w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-4 uppercase text-gray-800 font-mono">{title}</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-[200px] p-2 border rounded-full pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      <table className="w-full border-collapse rounded-2xl">
        <thead className="bg-sky-600 text-white">
          <tr className="border-b text-left">
            <th className="p-2">
              <input type="checkbox" disabled />
            </th>
            {columns.map((col) => (
              <th key={col.key} className="p-4 text-gray-800">{col.label}</th>
            ))}
            <th className="p-4 text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                  className="accent-purple-600"
                />
              </td>
              {columns.map((col) => (
                <td key={col.key} className="p-3">
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
              <td className="p-3 flex  justify-start">
                <button onClick={() => onEdit(item)} className="bg-white shadow-lg p-3 rounded-full border text-sky-600 hover:text-sky-800 cursor-pointer">
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
