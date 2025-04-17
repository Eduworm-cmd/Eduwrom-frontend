import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchableDropdown } from "@/components/SearchableDropdown/SearchableDropdown";

const Table = ({
  columns,
  data,
  title,
  isDropdown,
  dropdownData,
  handleSearchDropdown,
  onToggleStatus,
  actionMenu = [],
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionId, setActiveActionId] = useState(null);
  const itemsPerPage = 6;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleActions = (id) => {
    setActiveActionId((prevId) => (prevId === id ? null : id));
  };

  const filteredData = data.filter((item) =>
    columns.some((col) =>
      item[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const paginationRange = () => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push("...");
      const start = Math.max(currentPage - 1, 2);
      const end = Math.min(currentPage + 1, totalPages - 1);
      for (let i = start; i <= end; i++) range.push(i);
      if (currentPage < totalPages - 2) range.push("...");
      range.push(totalPages);
    }
    return range;
  };

  return (
    <div className="bg-white rounded-md w-full">
      {title && <h1 className="text-xl font-semibold mb-2">{title}</h1>}

      <div className="flex items-center justify-between mb-4 bg-blue-400 rounded-sm shadow-md px-2 py-2">
        {isDropdown && (
          <SearchableDropdown
            onSelect={handleSearchDropdown}
            dropdownProps={dropdownData}
          />
        )}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white max-w-[250px] p-2 pl-10 border rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-300">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item, index) => {
              const isLastTwo = index >= currentItems.length - 2;
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors relative">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700 font-medium">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}

                  {/* Actions */}
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => handleActions(item.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Actions
                    </button>
                    {activeActionId === item.id && (
                      <div
                        className={`absolute z-20 bg-white border rounded-sm shadow-md min-w-[120px] ${
                          isLastTwo ? "bottom-full mb-1" : "top-full mt-1"
                        } left-1/2 -translate-x-1/2`}
                      >
                        {actionMenu.map((action, idx) => (
                          <button
                            key={idx}
                            className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-sm"
                            onClick={() => {
                              if (action.onClick) action.onClick(item);
                              if (action.url) {
                                const destination =
                                  typeof action.url === "function" ? action.url(item) : action.url;
                                navigate(destination);
                              }
                              setActiveActionId(null);
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.status}
                        onChange={() => onToggleStatus(item)}
                      />
                      <div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none peer-checked:bg-blue-600 rounded-full">
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> of{" "}
          <span className="font-medium">{filteredData.length}</span> results
        </div>

        <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {paginationRange().map((page, idx) =>
            page === "..." ? (
              <span key={idx} className="px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300">
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => paginate(page)}
                className={`px-4 py-2 text-sm font-semibold ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Table;
