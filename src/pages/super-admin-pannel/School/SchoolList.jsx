import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import DownloadButton from "@/components/Buttons/DownloadButton/DownloadButton";
import { ExportButton } from "@/components/Buttons/ExportButton/ExportButton";
import Table from "../Staff/Table";

export const SchoolList = () => {
  const navigate = useNavigate();
  
  const [schoolData, setSchoolData] = useState([
    {
      id: 1,
      AY: "PRE43178",
      name: "Evelyn Harper",
      StartDate: "31/03/2025",
      EndDate: "01/04/2024",
      Subscription: "2014 - 2017",
      phone: "9988776655",
      email: "davidb@example.com",
      status: true,
    },
    {
      id: 2,
      AY: "PRE43174",
      name: "Diana Plenty",
      StartDate: "31/03/2025",
      EndDate: "01/04/2024",
      phone: "9988776655",
      email: "davidb@example.com",
      status: false,
    },
    {
      id: 3,
      AY: "PRE43179",
      name: "Adam Smith",
      StartDate: "01/04/2025",      
      EndDate: "01/04/2024",
      phone: "9988776655",
      email: "davidb@example.com",
      status: true,
    },
    {
      id: 4,
      AY: "PRE43175",
      name: "Samantha Ray",
      StartDate: "01/04/2025",
      EndDate: "01/04/2024",
      Subscription: "2016 - 2019",
      status: false,
    },
    {
      id: 5,
      AY: "PRE43176",
      name: "John Doe",
      StartDate: "31/03/2025",
      EndDate: "01/04/2024",
      Subscription: "2014 - 2017",
      status: true,
    },
    {
      id: 6,
      AY: "PRE43177",
      name: "Jane Doe",
      StartDate: "31/03/2025",
      EndDate: "01/04/2024",
      Subscription: "2014 - 2017",
      status: false,
    },
    {
      id: 7,
      AY: "PRE43180",
      name: "Michael Blue",
      StartDate: "31/03/2025",
      EndDate: "01/04/2024",
      Subscription: "2014 - 2017",
      status: true,
    },
    {
      id: 8,
      AY: "PRE43181",
      name: "Lisa Green",
      StartDate: "31/03/2025",
      EndDate: "01/04/2024",
      Subscription: "2014 - 2017",
      status: false,
    },
    {
      id: 9,
      AY: "PRE43180",
      name: "Michael Blue",
      StartDate: "31/03/2025",
      EndDate: "01/04/2024",
      Subscription: "2014 - 2017",
      status: true,
    },
    {
      id: 10,
      AY: "PRE43181",
      name: "Lisa Green",
      StartDate: "31/03/2025",
      EndDate: "01/04/2024",
      phone: "9988776655",
      email: "davidbrown@example.com",
      status: false,
    },
  ]);


  const columns = [
    { key: "name", label: "School Name" },
    {
      key: "contact",
      label: "Contact",
      render: (value, row) => (
        <div>
          <div>{row.email}</div>
          <div>{row.phone}</div>
        </div>
      ),
    },
    { key: "StartDate", label: "Start Date" },
    { key: "EndDate", label: "End Date" },
    { key: "AY", label: "Academic Year" },
  ];

  const dropdownData = {
    options: [
      [
        { value: "ay-2024-2025", label: "AY 2024 - 2025" },
        { value: "ay-2025-2026", label: "AY 2025 - 2026" },
        { value: "ay-2026-2027", label: "AY 2026 - 2027" },
        { value: "ay-2027-2028", label: "AY 2027 - 2028" },
      ],
      [
        { value: "P Nursery", label: "Math" },
        { value: "UKG", label: "UKG" },
        { value: "LKG", label: "LKG" },
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
    console.log("Selected Dropdown Values:", value);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      setSchoolData((prevData) => prevData.filter((d) => d.id !== item.id));
    }
  };

  const handleToggleStatus = (item) => {
    setSchoolData((prevData) =>
      prevData.map((d) =>
        d.id === item.id ? { ...d, status: !d.status } : d
      )
    );
  };

  return (
    <div>
      <div className="flex gap-2 justify-end mb-3">
        <button
          onClick={() => navigate("/eduworm-admin/school/add")}
          className="flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] bg-sky-500"
        >
          <PlusCircle /> Add School
        </button>
        <DownloadButton />
        <ExportButton columns={columns} currentItems={schoolData} />
      </div>

      <Table
        title=""
        data={schoolData}
        columns={columns}
        isDropdown={true}
        dropdownData={dropdownData}
        handleSearchDropdown={handleSearchDropdown}
        onToggleStatus={handleToggleStatus}
        actionMenu={[
          {
            label: "Edit",
            url: (item) => `/eduworm-admin/school/edit/${item.id}`,
          },
          {
            label: "View",
            url: (item) => `/eduworm-admin/school/view/${item.id}`,
          },
          {
            label: "Delete",
            onClick: (item) => handleDelete(item),
          },
        ]}
      />
    </div>
  );
};
