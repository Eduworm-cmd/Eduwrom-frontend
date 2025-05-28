import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
    Form, Input, Button, Upload, Card, Space, Typography, Row, Col, message, Spin, Tooltip
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    InboxOutlined,
    SaveOutlined,
    ReloadOutlined,
    EditOutlined
} from '@ant-design/icons';
import RichtoolEditor from '@/components/RichtoolEditor/RichtoolEditor';
import {
    subjectPageContentGet,
    subjectPageContentUpdate
} from '@/Network/Super_Admin/auth';
import { ToastContainer } from 'react-toastify';
import { FileText } from 'lucide-react';

const { Text } = Typography;
const { Dragger } = Upload;

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Utility Functions
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const validateFile = (file) => {
    if (!file) return { isValid: false, error: 'No file selected' };

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return {
            isValid: false,
            error: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)'
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: 'File size must be less than 10MB'
        };
    }

    return { isValid: true };
};

const SubjectPageContentEdit = () => {
    // Hooks
    const [form] = Form.useForm();
    const location = useLocation();
    const params = useParams();
    const { id: contentId } = params;
    const { classId, subjectId } = location.state || {};

    // State
    const [loading, setLoading] = useState({
        submit: false,
        avatarUpload: false,
        initialLoad: true
    });

    const [formData, setFormData] = useState({
        contentAvtar: null,
        objectives: [{ objectiveTitle: '', objectiveValue: '' }],
        interactiveActivity: [{ title: '', link: '', poster: null }]
    });

    const [originalData, setOriginalData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [activityFileLists, setActivityFileLists] = useState({});
    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);

    // Fetch content data on component mount
    useEffect(() => {
        let isMounted = true;

        const fetchContentData = async () => {
            if (!contentId) {
                message.error('Content ID is missing');
                setLoading(prev => ({ ...prev, initialLoad: false }));
                return;
            }

            try {
                console.log('Fetching content for ID:', contentId);
                const response = await subjectPageContentGet(contentId);
                console.log('API Response:', response);

                if (!isMounted) return;

                // Handle different response structures
                const contentData = response?.data?.data || response?.data || response;
                console.log("Content Data:", contentData);

                if (!contentData) {
                    throw new Error('No content data received');
                }

                // Process objectives - ensure at least one exists
                const objectives = contentData.objectives && contentData.objectives.length > 0
                    ? contentData.objectives.map(obj => ({
                        objectiveTitle: obj.objectiveTitle || '',
                        objectiveValue: obj.objectiveValue || '',
                        _id: obj._id
                    }))
                    : [{ objectiveTitle: '', objectiveValue: '' }];

                // Process activities - ensure at least one exists  
                const activities = contentData.interactiveActivity && contentData.interactiveActivity.length > 0
                    ? contentData.interactiveActivity.map(act => ({
                        title: act.title || '',
                        link: act.link || '',
                        poster: act.poster || null,
                        _id: act._id
                    }))
                    : [{ title: '', link: '', poster: null }];

                const processedData = {
                    contentAvtar: contentData.contentAvtar || null,
                    objectives,
                    interactiveActivity: activities
                };

                // Prepare complete original data
                const completeOriginalData = {
                    ...processedData,
                    title: contentData.title || '',
                    duration: contentData.duration || ''
                };

                // Update all state at once
                if (isMounted) {
                    setOriginalData(completeOriginalData);
                    setFormData(processedData);

                    // Set file list if main content image exists
                    if (contentData.contentAvtar) {
                        setFileList([{
                            uid: '-1',
                            name: 'content-image',
                            status: 'done',
                            url: contentData.contentAvtar
                        }]);
                    }

                    // Set file lists for activity posters
                    const activityLists = {};
                    activities.forEach((activity, index) => {
                        if (activity.poster) {
                            activityLists[index] = [{
                                uid: `activity-${index}`,
                                name: `activity-poster-${index}`,
                                status: 'done',
                                url: activity.poster
                            }];
                        } else {
                            activityLists[index] = [];
                        }
                    });
                    setActivityFileLists(activityLists);

                    // Set form field values after all state is updated
                    form.setFieldsValue({
                        title: completeOriginalData.title,
                        duration: completeOriginalData.duration
                    });

                    console.log('Data successfully loaded and form initialized');
                }

            } catch (error) {
                console.error('Error fetching content:', error);
                if (isMounted) {
                    message.error(error.message || 'Failed to load content data');
                }
            } finally {
                if (isMounted) {
                    setLoading(prev => ({ ...prev, initialLoad: false }));
                }
            }
        };

        fetchContentData();

        return () => {
            isMounted = false;
        };
    }, [contentId, form]);

    // Add this effect to handle cases where form initialization might be missed
    useEffect(() => {
        if (originalData && !loading.initialLoad) {
            form.setFieldsValue({
                title: originalData.title,
                duration: originalData.duration
            });
        }
    }, [originalData, loading.initialLoad, form]);

    // File upload handlers
    const handleAvatarUpload = useCallback(async (options) => {
        const { file, onSuccess, onError } = options;

        setLoading(prev => ({ ...prev, avatarUpload: true }));

        try {
            const validation = validateFile(file);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            const base64 = await convertFileToBase64(file);
            setFormData(prev => ({ ...prev, contentAvtar: base64 }));
            setFileList([{
                uid: file.uid,
                name: file.name,
                status: 'done',
                url: base64
            }]);

            onSuccess();
            message.success('Image uploaded successfully');
        } catch (error) {
            console.log(error);
            onError(error);
            message.error(error.message);
        } finally {
            setLoading(prev => ({ ...prev, avatarUpload: false }));
        }
    }, []);

    const handlePreview = useCallback((file) => {
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    }, []);

    const handleRemoveAvatar = useCallback(() => {
        setFormData(prev => ({ ...prev, contentAvtar: null }));
        setFileList([]);
        message.success('Image removed');
    }, []);

    // Objective handlers
    const handleObjectiveChange = useCallback((index, field, value) => {
        setFormData(prev => {
            const newObjectives = [...prev.objectives];
            newObjectives[index] = {
                ...newObjectives[index],
                [field]: value,
                _id: newObjectives[index]?._id
            };
            return { ...prev, objectives: newObjectives };
        });
    }, []);

    const addObjective = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            objectives: [...prev.objectives, { objectiveTitle: '', objectiveValue: '' }]
        }));
        message.success('New objective added');
    }, []);

    const removeObjective = useCallback((index) => {
        if (formData.objectives.length <= 1) {
            message.warning('At least one objective is required');
            return;
        }

        setFormData(prev => {
            const newObjectives = prev.objectives.filter((_, i) => i !== index);
            return { ...prev, objectives: newObjectives };
        });
        message.success('Objective removed');
    }, [formData.objectives.length]);

    // Activity handlers
    const handleActivityChange = useCallback((index, field, value) => {
        setFormData(prev => {
            const newActivities = [...prev.interactiveActivity];
            newActivities[index] = {
                ...newActivities[index],
                [field]: value,
                _id: newActivities[index]?._id
            };
            return { ...prev, interactiveActivity: newActivities };
        });
    }, []);

    const handleActivityPosterUpload = useCallback(async (index, file) => {
        try {
            const validation = validateFile(file);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            const base64 = await convertFileToBase64(file);

            // Update form data
            setFormData(prev => {
                const newActivities = [...prev.interactiveActivity];
                newActivities[index] = {
                    ...newActivities[index],
                    poster: base64,
                    _id: newActivities[index]?._id
                };
                return { ...prev, interactiveActivity: newActivities };
            });

            // Update file list for this specific activity
            setActivityFileLists(prev => ({
                ...prev,
                [index]: [{
                    uid: file.uid || `activity-${index}-${Date.now()}`,
                    name: file.name,
                    status: 'done',
                    url: base64
                }]
            }));

            message.success('Activity poster uploaded successfully');
            return false;
        } catch (error) {
            console.log(error);
            message.error(error.message);
            return false;
        }
    }, []);

    const handleActivityPosterRemove = useCallback((index) => {
        setFormData(prev => {
            const newActivities = [...prev.interactiveActivity];
            newActivities[index] = {
                ...newActivities[index],
                poster: null,
                _id: newActivities[index]?._id
            };
            return { ...prev, interactiveActivity: newActivities };
        });

        setActivityFileLists(prev => ({
            ...prev,
            [index]: []
        }));

        message.success('Activity poster removed');
    }, []);

    const addActivity = useCallback(() => {
        const newIndex = formData.interactiveActivity.length;
        setFormData(prev => ({
            ...prev,
            interactiveActivity: [...prev.interactiveActivity, { title: '', link: '', poster: null }]
        }));

        // Initialize empty file list for new activity
        setActivityFileLists(prev => ({
            ...prev,
            [newIndex]: []
        }));

        message.success('New activity added');
    }, [formData.interactiveActivity.length]);

    const removeActivity = useCallback((index) => {
        if (formData.interactiveActivity.length <= 1) {
            message.warning('At least one activity slot is required');
            return;
        }

        setFormData(prev => {
            const newActivities = prev.interactiveActivity.filter((_, i) => i !== index);
            return { ...prev, interactiveActivity: newActivities };
        });

        // Remove file list for removed activity and reindex remaining ones
        setActivityFileLists(prev => {
            const newLists = {};
            Object.keys(prev).forEach(key => {
                const keyIndex = parseInt(key);
                if (keyIndex < index) {
                    newLists[keyIndex] = prev[key];
                } else if (keyIndex > index) {
                    newLists[keyIndex - 1] = prev[key];
                }
                // Skip the removed index
            });
            return newLists;
        });

        message.success('Activity removed');
    }, [formData.interactiveActivity.length]);

    // Form submission
    const handleSubmit = useCallback(async (values) => {
        if (!contentId) {
            message.error('Content ID is missing');
            return;
        }

        setLoading(prev => ({ ...prev, submit: true }));

        try {
            // Validation
            if (!formData.contentAvtar) {
                throw new Error('Content image is required');
            }

            const hasEmptyObjectives = formData.objectives.some(
                obj => !obj.objectiveTitle.trim() || !obj.objectiveValue.trim()
            );

            if (hasEmptyObjectives) {
                throw new Error('All objective fields must be completed');
            }

            // Prepare payload
            const payload = {
                ...(classId && { classId }),
                ...(subjectId && { SubjectId: subjectId }),
                SubjectPageId: contentId,
                contentAvtar: formData.contentAvtar,
                title: values.title,
                duration: values.duration,
                objectives: formData.objectives.map(obj => ({
                    objectiveTitle: obj.objectiveTitle,
                    objectiveValue: obj.objectiveValue,
                    ...(obj._id && { _id: obj._id })
                })),
                interactiveActivity: formData.interactiveActivity
                    .filter(activity => activity.title || activity.link || activity.poster)
                    .map(act => ({
                        title: act.title || '',
                        link: act.link || '',
                        poster: act.poster,
                        ...(act._id && { _id: act._id })
                    }))
            };

            console.log('Submitting payload:', payload);

            const response = await subjectPageContentUpdate(contentId, payload);

            // Handle different response structures for success check
            const isSuccess = response?.data?.success || response?.success || true;

            if (isSuccess) {
                message.success('Content updated successfully!');

                // Refresh the data after successful update
                try {
                    const refreshResponse = await subjectPageContentGet(contentId);
                    const updatedData = refreshResponse?.data?.data || refreshResponse?.data || refreshResponse;

                    if (updatedData) {
                        const updatedActivities = updatedData.interactiveActivity?.length > 0
                            ? updatedData.interactiveActivity
                            : [{ title: '', link: '', poster: null }];

                        const updatedFormData = {
                            contentAvtar: updatedData.contentAvtar,
                            objectives: updatedData.objectives?.length > 0 ? updatedData.objectives : [{ objectiveTitle: '', objectiveValue: '' }],
                            interactiveActivity: updatedActivities
                        };

                        setFormData(updatedFormData);
                        setOriginalData({
                            ...updatedFormData,
                            title: updatedData.title,
                            duration: updatedData.duration
                        });

                        // Update main content file list
                        if (updatedData.contentAvtar) {
                            setFileList([{
                                uid: '-1',
                                name: 'content-image',
                                status: 'done',
                                url: updatedData.contentAvtar
                            }]);
                        }

                        // Update activity file lists
                        const newActivityLists = {};
                        updatedActivities.forEach((activity, index) => {
                            if (activity.poster) {
                                newActivityLists[index] = [{
                                    uid: `activity-${index}`,
                                    name: `activity-poster-${index}`,
                                    status: 'done',
                                    url: activity.poster
                                }];
                            } else {
                                newActivityLists[index] = [];
                            }
                        });
                        setActivityFileLists(newActivityLists);

                        // Update form values
                        form.setFieldsValue({
                            title: updatedData.title || '',
                            duration: updatedData.duration || ''
                        });
                    }
                } catch (refreshError) {
                    console.error('Error refreshing data:', refreshError);
                }
            } else {
                throw new Error(response?.data?.message || response?.message || 'Failed to update content');
            }
        } catch (error) {
            console.error('Submit error:', error);
            message.error(error.message || 'An error occurred while updating');
        } finally {
            setLoading(prev => ({ ...prev, submit: false }));
        }
    }, [contentId, classId, subjectId, formData, form]);

    // Reset form to original loaded values
    const handleReset = useCallback(() => {
        if (!originalData) {
            message.warning('No original data to reset to');
            return;
        }

        // Reset form fields
        form.setFieldsValue({
            title: originalData.title,
            duration: originalData.duration
        });

        // Reset form data
        setFormData({
            contentAvtar: originalData.contentAvtar,
            objectives: originalData.objectives.map(obj => ({ ...obj })),
            interactiveActivity: originalData.interactiveActivity.map(act => ({ ...act }))
        });

        // Reset main content file list
        if (originalData.contentAvtar) {
            setFileList([{
                uid: '-1',
                name: 'content-image',
                status: 'done',
                url: originalData.contentAvtar
            }]);
        } else {
            setFileList([]);
        }

        // Reset activity file lists
        const resetActivityLists = {};
        originalData.interactiveActivity.forEach((activity, index) => {
            if (activity.poster) {
                resetActivityLists[index] = [{
                    uid: `activity-${index}`,
                    name: `activity-poster-${index}`,
                    status: 'done',
                    url: activity.poster
                }];
            } else {
                resetActivityLists[index] = [];
            }
        });
        setActivityFileLists(resetActivityLists);

        message.success('Form reset to original values');
    }, [form, originalData]);

    if (loading.initialLoad || !originalData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin tip="Loading content..." size="large" />
            </div>
        );
    }

    return (
        <div className="">
            <ToastContainer />
            <div className="">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    disabled={loading.submit}
                    size="large"
                    preserve={false}
                    initialValues={{
                        title: originalData.title,
                        duration: originalData.duration
                    }}
                >
                    {/* Basic Information */}
                 

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-600 to-indigo-100 px-2 py-2 mb-6">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <FileText className="mr-2" size={20} />
                                Edit Content
                            </h2>
                        </div>
                        <Row gutter={[24, 16]}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="title"
                                    label="Title"
                                    rules={[
                                        { required: true, message: 'Title is required' },
                                        { min: 3, message: 'Title must be at least 3 characters' },
                                        { max: 100, message: 'Title cannot exceed 100 characters' }
                                    ]}
                                >
                                    <Input placeholder="Enter content title" className="rounded-lg" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="duration"
                                    label="Duration"
                                    rules={[
                                        { required: true, message: 'Duration is required' },
                                        { message: 'Enter valid duration (e.g., "45")' }
                                    ]}
                                >
                                    <Input
                                        placeholder="e.g., 45 minutes"
                                        className="rounded-lg"
                                        type="number"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Content Image */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-600 to-indigo-100 px-2 py-2 mb-6">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <FileText className="mr-2" size={20} />
                                Title Image
                            </h2>
                        </div>
                        <Card size="small" style={{ marginBottom: "20px" }} >
                            <div className="mb-3">
                                <Text strong>Required * - Upload a representative image for this content</Text>
                            </div>

                            <Dragger
                                name="avatar"
                                listType="picture-card"
                                fileList={fileList}
                                customRequest={handleAvatarUpload}
                                onPreview={handlePreview}
                                onRemove={handleRemoveAvatar}
                                maxCount={1}
                                className="rounded-md"
                            >
                                {!formData.contentAvtar && (
                                    <div>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                                        </p>
                                        <p className="ant-upload-text text-lg font-medium">
                                            Click or drag image to upload
                                        </p>
                                        <p className="ant-upload-hint text-gray-500">
                                            Support JPEG, PNG, GIF, WebP (Max: 10MB)
                                        </p>
                                    </div>
                                )}
                            </Dragger>

                            {loading.avatarUpload && (
                                <div className="text-center mt-4 p-4 bg-blue-50 rounded-lg">
                                    <Spin size="small" />
                                    <Text className="ml-2 text-blue-600">Uploading image...</Text>
                                </div>
                            )}
                        </Card>
                        </div>
                   

                    {/* Learning Objectives */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-600 to-indigo-100 px-2 py-2">
                            <h2 className="text-xl font-semibold  text-white flex justify-between">
                               <div className='flex items-center'>
                                    <FileText className="mr-2" size={20} />
                                    Learning Objectives
                               </div>
                                <div>
                                    
                                        <Button
                                            type="default"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={addObjective}
                                        className="rounded-lg "
                                        style={{
                                            backgroundColor: "#3b82f6",
                                            color: "#fff",
                                            borderColor: "#3b82f6",
                                        }}
                                        >
                                            Add Objective
                                        </Button>
                                    
                                </div>
                            </h2>
                        </div>
                        <Card title=" " className="p-0">
                            <Space direction="vertical" size="large" className="w-full mt-0">
                                {formData.objectives.map((objective, index) => (
                                    <Card
                                        key={objective._id || index}
                                        size="small"
                                        className="border-dashed border-gray-300 bg-gray-50 !mt-0" 
                                        title={
                                            <div className="flex justify-between items-center">
                                                <Text strong className="text-blue-600">
                                                    Objective {index + 1}
                                                </Text>
                                                {formData.objectives.length > 1 && (
                                                    <Tooltip title="Remove objective">
                                                        <Button
                                                            type="text"
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => removeObjective(index)}
                                                            className="rounded-full"
                                                        />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        }
                                    >
                                        <Space direction="vertical" size="middle" className="w-full">
                                            <div>
                                                <Text strong className="text-red-500">* </Text>
                                                <Text strong>Title</Text>
                                                <Input
                                                    value={objective.objectiveTitle}
                                                    onChange={(e) => handleObjectiveChange(index, 'objectiveTitle', e.target.value)}
                                                    placeholder="Enter objective title"
                                                    className="mt-2 rounded-lg"
                                                />
                                            </div>

                                            <div>
                                                <Text strong className="text-red-500">* </Text>
                                                <Text strong>Content</Text>
                                                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                                                    <RichtoolEditor
                                                        editorValue={objective.objectiveValue}
                                                        onEditorChange={(newContent) =>
                                                            handleObjectiveChange(index, 'objectiveValue', newContent)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </Space>
                                    </Card>
                                ))}
                            </Space>
                        </Card>
                        </div>
                    

                    {/* Interactive Activities */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-600 to-indigo-100 px-2 py-2">
                            <h2 className="text-xl font-semibold text-white flex items-center justify-between">
                               <div className='flex items-center'>
                                    <FileText className="mr-2" size={20} />
                                    Interactive Activities
                               </div>

                                <div>
                                    <Button
                                        type="default"
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={addActivity}
                                        className="rounded-lg"
                                        style={{
                                            backgroundColor: "#3b82f6",
                                            color: "#fff",
                                            borderColor: "#3b82f6",
                                        }}
                                    >
                                        Add Activity
                                    </Button>
                                </div>
                            </h2>
                        </div>
                        <Card
                           
                          
                        >
                            <div className="mb-4">
                                <Text>Optional activities to enhance learning experience</Text>
                            </div>
                            <Space direction="vertical" size="large" className="w-full">
                                {formData.interactiveActivity.map((activity, index) => (
                                    <Card
                                        key={activity._id || index}
                                        size="small"
                                        className="border-dashed border-gray-300 bg-gray-50"
                                        title={
                                            <div className="flex justify-between items-center">
                                                <Text strong className="text-green-600">Activity {index + 1}</Text>
                                                {formData.interactiveActivity.length > 1 && (
                                                    <Tooltip title="Remove activity">
                                                        <Button
                                                            type="text"
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => removeActivity(index)}
                                                            className="rounded-full"
                                                        />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        }
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={8}>
                                                <Text strong>Activity Title</Text>
                                                <Input
                                                    value={activity.title}
                                                    onChange={(e) => handleActivityChange(index, 'title', e.target.value)}
                                                    placeholder="Enter activity title"
                                                    className="mt-2 rounded-lg"
                                                />
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Text strong>Link</Text>
                                                <Input
                                                    value={activity.link}
                                                    onChange={(e) => handleActivityChange(index, 'link', e.target.value)}
                                                    placeholder="https://example.com"
                                                    className="mt-2 rounded-lg"
                                                />
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Text strong>Poster Image</Text>
                                                <Upload
                                                    listType="picture-card"
                                                    maxCount={1}
                                                    fileList={activityFileLists[index] || []}
                                                    beforeUpload={(file) => handleActivityPosterUpload(index, file)}
                                                    showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                                                    onRemove={() => handleActivityPosterRemove(index)}
                                                    onPreview={handlePreview}
                                                >
                                                    {(!activity.poster || !activityFileLists[index]?.length) && (
                                                        <div className="p-4">
                                                            <PlusOutlined />
                                                            <div style={{ marginTop: 8 }}>Upload</div>
                                                        </div>
                                                    )}
                                                </Upload>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </Space>
                        </Card>
                        </div>
                    

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 mt-5">
                        <Button
                            size="large"
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                            disabled={loading.submit}
                            className="min-w-32 rounded-lg"
                        >
                            Reset Form
                        </Button>

                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading.submit}
                            className="min-w-40 rounded-lg bg-blue-600 hover:bg-blue-700"
                        >
                            {loading.submit ? 'Updating...' : 'Update Content'}
                        </Button>
                    </div>
                </Form>
            </div>

            {/* Image Preview Modal */}
            {previewVisible && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setPreviewVisible(false)}
                >
                    <div className="bg-white p-4 rounded-lg max-w-2xl max-h-96">
                        <img alt="Preview" className="max-w-full max-h-full object-contain" src={previewImage} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectPageContentEdit;