import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

const days = Array.from({ length: 8 }, (_, i) => 38 + i);

const DaySlider = () => {
  const [selectedDay, setSelectedDay] = useState(38);

  return (
    <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-between">
      {/* Left Arrow */}
      <button className="text-white p-2">
        <ChevronLeft size={18} />
      </button>

      {/* Units */}
      <div className="flex space-x-2">
        <button className="bg-black text-white px-4 py-2 rounded-md">Unit 1</button>
        <button className="bg-purple-400 text-white px-4 py-2 rounded-md">Unit 2</button>
      </div>

      {/* Day Buttons */}
      <div className="flex space-x-3 overflow-auto border scrollbar-hide px-4">
        {days.map((day) => (
          <button
            key={day}
            className={`px-4 py-3 rounded-lg border ${
              selectedDay === day ? "bg-white text-black font-bold" : "border-white text-white"
            }`}
            onClick={() => setSelectedDay(day)}
          >
            <span className="block text-sm">Day</span>
            {day}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button className="text-white p-2">
        <ChevronRight size={18} />
      </button>

      {/* View Summary */}
      <button className="text-white text-sm underline flex items-center ml-4">
        <Info size={16} className="mr-1" /> View Unit Summary
      </button>
    </div>
  );
};

export default DaySlider;
