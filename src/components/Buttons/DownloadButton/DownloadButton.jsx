import { Download } from 'lucide-react'
import React from 'react'

const DownloadButton = () => {
    const handleDownload = () =>{
        const htmlContent = document.documentElement.outerHTML;

        const blob = new Blob([htmlContent],{ type: "text/html" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "downloaded_page.html"; 
        link.click();
    }
    return (
        <div>
            <button
            onClick={handleDownload}
            className='flex gap-2 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] text-left bg-sky-500'>
                <Download /> Download
            </button>
        </div>
    )
}

export default DownloadButton
