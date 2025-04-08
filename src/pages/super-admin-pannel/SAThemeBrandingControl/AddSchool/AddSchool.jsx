import { MultiStepForm } from "@/components/MultiStepForm/MultiStepForm";
import React from "react";
import { User, CheckCheck, Landmark } from "lucide-react";
import { UserRegistrationForm } from "@/components/Forms/UserRegistrationForm";
import { AddSchoolForm } from "./AddSchoolForm";

const steps = [
  { label: "User Information", icon: User },
  { label: "School Information", icon: Landmark },
  { label: "Finalization", icon: CheckCheck },
];

const form = [
  <UserRegistrationForm/>,
  <AddSchoolForm/>
];
export const AddSchool = () => {
  return (
    <div className="w-full">
      <MultiStepForm stepperSidebar={steps} stepContent={form} />
    </div>
  );
};
