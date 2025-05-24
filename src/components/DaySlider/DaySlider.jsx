import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Info, Calendar, BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetDaysByUnitId, GetUnitsByClassId } from "@/Network/Super_Admin/auth";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDayId } from "@/slice/selectedDaySlice";

const DaySlider = ({ classId, onDaySelected }) => {
  const [units, setUnits] = useState([]);
  const [daysList, setDaysList] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const daysScrollRef = useRef(null);
  const unitsScrollRef = useRef(null);

  const selectedDayId = useSelector((state) => state.selectedDay?.selectedDayId);
  const [currentSelectedDay, setCurrentSelectedDay] = useState(selectedDayId);

  // Check scroll capabilities
  const checkScrollCapabilities = () => {
    if (daysScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = daysScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Smooth scroll function
  const smoothScroll = (element, direction) => {
    if (!element) return;
    const scrollAmount = 200;
    const newScrollLeft = direction === 'left'
      ? element.scrollLeft - scrollAmount
      : element.scrollLeft + scrollAmount;

    element.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Fetch units when classId changes
  useEffect(() => {
    const fetchUnits = async () => {
      if (!classId) return;
      setLoading(true);
      try {
        const response = await GetUnitsByClassId(classId);
        const unitsData = response.data || [];
        setUnits(unitsData);

        if (unitsData.length > 0 && !selectedUnitId) {
          setSelectedUnitId(unitsData[0]._id);
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

        const dayBelongsToThisUnit = daysData.some(day => day._id === selectedDayId);

        if (!dayBelongsToThisUnit && daysData.length > 0) {
          const firstDayId = daysData[0]._id;
          setCurrentSelectedDay(firstDayId);
          dispatch(setSelectedDayId(firstDayId));
        } else if (selectedDayId && dayBelongsToThisUnit) {
          setCurrentSelectedDay(selectedDayId);
        }
      } catch (error) {
        console.error("Failed to fetch days:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDays();
  }, [selectedUnitId, dispatch, selectedDayId]);

  // Check scroll on days list change
  useEffect(() => {
    setTimeout(checkScrollCapabilities, 100);
  }, [daysList]);

  const handleUnitClick = (unitId) => {
    setSelectedUnitId(unitId);
  };

  const handleViewSummary = () => {
    navigate("/unit");
  };

  const handleDayClick = (dayId) => {
    setCurrentSelectedDay(dayId);
    dispatch(setSelectedDayId(dayId));
    if (onDaySelected) onDaySelected();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 font-medium">Loading curriculum...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header with Icon */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Course Navigator</h3>
            <p className="text-blue-100 text-sm">Select your unit and day</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-100">
        {/* Units Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Units</span>
          </div>

          <div
            ref={unitsScrollRef}
            className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {units.map((unit, index) => (
              <button
                key={unit._id}
                onClick={() => handleUnitClick(unit._id)}
                className={`
                  relative px-6 py-3 rounded-xl border-2 transition-all duration-300 
                  transform hover:scale-105 hover:shadow-lg whitespace-nowrap
                  ${selectedUnitId === unit._id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${selectedUnitId === unit._id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}
                  `}>
                    {index + 1}
                  </span>
                  <span className="font-medium">{unit.name}</span>
                </div>
                {selectedUnitId === unit._id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Days Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Days</span>
            </div>
            <div className="text-xs text-gray-500">
              {daysList.length} {daysList.length === 1 ? 'day' : 'days'} available
            </div>
          </div>

          <div className="relative">
            {/* Left Scroll Button */}
            <button
              onClick={() => smoothScroll(daysScrollRef.current, 'left')}
              className={`
                absolute left-0 top-1/2 transform -translate-y-1/2 z-10
                w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200
                flex items-center justify-center transition-all duration-200
                ${canScrollLeft
                  ? "text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                  : "text-gray-300 cursor-not-allowed"
                }
              `}
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Days Container */}
            <div
              ref={daysScrollRef}
              className="flex space-x-3 overflow-x-auto scrollbar-hide px-12 py-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={checkScrollCapabilities}
            >
              {daysList.map((dayObj, index) => (
                <button
                  key={dayObj._id}
                  className={`
                    relative flex-shrink-0 px-5 py-4 rounded-lg border-2 transition-all duration-300
                    transform hover:scale-105 hover:shadow-md whitespace-nowrap min-w-[80px]
                    ${currentSelectedDay === dayObj._id
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                    }
                  `}
                  onClick={() => handleDayClick(dayObj._id)}
                >
                  <div className="text-center">
                    <div className={`
                      text-xs font-medium mb-1
                      ${currentSelectedDay === dayObj._id ? "text-blue-100" : "text-gray-500"}
                    `}>
                      Day
                    </div>
                    <div className={`
                      text-lg font-bold
                      ${currentSelectedDay === dayObj._id ? "text-white" : "text-gray-800"}
                    `}>
                      {dayObj.globalDayNumber}
                    </div>
                  </div>
                  {currentSelectedDay === dayObj._id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => smoothScroll(daysScrollRef.current, 'right')}
              className={`
                absolute right-0 top-1/2 transform -translate-y-1/2 z-10
                w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200
                flex items-center justify-center transition-all duration-200
                ${canScrollRight
                  ? "text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                  : "text-gray-300 cursor-not-allowed"
                }
              `}
              disabled={!canScrollRight}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* View Summary Button */}
        <div className="flex justify-center pt-4 border-t border-gray-100">
          <button
            className="flex items-center space-x-2 px-6 py-3 text-blue-600 hover:text-blue-700 
                     hover:bg-blue-50 rounded-lg transition-all duration-200 group"
            onClick={handleViewSummary}
          >
            <Info size={16} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">View Unit Summary</span>
          </button>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DaySlider;