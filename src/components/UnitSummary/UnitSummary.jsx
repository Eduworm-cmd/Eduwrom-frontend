import React, { useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";

const unit_1 = [
  { title: "Curriculum Goals", date: "16th February 2024" },
  { title: "Weekly Planner", date: "16th February 2024" },
  { title: "Parent Manual", date: "16th February 2024" },
  { title: "Time Table", date: "16th February 2024" },
];
const unit_2 = [
  { title: "Curriculum Goals", date: "16th February 2024" },
  { title: "Parent Manual", date: "16th February 2024" },
  { title: "Time Table", date: "16th February 2024" },
];
const unit_3 = [
  { title: "Curriculum Goals", date: "16th February 2024" },
  { title: "Weekly Planner", date: "16th February 2024" },
];
const unit_4 = [
  { title: "Curriculum Goals", date: "16th February 2024" },
  { title: "Weekly Planner", date: "16th February 2024" },
  { title: "Parent Manual", date: "16th February 2024" },
  { title: "Time Table", date: "16th February 2024" },
];

const UnitDocuments = () => {
  const [activeUnit, setActiveUnit] = useState("Unit-1");

  const getDocuments = () => {
    switch (activeUnit) {
      case "Unit-1":
        return unit_1;
      case "Unit-2":
        return unit_2;
      case "Unit-3":
        return unit_3;
      case "Unit-4":
        return unit_4;
      default:
        return [];
    }
  };

  const handleGoBack = () =>{
     window.history.back();
  }

  return (
    <div className="min-h-screen bg-slate-500 flex justify-center items-center p-4">
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-700 text-white py-4 px-5 flex items-center space-x-3">
          <ArrowLeft onClick={handleGoBack} className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
          <h2 className="text-lg font-semibold">Unit Documents</h2>
        </div>

        <div className="flex space-x-2 p-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all w-1/2 ${
              activeUnit === "Unit-1"
                ? "bg-slate-500 text-white shadow-md"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveUnit("Unit-1")}
          >
            Unit 1
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all w-1/2 ${
              activeUnit === "Unit-2"
                ? "bg-slate-500 text-white shadow-md"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveUnit("Unit-2")}
          >
            Unit 2
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all w-1/2 ${
              activeUnit === "Unit-3"
                ? "bg-slate-500 text-white shadow-md"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveUnit("Unit-3")}
          >
            Unit 3
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all w-1/2 ${
              activeUnit === "Unit-4"
                ? "bg-slate-500 text-white shadow-md"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveUnit("Unit-4")}
          >
            Unit 4
          </button>
        </div>

        <div className="space-y-6 p-4">
          {getDocuments().map((doc, index) => (
            <div
              key={index}
              className="flex items-center bg-slate-200 p-4 shadow-md rounded-lg transition-transform hover:scale-105 hover:shadow-lg"
            >
              <FileText className="text-slate-500 w-6 h-6 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                <p className="text-sm text-gray-500">Added on: {doc.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitDocuments;
