import React from "react";
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
import DaySlider from "../DaySlider/DaySlider";
import { SelectCustom } from "../SelectCustom/SelectCustom";
import { useNavigate } from "react-router-dom";
export const Header = () => {

  const navigate = useNavigate();
  return (
    <div className="absolute top-0 left-0 w-full bg-white">
      <div className="border-b w-full px-8 py-4 flex items-center justify-center gap-2">
        <img
          src="https://th.bing.com/th/id/OIP.vk90uiIYx6NCu2wmS-quNwHaHa?w=180&h=180&c=7&r=0&o=5&pid=1.7"
          alt="Delhi Public school"
          className="w-16 h-16 object-contain"
        />
        <p className="font-bold text-gray-600">
          Delhi Public school <br />
          <span className="font-[400] text-sm">New Step For education</span>
        </p>
      </div>
      <div className="flex justify-between items-center w-full px-8 py-4 border-b max-md:px-4">
        <div className="flex items-center gap-4">
          <div className="bg-pink-100 w-20 h-20 max-md:w-16 max-md:h-16 rounded-full overflow-hidden">
            <img src={teacher} alt="teacher" className="w-full h-full" />
          </div>
          <div>
            <p className="text-gray-500 text-md font-semibold mb-0 max-md:text-sm">
              Welcome,
            </p>
            <h1 className="text-lg font-bold text-gray-600 underline max-md:text-sm">
              Nikhil Singh
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-col">
          <div className="flex w-full gap-4 items-center justify-end max-md:gap-2">
            <button onClick={() => navigate("/")} className=" bg-white cursor-pointer border shadow-md transition-all ease-in p-2 text-gray-500 rounded-full hover:bg-sky-600 hover:text-white">
              <CalendarDays className="w-5 h-5" />
            </button>
            <button onClick={() => navigate("/books")} className="bg-white border cursor-pointer shadow-md transition-all ease-in p-2 text-gray-500 rounded-full hover:bg-sky-600 hover:text-white">
              <Book className="w-5 h-5" />
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className=" bg-white border cursor-pointer shadow-md transition-all ease-in p-2 text-gray-500 rounded-full hover:bg-sky-600 hover:text-white">
                  <Menu className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Select Unit and Day</DialogTitle>
                  <DialogDescription>
                    by selecting the unit and day, you can view the timetable
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full overflow-hidden">
                  <DaySlider />
                </div>
                <DialogFooter>
                  <button className=" bg-white border cursor-pointer shadow-md transition-all ease-in p-2 text-gray-500 rounded-full hover:bg-sky-600 hover:text-white">
                    Save Changes
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <SelectCustom />
        </div>
      </div>
    </div>
  );
};
