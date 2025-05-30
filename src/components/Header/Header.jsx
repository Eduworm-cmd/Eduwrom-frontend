import React, { useEffect, useState, useRef } from "react";
import teacher from "../../assets/images/teacher.webp";
import { Book, CalendarDays, Menu, BookOpen, Calendar, Clock, ChevronLeft, ChevronRight, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { SchoolStaffByStaffId } from "@/Network/schooladminauth";
import { useDispatch, useSelector } from "react-redux";
import { GetUnitsByClassId } from "@/Network/Super_Admin/auth";
import { setSelectedDayId } from "@/slice/selectedDaySlice";
import { setSelectedClassId } from "@/slice/selectedClass";

export const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState(null);
  const [classId, setClassId] = useState();
  const [units, setUnits] = useState([]);
  const [daysList, setDaysList] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [currentSelectedDay, setCurrentSelectedDay] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const unitsScrollRef = useRef(null);
  const daysScrollRef = useRef(null);
  
  const user = useSelector((state) => state.auth?.user);
  const userId = user?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseDailog = () => {
    setOpenDialog(false);
  };

  const handleClassChange = (value) => {
    setClassId(value);
  };

  const handleDayClick = (dayId) => {    
    setCurrentSelectedDay(dayId);
    dispatch(setSelectedDayId(dayId));
    handleCloseDailog();
  };

  // NEW: Handle unit click
  const handleUnitClick = (unitId) => {
    setSelectedUnitId(unitId);
    
    // Find the selected unit and load its days
    const selectedUnit = units.find(unit => unit.unitId === unitId);
    if (selectedUnit && selectedUnit.days) {
      setDaysList(selectedUnit.days);
      
      // Auto-select first day of the unit and clear previous selection
      if (selectedUnit.days.length > 0) {
        setCurrentSelectedDay(selectedUnit.days[0]._id);
        dispatch(setSelectedDayId(selectedUnit.days[0]._id));
      } else {
        setCurrentSelectedDay(null);
        dispatch(setSelectedDayId(null));
      }
    } else {
      // If no days in unit, clear the days list
      setDaysList([]);
      setCurrentSelectedDay(null);
      dispatch(setSelectedDayId(null));
    }
  };

  const smoothScroll = (element, direction) => {
    if (!element) return;
    const scrollAmount = 200;
    const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount;
    element.scrollBy({ left: scrollLeft, behavior: 'smooth' });
  };

  const checkScrollCapabilities = () => {
    if (daysScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = daysScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const handleViewSummary = () => {
    console.log("View summary clicked");
  };

  useEffect(() => {
    const loadInitialDay = async () => {
      if (!classId) return;

      try {
        const unitsResponse = await GetUnitsByClassId(classId);        
        if (unitsResponse && unitsResponse.success && unitsResponse.data) {
          setUnits(unitsResponse.data);
          
          const activeUnit = unitsResponse.data.find(unit => unit.isActive);
          
          if (activeUnit) {
            setSelectedUnitId(activeUnit.unitId);
            
            if (activeUnit.days && activeUnit.days.length > 0) {
              setDaysList(activeUnit.days);
              setCurrentSelectedDay(activeUnit.days[0]._id);
              dispatch(setSelectedDayId(activeUnit.days[0]._id));
            }
          } else if (unitsResponse.data.length > 0) {
            const firstUnit = unitsResponse.data[0];
            setSelectedUnitId(firstUnit.unitId);
            
            if (firstUnit.days && firstUnit.days.length > 0) {
              setDaysList(firstUnit.days);
              setCurrentSelectedDay(firstUnit.days[0]._id);
              dispatch(setSelectedDayId(firstUnit.days[0]._id));
            }
          }
        }
      } catch (error) {
        console.error("Failed to load initial day data:", error);
      }
    };

    loadInitialDay();
  }, [classId, dispatch]);

  useEffect(() => {
    if (!userId) return;

    const fetchStaffData = async (id) => {
      try {
        const response = await SchoolStaffByStaffId(id);
        setStaffData(response.data);
      } catch (error) {
        console.error("Failed to fetch staff data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData(userId);
  }, [userId]);

  // Automatically select first class
  useEffect(() => {
    if (Array.isArray(staffData?.class) && staffData.class.length > 0) {
      const firstClass = staffData.class[0];
      setClassId(firstClass._id);
      dispatch(setSelectedClassId(firstClass._id));
    }
  }, [staffData?.class, dispatch]);

  // Check scroll capabilities when days list changes
  useEffect(() => {
    checkScrollCapabilities();
  }, [daysList]);

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="absolute top-0 left-0 w-full bg-white">
      <div className="border-b w-full px-8 py-4 flex items-center justify-center gap-2">
        <img
          src="https://th.bing.com/th/id/OIP.vk90uiIYx6NCu2wmS-quNwHaHa?w=180&h=180&c=7&r=0&o=5&pid=1.7"
          alt="Delhi Public School"
          className="w-16 h-16 object-contain"
        />
        <p className="font-bold text-gray-600">
          {staffData?.school?.schoolName}
          <br />
          <span className="font-[400] text-sm">New Step For Education</span>
        </p>
      </div>

      <div className="flex justify-between items-center w-full px-8 py-4 border-b max-md:px-4">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="bg-pink-100 w-20 h-20 max-md:w-16 max-md:h-16 rounded-full overflow-hidden">
            <img src={teacher} alt="teacher" className="w-full h-full" />
          </div>
          <div>
            <p className="text-gray-500 text-md font-semibold mb-0 max-md:text-sm">Welcome,</p>
            <h1 className="text-lg font-bold text-gray-600 underline max-md:text-sm">
              {staffData?.firstName} {staffData?.lastName}
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 flex-col">
          <div className="flex w-full gap-4 items-center justify-end max-md:gap-2">
            <button
              onClick={() => navigate("/eduworm-Teacher")}
              className="bg-white cursor-pointer border shadow-md transition-all ease-in p-2 text-gray-500 rounded-full hover:bg-sky-600 hover:text-white"
            >
              <CalendarDays className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/eduworm-Teacher/books")}
              className="bg-white border cursor-pointer shadow-md transition-all ease-in p-2 text-gray-500 rounded-full hover:bg-sky-600 hover:text-white"
            >
              <Book className="w-5 h-5" />
            </button>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <button className="bg-white border cursor-pointer shadow-md transition-all ease-in p-2 text-gray-500 rounded-full hover:bg-sky-600 hover:text-white">
                  <Menu className="w-5 h-5" />
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Select Unit and Day</DialogTitle>
                  <DialogDescription>
                    By selecting the unit and day, you can view the timetable.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full overflow-hidden">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header with Icon */}
                    <div className="bg-gradient-to-r from-sky-600 to-sky-600 px-6 py-2">
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
                          className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 pl-3 pt-2 gap-4"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {units.map((unit, index) => (
                            <button
                              key={unit.unitId}
                              onClick={() => handleUnitClick(unit.unitId)} // FIXED: Added onClick handler
                              className={`
                                relative px-6 py-3 rounded-xl border-2 transition-all duration-300 
                                transform hover:scale-105
                                ${selectedUnitId === unit.unitId
                                  ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white border-white"
                                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                }
                              `}
                            >
                              <div className="flex items-center space-x-2">
                                <span className={`
                                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                  ${selectedUnitId === unit.unitId ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}
                                `}>
                                  {index + 1}
                                </span>
                                <span className="font-medium">{unit.name}</span>
                              </div>
                              {selectedUnitId === unit.unitId && (
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
                            className="flex space-x-3 overflow-x-auto scrollbar-hide px-12 py-2 gap-2"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            onScroll={checkScrollCapabilities}
                          >
                            {daysList.map((dayObj, index) => (
                              <button
                                key={dayObj._id}
                                className={`
                                  relative flex-shrink-0 px-5 py-2 rounded-lg border-2 transition-all duration-300
                                  transform hover:scale-105 hover:shadow-md whitespace-nowrap min-w-[80px]
                                  ${currentSelectedDay === dayObj._id
                                    ? "bg-gradient-to-br from-blue-600 to-sky-600 text-white border-blue-600 shadow-lg shadow-blue-200"
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
                          className="flex items-center space-x-2 px-6 py-3 underline text-blue-600 hover:text-blue-700 
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
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Class Selection */}
          <Select value={classId} onValueChange={handleClassChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {staffData?.class?.map((cls, index) => (
                <SelectItem key={index} value={cls._id}>
                  {cls.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};