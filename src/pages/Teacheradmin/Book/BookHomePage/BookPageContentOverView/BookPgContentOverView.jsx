import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, Divider, List, Card, Spin } from "antd";

const { Title, Text } = Typography;

const BookContentPage = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/api/subject_PageContent/${id}`
                );
                setPageData(response.data);
            } catch (error) {
                console.error("Error fetching page content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPageContent();
    }, [id]);

    if (loading) {
        return <Spin size="large" className="flex justify-center mt-8" />;
    }

    if (!pageData) {
        return <div className="text-center mt-8">No data available</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <Title level={2}>{pageData.title || "Skill Builders 2"}</Title>
            <Text strong>Pages: {pageData.pages || 79}</Text>
            <br />
            <Text>Type Page No: Page No.</Text>

            <Divider />

            {/* HTML5 Section */}
            <Title level={4}>HTML5</Title>
            <Text strong>Letters of a text:</Text>
            <List
                size="small"
                dataSource={[
                    "C:\\Users\\SafeWeb\\Desktop\\",
                    "By using text and logit to create the text.",
                    "Using text, we can use the text to create the text.",
                    "By using your name."
                ]}
                renderItem={(item) => (
                    <List.Item>
                        {item.startsWith("C:\\") ? (
                            <Text keyboard>{item}</Text>
                        ) : (
                            <Text>- {item}</Text>
                        )}
                    </List.Item>
                )}
            />

            <Divider />

            {/* Logo Section */}
            <Title level={4}>Logo</Title>
            <List
                size="small"
                dataSource={[
                    "Logo: (1) Text",
                    "Logo: (2) Logo"
                ]}
                renderItem={(item) => (
                    <List.Item>
                        <Text>{item}</Text>
                    </List.Item>
                )}
            />

            <Divider />

            {/* Page 2 Section */}
            <Title level={4}>Page 2</Title>
            <Text>Letter # – introduction language</Text>
            <br />
            <Text>Your Resources</Text>
        </div>
    );
};

export default BookContentPage;