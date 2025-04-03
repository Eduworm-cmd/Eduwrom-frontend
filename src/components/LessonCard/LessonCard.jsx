import { Switch } from "@/components/ui/switch";
import { Clock, Book } from "lucide-react";

import "./LessonCard.css";
const LessonCard = () => {
  return (
    // <div className="flex items-start justify-between  p-4">


    // </div>
    <div className=" lessoncard w-full  bg-rose-100 rounded-2xl  border-gray-300 ">
      <div className="lession-card-inner  border-gray-300">
        <div className="bg-white p-3 rounded-md border shadow text-sm text-center flex flex-col gap-1 items-center">
          <Clock />
          20 min
        </div>
      </div>

      <div className="text-gray-800 ml-[85px]">
        <div className="p-2">
        <h4 className="flex items-center gap-2 font-bold text-pink-800 mb-2">
          <Book className="w-10 h-10" /> Settling Time -Copy My Movement
        </h4>
        <p className="text-sm  mb-2 md:text-md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <p className="mb-2">Class : UKG</p>
        <div className="flex items-center space-x-2">
          <label htmlFor="completed">Mark Completed</label>
            <Switch
             id="completed"
             className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 cursor-pointer"
             />
          </div>
        </div>
      </div>
      <div className="bg-pink-200 w-full flex items-center justify-center ">
          <div className="bg-pink-300 max-w-[200px] px-2 font-bold capitalize">
          view More
          </div>
      </div>
    </div>
  );
};

export default LessonCard;
