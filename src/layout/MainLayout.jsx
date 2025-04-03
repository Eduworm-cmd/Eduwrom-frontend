import React from 'react'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
    return (
        <div>
            <div className="flex justify-center items-center h-screen ">
                <div className="bg-white h-full w-full md:w-[50%] rounded-sm relative">
                    {/* Content section with padding to avoid overlap */}
                    <div className="mt-1 custom-scrollbar h-full overflow-auto p-2">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
