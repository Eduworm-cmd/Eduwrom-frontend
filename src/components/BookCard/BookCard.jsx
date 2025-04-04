import { Download } from "lucide-react";
import React from "react";

const BookCard = ({isdownloadEnabled = false}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      <div className="bg-white shadow border w-full px-4 pb-6 rounded-md">
        <div className="pt-6 pb-3 relative">
          <img src="https://s3.ap-south-1.amazonaws.com/gyan-prod-images.creativegalileo.com/lesson_plan/book/UKG_Advanced_Skill_1/UKG_Advanced_Skill_1_Page_01.png" alt="bookimage" className="rounded-md shadow-lg w-full max-h-[200px] " />
          {
            isdownloadEnabled && <button className="bg-white text-sky-500 p-2  mt-2 rounded-full transition-all shadow text-[12px] ease-in-out hover:bg-blue-600 absolute right-[-5%] bottom-0"><Download /></button>
          }
        </div>
        <h3 className="text-lg max-sm:text-sm max-md:text-md font-semibold text-gray-800 text-center">Advanced Skill 1</h3>
        <button className="bg-blue-500 text-white py-2 px-4 w-full mt-2 rounded-full transition-all text-[12px] ease-in-out hover:bg-blue-600">Read More</button>
      </div>
    </div>
  );
};

export default BookCard;
