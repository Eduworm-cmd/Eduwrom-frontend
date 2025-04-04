import LessonCard from "@/components/LessonCard/LessonCard";
import { Book, Clock } from "lucide-react";
import React from "react";
export const TeacherHomePage = () => {
  const lessonsData = [
    {
      id: 1,
      title: "Settling Time - Copy My Movement",
      duration: 20,
      description: "This lesson helps students follow movement patterns.",
      classLevel: "UKG",
      activities: [
        { name: "Interactive Activities", title: "आरामदायक गतिविधियां" },
        { name: "Fun Learning", title: "खेल आधारित शिक्षा" },
      ],
    },

    {
      id: 2,
      title: "My Home-Drawing",
      duration: 30,
      description: "Students will learn color mixing through painting exercises.",
      classLevel: "LKG",
      activities: [
        { name: "Color Games", title: "रंग पहेली" },
        { name: "Painting Fun", title: "चित्रकारी मजा" },
      ],
    },
    {
      id: 3,
      title: "Basic Math with Counting",
      duration: 25,
      description: "Introduction to counting and number recognition.",
      classLevel: "Grade 1",
      activities: [
      ],
    },
    {
      id: 4,
      title: "Basic Math with Counting",
      duration: 25,
      description: "Introduction to counting and number recognition.",
      classLevel: "Grade 1",
      activities: [
      ],
    },
  ];

  return (
    <div>
      <LessonCard lessons={lessonsData} />    
    </div>
  );
};
