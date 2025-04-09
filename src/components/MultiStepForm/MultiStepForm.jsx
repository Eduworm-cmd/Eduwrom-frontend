import React, { useEffect, useState } from "react";
import { StepContent } from "./StepContent";
import { StepperSidebar } from "./StepperSidebar";

export const MultiStepForm = ({stepperSidebar = [], stepContent = [], title, description}) => {


  const [activeStepindex, setActiveStepindex] = useState(0);
  const handleactiveStep = (step) => {
    setActiveStepindex(step);
  }
  const reanderComponent = () => {
    return (
      stepContent[activeStepindex]
    )
  }

  return (
    <div className="bg-white text-slate-700 shadow-md border min-h-[500px] transition-all duration-300 ease-in-out  px-10 py-6 w-full rounded-xl">
      <div className=" border-b pb-8">
        <h4 className="text-2xl font-semibold">{title}</h4>
        <p className="text-sm">
          {description}
        </p>
      </div>
      <div className="mt-4 flex items-center px-8">
        <div className="w-[30%]">
          <StepperSidebar stepperSidebar={stepperSidebar} handleactiveStep={handleactiveStep}  activeindex={activeStepindex}/>
        </div>
        <div className="w-[70%]">
          <p className="text-sm text-gray-700 mb-2">Step {activeStepindex + 1}/{stepperSidebar.length}</p>
          <StepContent>
            {
              reanderComponent()
            }
          </StepContent>
        </div>
      </div>
    </div>
  );
};
