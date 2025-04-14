import React from "react";

export const StepContent = ({ children }) => {
  return (
    <div className="h-full md:max-h-[55vh] overflow-y-auto custom-scrollbar p-2">
      {children}
    </div>
  );
};
