import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Image } from 'antd';
import { BookOpen, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { CircleArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x400?text=No+Image";

const BookSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-red-50 rounded-full p-4 mb-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
    <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
    >
      <RefreshCw className="w-4 h-4" />
      Try Again
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-gray-50 rounded-full p-4 mb-4">
      <BookOpen className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No subjects found</h3>
    <p className="text-gray-600 text-center max-w-md">
      There are no subjects available for this class yet.
    </p>
  </div>
);

const BookCard = ({ subject }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const navigate = useNavigate();
  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    setPreviewVisible(true);
  };

  const imageUrl = imageError ? PLACEHOLDER_IMAGE : (subject.imageUrl || PLACEHOLDER_IMAGE);

  return (
    <div className="group shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all ">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
        )}

        <Image
          src={imageUrl}
          alt={subject.title || 'Subject cover'}
          className={`w-full h-full object-cover pt-1 transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          preview={{
            visible: previewVisible,
            onVisibleChange: (visible) => setPreviewVisible(visible),
            mask: (
              <div className="flex items-center justify-center gap-2 text-white">
                <Eye className="w-5 h-5" />
              </div>
            ),
          }}
        />

        {/* Preview overlay */}
        <div
          className="absolute inset-0 bg-white/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
          onClick={handlePreviewClick}
        >
          <div className="p-3 transform scale-75 group-hover:scale-100 transition-transform duration-200">
            <Eye className="w-6 h-6 text-gray-700" />
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="p-2">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2">
          {subject.title || 'Untitled Subject'}

        </h3>


        <div className="flex items-center gap-1  text-gray-500  justify-between">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{subject.SubjectPage?.length || 0} pages</span>
         </div>
          <span onClick={() => navigate(`/eduworm-Teacher/book/pages/${subject._id}`)} className="text-gray-400 flex cursor-pointer justify-end"> <CircleArrowRight /></span>
        </div>
      </div>
    </div>
  );
};

export const BookHomePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classId = useSelector((state) => state?.selectedClass?.selectedClassyId);
  const className = subjects[0]?.classId?.className;

  const fetchSubjects = useCallback(async () => {
    if (!classId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:4000/api/subject/${classId}`);

      if (response.data.success && Array.isArray(response.data.data)) {
        setSubjects(response.data.data);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleViewContent = useCallback((subject) => {
    console.log('Selected subject:', subject);
    // Add navigation logic here
  }, []);

  const handleRetry = useCallback(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <BookSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <BookCard
            key={subject._id}
            subject={subject}
            onViewContent={handleViewContent}
          />
        ))}
      </div>
    </div>
  );
};