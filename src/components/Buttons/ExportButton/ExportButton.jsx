import { FileText } from 'lucide-react';
import React from 'react';
import * as XLSX from 'xlsx';

export const ExportButton = ({ columns = [], currentItems = [] }) => {
  const handleExport = () => {
    const data = currentItems.map((item) =>
      columns.reduce((acc, col) => {
        const key = col.dataIndex || col.key;

        // If there's a render function, attempt to get text content safely
        let value;
        if (col.render) {
          const rendered = col.render(item[key], item);

          // If it's a string/number, keep it; otherwise, fallback to raw data
          value = typeof rendered === 'string' || typeof rendered === 'number' ? rendered : item[key];
        } else {
          value = item[key];
        }

        acc[col.title] = value;
        return acc;
      }, {})
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'staff_data.xlsx');
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-sm font-semibold text-sm cursor-pointer"
    >
      <FileText size={18} /> Export
    </button>
  );
};
