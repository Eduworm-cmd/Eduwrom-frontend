import { Download } from 'lucide-react';
import React from 'react';

const DownloadButton = () => {
  const handleDownload = () => {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'downloaded_page.html';
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 bg-sky-500 text-white py-2 px-4 rounded-sm font-semibold text-sm cursor-pointer"
    >
      <Download size={18} /> Download
    </button>
  );
};

export default DownloadButton;
