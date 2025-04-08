import React from 'react'
import DataTable from '../DataTable/DataTable'

export const Add_Vedio = () => {
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
            <DataTable columns={columns} data={data} title="Add Vedio" />
        </div>
    )
}
