import { Switch } from "@/components/ui/switch";
import { Clock, Book, ArrowRight } from "lucide-react";
import "./LessonCard.css";
import { useNavigate } from "react-router-dom";

const LessonCard = () => {
  const navigate = useNavigate();

  const handleLessonClick = () => {
    navigate("/days");
  };

  return (
    <div className=" lessoncard w-full  bg-slate-500 rounded-2xl  border-gray-300 ">
      <div className="lession-card-inner  border-gray-300">
        <div className="bg-white p-3 rounded-md border shadow text-sm text-center flex flex-col gap-1 items-center">
          <Clock />
          20 min
        </div>
      </div>

      <div className="text-gray-800 ml-[85px]">
        <div className="p-2">
          <h4 className="flex items-center gap-2 font-bold text-white mb-2">
            <Book className="w-10 h-10" /> Settling Time -Copy My Movement
          </h4>
          <p className="text-sm  text-white mb-2 md:text-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="mb-2 text-white">Class : UKG</p>
          <div className="flex items-center text-white space-x-2">
            <label htmlFor="completed">Mark Completed</label>
            <Switch
              id="completed"
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="bg-slate-300 w-full flex items-center justify-center ">
        <div
          onClick={handleLessonClick}
          className="bg-slate-500 flex items-center gap-1 cursor-pointer hover:text-blue-500 max-w-[200px] px-2 font-bold capitalize">
          view More
          <ArrowRight className="transform transition-transform duration-300 ease-in-out hover:translate-x-2" />
        </div>

      </div>
    </div>
  );
};

export default LessonCard;
