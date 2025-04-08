import DataTable from '@/components/DataTable/DataTable'
import React from 'react'

export const Content_Manage = () => {
    const columns = [
        { key: "name", label: "Name" },
        { key: "id", label: "ID" },
        { key: "marks", label: "Marks" },
        { key: "percent", label: "Percent" },
        { key: "year", label: "Year" },
    ];

    const data = [
        { id: "PRE43178", name: "Evelyn Harper", marks: 1185, percent: "98%", year: 2014 },
        { id: "PRE43174", name: "Diana Plenty", marks: 1165, percent: "91%", year: 2014 },
        { id: "PRE43187", name: "John Millar", marks: 1175, percent: "92%", year: 2014 },
    ];

  return (
    <div>
      <h1>Lesson Management</h1>
      <p>This is the Lesson Management page</p>
      <DataTable title={"Add Lessons"} columns={columns} data={data}/>
    </div>
  )
}
