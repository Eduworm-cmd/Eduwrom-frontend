
import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import { Header } from "@/components/Header/Header";


export const Layout = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white h-full w-full md:w-[50%] rounded-sm relative">
        <Header />
        {/* Content section with padding to avoid overlap */}
        <div className="mt-[14rem] custom-scrollbar-teacher h-[calc(100vh-14rem)] overflow-y-auto p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
