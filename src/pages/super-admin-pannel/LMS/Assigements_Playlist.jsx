import React, { useEffect, useState } from "react";
import { ArrowDownZA, ArrowUpAZ, ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { SearchableDropdown } from "@/components/SearchableDropdown/SearchableDropdown";

const playlistData = [
  {
    id: "P-2090",
    title: "Animals of World",
    description: "Learn about animals",
    activityCount: 5,
    status: "active",
  },
  {
    id: "P-2175",
    title: "Demo Playlist",
    description: "Demo",
    activityCount: 26,
    status: "active",
  },
  {
    id: "P-2088",
    title: "Earth Facts",
    description: "Learn about earth",
    activityCount: 3,
    status: "active",
  },
  {
    id: "P-2618",
    title: "Guransh's Playlist",
    description: "This playlist has all my counselling activities.",
    activityCount: 5,
    status: "active",
  },
  {
    id: "P-2623",
    title: "Letter A to F",
    description: "Ato F",
    activityCount: 4,
    status: "active",
  },
];


const dropdownData = {
  options: [
    [
      { value: 'ay-2024-2025', label: 'AY 2024 - 2025' },
      { value: 'ay-2025-2026', label: 'AY 2025 - 2026' },
      { value: 'ay-2026-2027', label: 'AY 2026 - 2027' },
      { value: 'ay-2027-2028', label: 'AY 2027 - 2028' },
    ],
    [
      { value: "P Nursery", label: "Math" },
      { value: "UKG", label: "UKG" },
      { value: "LKG", label: "LKG" },
      { value: "UKG", label: "UKG" },
    ],
    [
      { value: "Centre Head", label: "Center Head" },
      { value: "Admin", label: "Admin" },
      { value: "Teacher", label: "Teacher" },
    ],
  ],
  placeholders: ["Select a AY", "Select a Grade", "Select a Role"],
  dropdownNum: 3,
};

export const Assigements_Playlist = () => {
  const [checkbox, setCheckbox] = useState();
  const [sort, setSort] = useState("asc");
  const [sortedData, setSortedData] = useState(playlistData);
  const [search, setSearch] = useState("");
  const [popupData, setPopupData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = sortedData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginationRange = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  };

  const paginate = (page) => setCurrentPage(page);

  const handleSearchDropdown = (value) => {
    console.log(value);
  };

  const handleSort = () => {
    const newSort = sort === "asc" ? "desc" : "asc";
    setSort(newSort);
  
    const sorted = [...sortedData].sort((a, b) => {
      return newSort === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
  
    setSortedData(sorted);
  };

  useEffect(() => {
    setSortedData([...playlistData].sort((a, b) => a.title.localeCompare(b.title)));
  }, []);
  
    
  return (
    <div className="">
      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <SearchableDropdown
          onSelect={handleSearchDropdown}
          dropdownProps={dropdownData}
        />
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white max-w-[250px] p-2 pl-10 border rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="p-4">
                <input type="checkbox" />
              </th>
              <th className="p-4 flex gap-2">
                Title Of Playlist
                {sort === "asc" ? (
                  <ArrowUpAZ onClick={handleSort} />
                ) : (
                  <ArrowDownZA onClick={handleSort} />
                )}
              </th>
              <th className="p-4">Description</th>
              <th className="p-4">Activity Count</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {currentItems?.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-4">
                  <input type="checkbox" onClick={()=>setCheckbox(item.id)} />
                </td>
                <td className="p-4">
                  <div className="font-bold text-sky-500">{item.title}</div>
                  <div className="text-xs text-gray-600">{item.id}</div>
                </td>
                <td className="p-4">{item.description}</td>
                <td className="p-4 flex items-center gap-2">
                  {item.activityCount}
                  <Eye
                    className="cursor-pointer text-gray-500 hover:text-black"
                    onClick={() => setPopupData(item)}
                  />
                </td>
                <td className="p-4">
                  <span
                    className={`h-3 w-3 rounded-full inline-block ${item.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                  ></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <ChevronLeft className="h-5 w-5" />
            </button>
            {paginationRange().map((page, idx) => (
              <button
                key={idx}
                onClick={() => paginate(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>

      {/* Popup */}
      {popupData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Activity Details</h2>
              <button onClick={() => setPopupData(null)}>✖️</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b font-semibold text-gray-600">
                  <th className="p-2">#</th>
                  <th className="p-2">Playlist Title</th>
                  <th className="p-2">Activity</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{popupData.title}</td>
                    <td className="p-2">Activity {i + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
