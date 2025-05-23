import { Switch } from "@/components/ui/switch";
import { Clock, Book, ChevronRight } from "lucide-react";
import "./LessonCard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LessonCard = ({ lessons }) => {

  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [shuffledPairs, setShuffledPairs] = useState([]);

  const baseColors = ["#b2f4ff", "#ffde8d", "#beed8f", "#fdcce2"];
  const btnColors = ["#68e9fc", "#fed15e", "#a4da6c", "#fdb2d6"];
  const barColors = ["#55d0e6", "#fab301", "#91cb56", "#f957a2"];

  useEffect(() => {
    const shuffledIndices = shuffleArray([0, 1, 2, 3]);
    const pairs = shuffledIndices.map(i => ({
      base: baseColors[i],
      btn: btnColors[i],
      bar: barColors[i]
    }));
    setShuffledPairs(pairs);
  }, []);

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const getColorPairByIndex = (index) => {
    if (shuffledPairs.length === 0) return { base: "#ccc", bar: "#999" };
    return shuffledPairs[index % shuffledPairs.length];
  };

  const handleViewMoreClick = (index) => {
    setExpandedIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <div>
      {Array.isArray(lessons) && lessons.length > 0 ? (
        lessons.map((lesson, index) => {
          const { base, btn, bar } = getColorPairByIndex(index);
          return (
            <div
              className="lessoncard w-full rounded-2xl border-gray-300 mb-5"
              key={index}
              style={{ backgroundColor: base }}
            >
              <div className="lession-card-inner border-gray-300">
                <div className="bg-white p-3 rounded-md border shadow text-sm text-center flex flex-col gap-1 items-center">
                  <Clock />
                  {lesson.duration}min
                </div>
              </div>
              <div className="text-gray-800 ml-[85px]">
                <div className="p-2">
                  <h4 className="flex items-center gap-2 font-bold text-black mb-2">
                    <Book className="w-10 h-10" /> {lesson.title}
                  </h4>
                  <p className="text-sm text-black mb-2 md:text-md">
                    {lesson.description}
                  </p>
                  <p className="mb-2 text-black">Class: LKG{lesson.ClassId?.className}</p>
                  <div className="flex items-center text-black space-x-2">
                    <label htmlFor={`completed-${index}`}>Mark Completed</label>
                    <Switch
                      id={`completed-${index}`}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 w-full rounded-b-2xl shadow-md">
                {expandedIndex === index && (
                  <div className="max-w-full mx-auto bg-white overflow-hidden px-2">
                    <div className="flex items-center my-3 bg-slate-200 justify-between px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-xl">📖</span>
                        <span className="text-gray-700 font-medium">Lesson Guidelines</span>
                      </div>
                      <span
                        className="text-slate-500 cursor-pointer"
                        onClick={() => navigate(`/view/${lesson.id}`)}
                      >
                        View &gt;
                      </span>
                    </div>
                    {Array.isArray(lesson.activities) && lesson.activities.length > 0 ? (
                      lesson.activities.map((activity, activityIndex) => (
                        <div
                          key={activityIndex}
                          className="p-4 mt-4 oklch(87.2% 0.01 258.338) my-2 rounded-2xl"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-slate-500 text-xl">🎮</span>
                            <span className="text-gray-700 font-medium">Interactive Activities</span>
                          </div>
                          <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-600 text-xl">🎬</span>
                              <span className="text-slate-600 underline">{activity.title}</span>
                            </div>
                            <button className="bg-slate-700 cursor-pointer text-white px-4 py-2 rounded-lg shadow-md">
                              Assign
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No activities found.</div>
                    )}
                  </div>
                )}

                <div
                  className="flex items-center justify-center"
                  style={{ backgroundColor: bar }}
                >
                  <span className="text-black flex  px-5 py-1 font-medium cursor-pointer" style={{ backgroundColor: btn }}
                    onClick={() => handleViewMoreClick(index)}>
                    {expandedIndex === index ? "View Less" : "View More"}

                    <ChevronRight
                      className={`w-5 h-5 ml-1 mt-[4px] transition-transform text-black duration-300 ${expandedIndex === index ? "rotate-90" : ""
                        }`}
                    />
                  </span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No lessons found.</p>
      )}
    </div>
  );
};

export default LessonCard;
