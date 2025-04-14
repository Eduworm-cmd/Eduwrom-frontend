import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import DataTable from "@/components/DataTable/DataTable";
import { PlusCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const InvoiceList = () => {
  const navigate = useNavigate();
  const columns = [
    { key: "name", label: "Name" },
    { key: "id", label: "ID" },
    { key: "marks", label: "Marks" },
    { key: "percent", label: "Percent" },
    { key: "year", label: "Year" },
  ];

  const data = [
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
    },
    {
      id: "PRE43187",
      name: "John Millar",
      marks: 1175,
      percent: "92%",
      year: 2014,
    },
    {
      id: "PRE43178",
      name: "Evelyn Harper",
      marks: 1185,
      percent: "98%",
      year: 2014,
    },
    {
      id: "PRE43174",
      name: "Diana Plenty",
      marks: 1165,
      percent: "91%",
      year: 2014,
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

  const handleSearchDropdown = (value) => {
    console.log(value);
  };

  return (
    <div>
      <div className="flex gap-2 justify-end">
        <button 
        onClick={()=>navigate('/eduworm-admin/Create/Invoice')}
        className='flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] text-left bg-sky-500'>
          <PlusCircle /> Add Invoice
        </button>
        <DownloadButton />
        <ExportButton columns={columns} currentItems={data} />

      </div>
      <DataTable
        title={"School List"}
        data={data}
        columns={columns}
        isDropdown={true}
        dropdownData={dropdownData}
        handleSearchDropdown={handleSearchDropdown}
      />
    </div>
  );
};
