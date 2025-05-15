import { FileText } from 'lucide-react';
import React from 'react'
import * as XLSX from 'xlsx'; 

export const ExportButton = ({ columns, currentItems }) => {
    const handleExport = () => {
        const data = currentItems.map((item) =>
            columns.reduce((acc, col) => {
                acc[col.label] = col.render ? col.render(item[col.key], item) : item[col.key];
                return acc;
            }, {})
        );

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, 'table_data.xlsx');
    };

    return (
        <div>
            <button 
            onClick={handleExport}
            className='flex gap-2 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] text-left bg-green-500'>
                <FileText />Export
            </button>
        </div>
    )
}
