import React from "react";

export const StepContent = ({ children }) => {
  return (
    <div className="max-h-[55vh] overflow-y-scroll custom-scrollbar p-2">
      {children}
    </div>
  );
};
