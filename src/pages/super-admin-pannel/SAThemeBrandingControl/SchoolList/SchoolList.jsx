import DataTable from "@/components/DataTable/DataTable";
import React from "react";

export const SchoolList = () => {

  
  const columns = [
    { key: "id", label: "ID" },
    { key: "School name", label: "School Name" },
    { key: "acadmic_year", label: "Acadmic Year" },
    { key: "status", label: "status" },
    { key: "establishedYear", label: "established Year" },
  ];
  
  const data = [
    {
      "id": 1,
      "School name": "Green Valley High School",
      "acadmic_year": "2024-2025",
      "status": "active",
      "establishedYear": 2005
    },
    {
      "id": 2,
      "School name": "Sunrise Public School",
      "acadmic_year": "2023-2024",
      "status": "pending",
      "establishedYear": 2010
    },
    {
      "id": 3,
      "School name": "Riverdale Academy",
      "acadmic_year": "2024-2025",
      "status": "inactive",
      "establishedYear": 1998
    },
    {
      "id": 4,
      "School name": "Bright Future International",
      "acadmic_year": "2024-2025",
      "status": "active",
      "establishedYear": 2015
    }
  ]
  
  return (
    <div className="w-full border rounded-md">
      <DataTable columns={columns} data={data} title={'School List'} />
    </div>
  );
};
