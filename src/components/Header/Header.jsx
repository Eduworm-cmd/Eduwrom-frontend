import React, { useEffect, useState } from "react";
import teacher from "../../assets/images/teacher.webp";
import { Book, CalendarDays, Menu } from "lucide-react";
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
import DaySlider from "../DaySlider/DaySlider";
import { useNavigate } from "react-router-dom";
import { SchoolStaffByStaffId } from "@/Network/schooladminauth";
import { useDispatch, useSelector } from "react-redux";
import { GetDaysByUnitId, GetUnitsByClassId } from "@/Network/Super_Admin/auth";
import { setSelectedDayId } from "@/slice/selectedDaySlice";

export const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState(null);
  const [classId, setClassId] = useState();
  const user = useSelector((state) => state.auth?.user);
  const userId = user?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleCloseDailog = () => {
    setOpenDialog(false)
  }
  const handleClassChange = (value) => {
    setClassId(value);
  };

  useEffect(() => {
    const loadInitialDay = async () => {
      if (!classId) return;

      try {
        const unitsResponse = await GetUnitsByClassId(classId);
        const units = unitsResponse?.data || [];
        if (units.length === 0) return;

        const firstUnitId = units[0]._id;

        const daysResponse = await GetDaysByUnitId(firstUnitId);
        const days = daysResponse?.data || [];

        if (days.length > 0) {
          const firstDayId = days[0]._id;
          dispatch(setSelectedDayId(firstDayId));
        }
      } catch (error) {
        console.error("Failed to load initial day data:", error);
      }
    };

    loadInitialDay();
  }, [classId]);

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
    }
  }, [staffData?.class]);

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
              onClick={() => navigate("/")}
              className="bg-white cursor-pointer border shadow-md transition-all ease-in p-2 text-gray-500 rounded-full hover:bg-sky-600 hover:text-white"
            >
              <CalendarDays className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/books")}
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

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Select Unit and Day</DialogTitle>
                  <DialogDescription>
                    By selecting the unit and day, you can view the timetable.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full overflow-hidden">
                  <DaySlider classId={classId} onDaySelected={handleCloseDailog} />
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
