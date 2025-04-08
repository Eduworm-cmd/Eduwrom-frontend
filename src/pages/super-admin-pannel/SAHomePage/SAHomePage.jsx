import React from "react";
import { GraduationCap, User, Users, DollarSign } from "lucide-react";
import Barcharts from "@/components/Charts/Barcharts";
import { RadialCharts } from "@/components/Charts/RadialCharts";
import DataTable from "@/components/DataTable/DataTable";

const stats = [
  {
    title: "Students",
    value: "15.00K",
    icon: <GraduationCap className="text-purple-500" size={30} />,
    bgColor: "bg-purple-100",
  },
  {
    title: "Teachers",
    value: "2.00K",
    icon: <User className="text-sky-600" size={30} />,
    bgColor: "bg-blue-50",
  },
  {
    title: "Parents",
    value: "5.6K",
    icon: <Users className="text-orange-500" size={30} />,
    bgColor: "bg-orange-50",
  },
  {
    title: "Earnings",
    value: "$19.3K",
    icon: <DollarSign className="text-green-500" size={30} />,
    bgColor: "bg-green-50",
  },

];



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

export const SAHomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-6 bg-muted/50 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-4 py-6 rounded-lg  ${stat.bgColor}`}
            >

              <div >
                <p className="text-gray-600 text-md font-semibold ">{stat.title}</p>
                <h3 className="text-2xl text-gray-700 font-bold">{stat.value}</h3>
              </div>
              <div className="p-3  rounded-full ">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 bg-muted/50 rounded-2xl grid grid-cols-2 gap-6">
          <Barcharts/>
          <RadialCharts/>
      </div>
      <div className="p-6 bg-muted/50 rounded-2xl">
          <DataTable columns={columns} data={data} title="Star Student"/>
      </div>
    </div>
  );
};
