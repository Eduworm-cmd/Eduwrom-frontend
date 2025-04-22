import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { SearchableDropdown } from "../SearchableDropdown/SearchableDropdown";

export const Table_Status = ({
  columns,
  data,
  title,
  isDropdown,
  dropdownData,
  handleSearchDropdown,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const paginationRange = () => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
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
      {/* Header */}
      <h1 className="text-xl font-sans font-semibold mb-4">{title}</h1>
      <div className="flex items-center justify-between mb-4">
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
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
      </div>

      {/* Table Container with Horizontal Scrolling */}
      <div className="overflow-x-auto"> {/* This ensures the horizontal scroll */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm min-w-[800px]">
          {/* Table Header */}
          <div className="bg-slate-100 border-b">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              }}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="p-4 text-sm font-semibold text-gray-700"
                >
                  {col.label}
                </div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="bg-white max-h-82 overflow-y-auto custom-scrollbar">
            {currentItems.map((item, index) => (
              <div
                key={index}
                className="grid border-b border-gray-200 hover:bg-gray-50 transition-colors"
                style={{
                  gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                }}
              >
                {columns.map((col, idx) => {
                  let cellContent;

                  // Handle 'status' column rendering
                  if (col.render) {
                    cellContent = col.render(item[col.key], item);
                  } else if (col.key === "status") {
                    const value = item[col.key];
                    let statusText = "";
                    let dotColor = "bg-gray-400";

                    if (typeof value === "boolean") {
                      statusText = value ? "Active" : "Inactive";
                      dotColor = value ? "bg-green-500" : "bg-red-500";
                    } else if (typeof value === "string") {
                      statusText = value;
                      switch (value.toLowerCase()) {
                        case "active":
                          dotColor = "bg-green-500";
                          break;
                        case "inactive":
                        case "expired":
                          dotColor = "bg-red-500";
                          break;
                        case "pending":
                          dotColor = "bg-yellow-500";
                          break;
                        default:
                          dotColor = "bg-gray-400";
                      }
                    }

                    cellContent = (
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${dotColor}`} />
                        <span>{statusText}</span>
                      </div>
                    );
                  } else {
                    cellContent = item[col.key];
                  }

                  return (
                    <div
                      key={col.key}
                      className={`p-4 ${idx === 0 ? "font-medium text-gray-900" : "text-gray-600"}`}
                    >
                      {cellContent}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(indexOfLastItem, filteredData.length)}
          </span>{" "}
          of <span className="font-medium">{filteredData.length}</span> results
        </div>
        <div>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" />
            </button>

            {paginationRange().map((page, index) =>
              page === "..." ? (
                <span
                  key={index}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
                >
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => paginate(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
