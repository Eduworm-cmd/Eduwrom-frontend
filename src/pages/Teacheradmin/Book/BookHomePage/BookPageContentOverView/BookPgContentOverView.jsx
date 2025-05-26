import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Typography, Divider, Card, Spin, Button, message } from "antd";
import { DownloadOutlined, ExpandOutlined } from "@ant-design/icons";
import LessonCard from "@/components/LessonCard/LessonCard";

const { Title, Text } = Typography;

// Parse bullet points from HTML
const parseHtmlContent = (htmlString) => {
    if (!htmlString) return [];

    const listItems = htmlString.match(/<li[^>]*>(.*?)<\/li>/g) || [];
    return listItems
        .map(item => item.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim())
        .filter(item => item.length > 0);
};

// Format objectives
const formatObjectives = (objectives) => {
    if (!Array.isArray(objectives)) return [];

    return objectives.map(obj => ({
        title: obj.objectiveTitle || "Objective",
        content: parseHtmlContent(obj.objectiveValue),
    }));
};

const BookContentPage = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        const fetchLessons = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/api/subject_PageContent/${id}`);
                const data = response?.data?.data || [];

                const formattedLessons = data.map(lesson => ({
                    id: lesson._id,
                    title: lesson.title || "Untitled Lesson",
                    duration: lesson.duration || "0",
                    description: lesson.description || "",
                    activities: lesson.interactiveActivity || [],
                    avatar: lesson.contentAvtar || "",
                    objectives: formatObjectives(lesson.objectives),
                    ClassId: lesson.classId || {},
                }));

                setLessons(formattedLessons);
            } catch (error) {
                console.error("Error fetching lessons:", error);
                message.error("Failed to load page content");
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
                <span className="ml-3 text-gray-600">Loading content...</span>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Book Header */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={location?.state?.SubjectId?.imageUrl || "/placeholder-book.jpg"}
                    alt="Book Cover"
                    className="w-20 h-28 object-cover rounded-md shadow-lg"
                    onError={(e) => (e.target.src = "/placeholder-book.jpg")}
                />
                <div>
                    <Title level={3} className="!mb-1">
                        {location?.state?.SubjectId?.title || "Skill Builders 2"}
                    </Title>
                    <Text type="secondary">Pages: {location?.state?.pages || "N/A"}</Text>
                    <br />
                    <Text type="secondary">Current Page: {location?.state?.pageNumber || "Page 2"}</Text>
                </div>
            </div>

            {/* Page Image Viewer */}
            <Card className="mb-6" bodyStyle={{ padding: 0, overflow: "hidden" }}>
                <div className="relative w-full">
                    <img
                        src={location?.state?.imageUrl || "/placeholder-page.jpg"}
                        alt="Page View"
                        className="w-full object-contain max-h-96"
                        onError={(e) => (e.target.src = "/placeholder-page.jpg")}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                            shape="circle"
                            icon={<ExpandOutlined />}
                            className="bg-white/90 hover:bg-white shadow-md"
                        />
                        <Button
                            shape="circle"
                            icon={<DownloadOutlined />}
                            className="bg-white/90 hover:bg-white shadow-md"
                        />
                    </div>
                </div>
                <div className="text-center py-2 bg-gray-50 text-sm text-gray-600">
                    {location?.state?.title || "Page 2"}
                </div>
            </Card>

            {/* Lesson Cards */}
            {lessons?.length > 0 ? (
                <LessonCard lessons={lessons} />
            ) : (
                <div className="text-center text-gray-500">No lessons available.</div>
            )}
        </div>
    );
};

export default BookContentPage;
