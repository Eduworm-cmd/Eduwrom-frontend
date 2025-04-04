import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const days = Array.from({ length: 15 }, (_, i) => 1 + i); 

const DaySlider = () => {
  const [selectedDay, setSelectedDay] = useState(38);
  const navigate = useNavigate();

  const handleViewSummary = () => {
    navigate("/unit");
  }

  return (
    <div className="bg-white py-3 rounded-lg flex flex-col items-center">
      <div className="flex items-start w-full space-x-3 p-2">
        <button className="py-2 px-4 rounded-lg border bg-sky-700 text-white">Unit 1</button>
        <button className="py-2 px-4 rounded-lg border bg-white border-gray-400 text-gray-400">Unit 1</button>
      </div>  
      <div className="flex items-center w-full">
        {/* Left Arrow */}
        <button className="text-gray-400 p-2 cursor-pointer">
          <ChevronLeft size={18} />
        </button>
        {/* Scrollable Days */}
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide  w-full">
          {days.map((day) => (
            <button
              key={day}
              className={`px-4 py-3 text-sm cursor-pointer rounded-lg border whitespace-nowrap ${
                selectedDay === day ? "bg-sky-700 text-white font-bold" : "border-gray-400 text-gray-600"
              }`}
              onClick={() => setSelectedDay(day)}
            >
              <span className="block text-sm">Day</span>
              {day}
            </button>
          ))}
        </div>
        {/* Right Arrow */}
        <button className="text-gray-400 p-2 cursor-pointer">
          <ChevronRight size={18} />
        </button>
      </div>
      {/* View Summary */}
      <button className="text-gray-400 cursor-pointer text-sm underline flex items-center mt-2" onClick={handleViewSummary}>
        <Info size={16} className="mr-1" /> View Unit Summary
      </button>
    </div>
  );
};

export default DaySlider;
