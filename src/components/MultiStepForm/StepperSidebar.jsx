import React, { useEffect, useState } from "react";

export const StepperSidebar = ({ handleactiveStep, stepperSidebar, activeindex }) => {
  const [height, setHeight] = useState(33);

  const handleResize = () => {
    const percentage = Math.floor(((activeindex + 1) / stepperSidebar.length) * 100);
    setHeight(percentage);
  };

  useEffect(() => {
    handleResize();
  }, [activeindex, stepperSidebar.length]);

  return (
    <div className="w-full relative pr-8 flex flex-row md:flex-col">
      {/* Vertical line */}
      <div className="md:h-full md:w-3 w-full h-0 rounded-t-2xl overflow-hidden rounded-b-2xl bottom-5 md:right-10 bg-gray-200 absolute">
        <div
          style={{ height: `${height}%`  }}
          className="rounded-t-2xl w-3 bg-primary transition-all duration-300"
        />
      </div>

      {stepperSidebar?.map((step, index) => {
        const Icon = step.icon;
        return (
          <div
            key={index}
            onClick={() => handleactiveStep(index)}
            className="flex flex-col-reverse md:flex-row justify-center  items-center md:justify-end mb-10 gap-4 cursor-pointer pr-8"
          >
            <div className="ml-4">
              <div
                className={`text-sm max-md:text-xs font-semibold ${
                  activeindex === index ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {step.label}
              </div>
              <div className="text-xs text-gray-400">Browse and upload</div>
            </div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full z-10 ${
                activeindex === index ? "bg-primary" : "bg-gray-700"
              }`}
            >
              <Icon
                size={20}
                className={activeindex === index ? "text-white" : "text-gray-300"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
