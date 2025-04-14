import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react"; // Import Lucide Icons
import { SearchableDropdown } from "../SearchableDropdown/SearchableDropdown";

const DataTable = ({
  columns,
  data,
  title,
  onView,
  onDelete,
  isDropdown,
  dropdownData,
  handleSearchDropdown,
  actionButtons,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper function for pagination range (with ellipsis)
  const paginationRange = () => {
    const range = [];

    // If there are fewer than 5 pages, show all pages
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);

      if (currentPage > 3) {
        range.push("...");
      }

      const start = Math.max(currentPage - 1, 2);
      const end = Math.min(currentPage + 1, totalPages - 1);

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (currentPage < totalPages - 2) {
        range.push("...");
      }

      if (totalPages > 1) {
        range.push(totalPages);
      }
    }

    return range;
  };

  return (
    <div className="bg-white rounded-md w-full">
      {/* Header Section */}
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
            className="w-full bg-white max-w-[250px] p-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
      </div>

      {/* Table Section - Modernized design */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="bg-slate-100 border-b">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${
                columns.length + 1
              }, minmax(0, 1fr))`,
            }}
          >
            {columns.map((col, idx) => {
              const colWidth = idx === 0 ? "2fr" : idx === 2 ? "4fr" : "3fr";

              return (
                <div
                  key={col.key}
                  className="p-4 text-sm font-semibold text-gray-700"
                  style={{ gridColumn: `span 1 / span 1` }}
                >
                  {col.label}
                </div>
              );
            })}
            <div className="p-4 text-center text-sm font-medium text-gray-700">
              Actions
            </div>
            {/* <div className="p-4 text-center text-sm font-medium text-gray-700">
              Actions
            </div> */}
          </div>
        </div>

        {/* Table Body */}
        <div className="bg-white max-h-82 overflow-y-auto custom-scrollbar ">
          {currentItems.map((item, index) => (
            <div
              key={index}
              className="grid border-b border-gray-200 hover:bg-gray-50 transition-colors"
              style={{
                gridTemplateColumns: `repeat(${
                  columns.length + 1
                }, minmax(0, 1fr))`,
              }}
            >
              {columns.map((col, idx) => {
                // Use inline styles for dynamic column sizing
                const colWidth = idx === 0 ? "2fr" : idx === 2 ? "4fr" : "3fr";

                const cellContent = col.render
                  ? col.render(item[col.key], item)
                  : item[col.key];
                const isName = idx === 0;

                return (
                  <div
                    key={col.key}
                    className={`p-4 ${
                      isName ? "font-medium text-gray-900" : "text-gray-600"
                    }`}
                    style={{ gridColumn: `span 1 / span 1` }}
                  >
                    {cellContent}
                  </div>
                );
              })}
              <div className="p-4 flex justify-center">
                {actionButtons.map((button, idx) => {
                  const Icon = button.icon;
                  return (
                    <button
                      key={idx}
                      className={`py-2 px-4 rounded mr-2 ${
                        button.className
                      }`}
                      onClick={() => button.onClick(item)}
                      title={button.label} // optional tooltip
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-4 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            onClick={() => paginate(currentPage - 1)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={currentPage === 1}
          >
            Previous
          </a>
          <a
            href="#"
            onClick={() => paginate(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={currentPage === totalPages}
          >
            Next
          </a>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              aria-label="Pagination"
              className="isolate inline-flex -space-x-px rounded-md shadow-xs"
            >
              <a
                href="#"
                onClick={() => paginate(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </a>

              {/* Render Pagination Range */}
              {paginationRange().map((page, index) =>
                page === "..." ? (
                  <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
                  >
                    ...
                  </span>
                ) : (
                  <a
                    key={index}
                    href="#"
                    onClick={() => paginate(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </a>
                )
              )}

              <a
                href="#"
                onClick={() => paginate(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
