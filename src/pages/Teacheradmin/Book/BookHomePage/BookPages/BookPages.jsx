import React, { useEffect, useState } from "react";
import { Modal, Tooltip, Button, Image, Spin, message } from "antd";
import {
    EyeOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CircleArrowRight } from 'lucide-react';



const SkillBuilderViewer = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [rotation, setRotation] = useState(0);
    const params = useParams();
    const {id} = params;

    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await fetch(
                    `http://localhost:4000/api/subjectPage/${id}`
                );
                const result = await response.json();

               
                if (result.success && Array.isArray(result.data)) {
                    setPages(result.data);
                } else {
                    message.error("Invalid API response format");
                }
            } catch (err) {
                console.error("Error fetching pages:", err);
                message.error("Failed to fetch pages");
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    const showModal = (src) => {
        setSelectedImage(src);
        setRotation(0);
        setIsModalVisible(true);
    };

    const handleCancel = () => setIsModalVisible(false);

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                    {pages.map((page) => (
                        <div
                            key={page._id}
                            className="border rounded-lg shadow hover:shadow-lg transition"
                        >
                            {/* IMAGE WRAPPER with OVERLAY */}
                            <div className="relative group">
                                <Image
                                    src={page.imageUrl}
                                    alt={page.title}
                                    preview={false}
                                    className="w-full h-auto rounded-t-lg"
                                />

                                {/* Eye icon overlay on image only */}
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex justify-center items-center rounded-t-lg">
                                    <Tooltip title="View">
                                        <Button
                                            shape="circle"
                                            icon={<EyeOutlined />}
                                            onClick={() => showModal(page.imageUrl)}
                                        />
                                    </Tooltip>
                                </div>
                            </div>

                            {/* Title below image */}
                            <div className="flex justify-between py-2 px-2 font-semibold">
                                {page.title}
                                <span onClick={() => navigate(`/eduworm-Teacher/book/pgContent/${id}`,{
                                    state: page
                                })} className="text-gray-400 flex cursor-pointer justify-end"> <CircleArrowRight /></span>
                                
                            </div>
                           
                        </div>

                    ))}
                </div>
            )}

            <Modal
                open={isModalVisible}
                footer={[
                    <Button key="rotateLeft" onClick={() => setRotation(rotation - 90)}>
                        <RotateLeftOutlined />
                    </Button>,
                    <Button key="rotateRight" onClick={() => setRotation(rotation + 90)}>
                        <RotateRightOutlined />
                    </Button>,
                ]}
                onCancel={handleCancel}
                width={800}
                centered
            >
                <div className="flex justify-center items-center">
                    <img
                        src={selectedImage}
                        alt="Zoomed"
                        style={{ transform: `rotate(${rotation}deg)`, maxWidth: "100%" }}
                    />
                </div>
            </Modal>
        </>
    );
};

export default SkillBuilderViewer;
