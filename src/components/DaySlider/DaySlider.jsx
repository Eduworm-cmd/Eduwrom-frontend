import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetDaysByUnitId, GetUnitsByClassId } from "@/Network/Super_Admin/auth";
import { useDispatch } from "react-redux";
import { setSelectedDayId } from "@/slice/selectedDaySlice";

const DaySlider = ({ classId }) => {
  const [units, setUnits] = useState([]);
  const [daysList, setDaysList] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      if (!classId) return;
      setLoading(true);
      try {
        const response = await GetUnitsByClassId(classId);
        const unitsData = response.data || [];
        setUnits(unitsData);
        if (unitsData.length > 0) {
          setSelectedUnitId(unitsData[0]._id); // select first unit by default
        }
      } catch (error) {
        console.error("Failed to fetch units:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [classId]);

  // Fetch days when selectedUnitId changes
  useEffect(() => {
    const fetchDays = async () => {
      if (!selectedUnitId) return;
      setLoading(true);
      try {
        const response = await GetDaysByUnitId(selectedUnitId);
        const daysData = response.data || [];
        setDaysList(daysData);
        setSelectedDay(null); 
      } catch (error) {
        console.error("Failed to fetch days:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDays();
  }, [selectedUnitId]);

  const handleUnitClick = (unitId) => {
    setSelectedUnitId(unitId); 
  };

  const handleViewSummary = () => {
    navigate("/unit");
  };

  if (loading) {
    return <div className="flex items-center justify-center py-5">Loading...</div>;
  }
 const handleDayClick = (dayId) => {
    dispatch(setSelectedDayId(dayId));
  };  

  return (
    <div className="bg-white py-3 rounded-lg flex flex-col items-center">
      {/* Units Row */}
      <div className="flex items-start w-full space-x-3 p-2">
        {units.map((unit) => (
          <button
            key={unit._id}
            onClick={() => handleUnitClick(unit._id)}
            className={`py-2 px-4 rounded-lg border ${
              selectedUnitId === unit._id
                ? "bg-sky-700 text-white"
                : "bg-white border-gray-400 text-gray-700"
            }`}
          >
            {unit.name}
          </button>
        ))}
      </div>

      {/* Days Scroll Row */}
      <div className="flex items-center w-full">
        <button className="text-gray-400 p-2 cursor-pointer">
          <ChevronLeft size={18} />
        </button>

        <div className="flex space-x-3 overflow-x-auto scrollbar-hide w-full px-2">
          {daysList.map((dayObj) => (
            <button
              key={dayObj._id}
              className={`px-4 py-3 text-sm cursor-pointer rounded-lg border whitespace-nowrap ${
                selectedDay === dayObj.globalDayNumber
                  ? "bg-sky-700 text-white font-bold"
                  : "border-gray-400 text-gray-600"
              }`}
              onClick={() => handleDayClick(dayObj._id)}
            >
              <span className="block text-sm">Day</span>
              {dayObj.globalDayNumber}
            </button>
          ))}
        </div>

        <button className="text-gray-400 p-2 cursor-pointer">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* View Summary */}
      <button
        className="text-gray-400 cursor-pointer text-sm underline flex items-center mt-2"
        onClick={handleViewSummary}
      >
        <Info size={16} className="mr-1" /> View Unit Summary
      </button>
    </div>
  );
};

export default DaySlider;
