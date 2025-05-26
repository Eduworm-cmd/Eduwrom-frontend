import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LessonCard from "@/components/LessonCard/LessonCard";
import { GetLessonsDaysId } from "@/Network/Super_Admin/auth";

export const TeacherHomePage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const selectedDayId = useSelector(
    (state) => state.selectedDay?.selectedDayId
  );

  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedDayId) return;

      setLoading(true);
      try {
        const response = await GetLessonsDaysId(selectedDayId);
        const rawData = response?.data || [];

        const formattedLessons = rawData.map((lesson) => ({
          id: lesson._id,
          title: lesson.lessonTitle,
          duration: lesson.duration,
          description: lesson.description || "",
          activities: lesson.interactiveActivity || [], 
          avatar: lesson.lessonAvatar,
          objectives: lesson.objectives || [],
        }));

        setLessons(formattedLessons);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [selectedDayId]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center text-gray-600">Loading lessons...</div>
      ) : lessons.length > 0 ? (
        <LessonCard lessons={lessons} />
      ) : (
        <div className="text-center text-gray-500">
          No lessons available for the selected day.
        </div>
      )}
    </div>
  );
};

export default TeacherHomePage;
