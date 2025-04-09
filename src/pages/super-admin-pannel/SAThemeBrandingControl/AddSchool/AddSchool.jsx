import { MultiStepForm } from "@/components/MultiStepForm/MultiStepForm";
import React from "react";
import { User, CheckCheck, Landmark } from "lucide-react";
import { UserRegistrationForm } from "@/components/Forms/UserRegistrationForm";
import { AddSchoolForm } from "./AddSchoolForm";
import { FinalizationCard } from "@/components/FinalizationCard/FinalizationCard";

const steps = [
  { label: "User Information", icon: User },
  { label: "School Information", icon: Landmark },
  { label: "Finalization", icon: CheckCheck },
];

const form = [
  <UserRegistrationForm />,
  <AddSchoolForm />,
  <FinalizationCard
    icon={CheckCheck}
    title="Registration Successful!"
    description="Your school registration has been successfully completed. You can now access the admin dashboard and start managing your content."
    ctaText="Go to Dashboard"
    ctaLink="/eduworm-admin/home"
  />,
];
export const AddSchool = () => {
  return (
    <div className="w-full">
      <MultiStepForm 
        title="Add School Details"
        description="Please fill out the following information to register your school."
        stepperSidebar={steps} 
        stepContent={form}   
        />
    </div>
  );
};
