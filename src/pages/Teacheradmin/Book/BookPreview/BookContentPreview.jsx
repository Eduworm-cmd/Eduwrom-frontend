import { useState, useEffect } from 'react';
import { Clock, Target, BookOpen, Play, ChevronDown, ChevronUp } from 'lucide-react';

export default function LessonPlanInterface() {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    objectives: true,
    activities: true
  });

  useEffect(() => {
    fetchLessonData();
  }, []);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/subject_PageContent/6830412638b0dc1498f0ab28');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        setLessonData(result.data[0]);
      } else {
        throw new Error('No lesson data found');
      }
    } catch (err) {
      console.error('Error fetching lesson data:', err);
      setError(err.message);
      // Fallback to sample data for demonstration
      setLessonData({
        title: "Sample Lesson",
        duration: "45 minutes",
        contentAvtar: "https://via.placeholder.com/400x200/6366f1/ffffff?text=Lesson+Content",
        objectives: [
          {
            objectiveTitle: "Learning Goals",
            objectiveValue: "<ol><li>Understand core concepts</li><li>Apply practical skills</li><li>Develop critical thinking</li></ol>"
          }
        ],
        interactiveActivity: [
          {
            title: "Interactive Exercise",
            link: "https://example.com",
            poster: "https://via.placeholder.com/300x200/10b981/ffffff?text=Activity"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const parseHtmlContent = (htmlString) => {
    if (!htmlString) return [];
    
    // Simple HTML parser for list items
    const listItems = htmlString.match(/<li[^>]*>(.*?)<\/li>/g) || [];
    return listItems.map(item => 
      item.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    ).filter(item => item.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (error && !lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-red-500 text-center mb-4">
            <BookOpen size={48} className="mx-auto mb-2" />
            <h2 className="text-xl font-bold">Unable to Load Content</h2>
            <p className="text-gray-600 mt-2">Error: {error}</p>
            <button 
              onClick={fetchLessonData}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{lessonData.title}</h1>
              <div className="flex items-center space-x-4 text-indigo-100">
                <div className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  <span>{lessonData.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={18} className="mr-2" />
                  <span>Interactive Lesson</span>
                </div>
              </div>
            </div>
            {lessonData.contentAvtar && (
              <div className="hidden md:block">
                <img 
                  src={lessonData.contentAvtar} 
                  alt="Lesson visual" 
                  className="w-24 h-24 rounded-xl object-cover border-2 border-white/20"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Learning Objectives */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('objectives')}
          >
            <div className="flex items-center">
              <Target size={24} className="mr-3" />
              <h2 className="text-xl font-semibold">Learning Objectives</h2>
            </div>
            {expandedSections.objectives ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.objectives && (
            <div className="p-6">
              {lessonData.objectives && lessonData.objectives.length > 0 ? (
                lessonData.objectives.map((objective, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-gray-800 mb-3">{objective.objectiveTitle}</h3>
                    <div className="space-y-2">
                      {parseHtmlContent(objective.objectiveValue).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p className="text-gray-700 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No objectives defined for this lesson.</p>
              )}
            </div>
          )}
        </div>

        {/* Interactive Activities */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('activities')}
          >
            <div className="flex items-center">
              <Play size={24} className="mr-3" />
              <h2 className="text-xl font-semibold">Interactive Activities</h2>
            </div>
            {expandedSections.activities ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.activities && (
            <div className="p-6">
              {lessonData.interactiveActivity && lessonData.interactiveActivity.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {lessonData.interactiveActivity.map((activity, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                      {activity.poster && (
                        <div className="mb-4">
                          <img 
                            src={activity.poster} 
                            alt={activity.title}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-800 mb-3">{activity.title}</h3>
                      <a 
                        href={activity.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                      >
                        <Play size={16} className="mr-2" />
                        Start Activity
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Play size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 italic">No interactive activities available for this lesson.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}