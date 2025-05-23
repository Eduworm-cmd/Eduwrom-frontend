import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Button, 
    Dropdown, 
    Form, 
    Input, 
    Modal, 
    Select, 
    Table, 
    Upload, 
    message, 
    Spin,
    Empty,
    Tooltip,
    Popconfirm,
    Image,
    Alert
} from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { ClassesDropdown, CreateSubject, getSubjectByClassId} from '@/Network/Super_Admin/auth';
import { Edit2, EllipsisVertical, Eye, EyeIcon, PlusCircle, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const SubjectCreate = () => {
    // State management
    const [classes, setClasses] = useState([]);
    const [subjectImagePreview, setSubjectImagePreview] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [subjectData, setSubjectData] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    });
    
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Fetch classes on component mount
    const fetchClasses = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await ClassesDropdown();
            
            if (response?.data) {
                setClasses(response.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to fetch classes';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error fetching classes:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch subjects by class ID
    const fetchSubjectsByClassId = useCallback(async (classId) => {
        if (!classId) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await getSubjectByClassId(classId);
            
            if (response?.data) {
                const formattedData = response.data.map((item, index) => ({
                    key: item._id, // Add key for table
                    _id: item._id,
                    sno: index + 1,
                    subjectName: item.title || 'Untitled',
                    classId: item.classId?._id,
                    class: item.classId?.className || 'Unknown Class',
                    subjectImage: item.imageUrl,
                    createdAt: item.createdAt,
                    totalPages: item.SubjectPage?.length || 0,
                }));

                setSubjectData(formattedData);
                setPagination(prev => ({
                    ...prev,
                    total: formattedData.length,
                    current: 1, // Reset to first page when data changes
                }));
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to fetch subjects';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error fetching subjects:', err);
            setSubjectData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effects
    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    useEffect(() => {
        fetchSubjectsByClassId(selectedClassId);
    }, [selectedClassId, fetchSubjectsByClassId]);

    // Utility functions
    const convertToBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                try {
                    const result = reader.result.split(',')[1];
                    resolve(result);
                } catch (error) {
                    reject(new Error('Failed to convert file to base64'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
        });
    }, []);

    const validateImageFile = useCallback((file) => {
        const isImage = file.type.startsWith('image/');
        const isValidSize = file.size / 1024 / 1024 < 5; // 5MB limit
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);

        if (!isImage || !isValidType) {
            message.error('Please upload a valid image file (JPEG, PNG, or WebP)');
            return false;
        }

        if (!isValidSize) {
            message.error('Image size must be less than 5MB');
            return false;
        }

        return true;
    }, []);

    // Event handlers
    const handleSubmit = async (values) => {
        const { classId, title } = values;

        if (!title?.trim()) {
            message.error('Subject title is required');
            return;
        }

        try {
            setIsLoading(true);
            let imageUrl = '';

            if (file) {
                setIsUploading(true);
                const base64Image = await convertToBase64(file);
                imageUrl = base64Image;
            }

            const payload = {
                classId,
                title: title.trim(),
                imageUrl,
            };

            const response = await CreateSubject(payload);
            
            if (response?.success !== false) {
                message.success('Subject created successfully');
                setIsModalOpen(false);
                form.resetFields();
                resetImageState();
                
                // Refresh the subjects list if the same class is selected
                if (selectedClassId === classId) {
                    await fetchSubjectsByClassId(classId);
                }
            } else {
                throw new Error(response?.message || 'Failed to create subject');
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to create subject';
            message.error(errorMessage);
            console.error('Error creating subject:', err);
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    const handleDelete = async (id, subjectName) => {
        // try {
        //     setIsDeleting(id);
            
        //     // If deleteSubject API exists, use it
        //     if (typeof deleteSubject === 'function') {
        //         await deleteSubject(id);
        //         message.success(`Subject "${subjectName}" deleted successfully`);
                
        //         // Refresh the subjects list
        //         await fetchSubjectsByClassId(selectedClassId);
        //     } else {
        //         // Fallback if API doesn't exist yet
        //         message.info(`Delete functionality for "${subjectName}" will be implemented soon`);
        //     }
        // } catch (err) {
        //     const errorMessage = err?.response?.data?.message || err.message || 'Failed to delete subject';
        //     message.error(errorMessage);
        //     console.error('Error deleting subject:', err);
        // } finally {
        //     setIsDeleting(null);
        // }
    };

    const handleImageUpload = async (file) => {
        if (!validateImageFile(file)) {
            return Upload.LIST_IGNORE;
        }

        try {
            const base64 = await convertToBase64(file);
            setPreviewImage(`data:${file.type};base64,${base64}`);
            setFile(file);
        } catch (error) {
            message.error('Failed to process image');
            console.error('Error processing image:', error);
        }

        return false; // Prevent automatic upload
    };

    const resetImageState = useCallback(() => {
        setPreviewImage('');
        setFile(null);
    }, []);

    const handleModalCancel = useCallback(() => {
        setIsModalOpen(false);
        form.resetFields();
        resetImageState();
    }, [form, resetImageState]);

    const handleTableChange = useCallback((newPagination) => {
        setPagination(prev => ({
            ...prev,
            ...newPagination,
        }));
    }, []);

    const handleRefresh = useCallback(() => {
        if (selectedClassId) {
            fetchSubjectsByClassId(selectedClassId);
        } else {
            fetchClasses();
        }
    }, [selectedClassId, fetchSubjectsByClassId, fetchClasses]);

    const handleTotalPagesClick = useCallback((record) => {
        const { classId, _id } = record;
        
        if (!_id || !classId) {
            message.error('Missing required data for navigation');
            console.error('Missing required data:', { _id, classId });
            return;
        }

        try {
            navigate(`/eduworm-content/subjectPage/add/${_id}`, {
                state: { classId },
            });
        } catch (error) {
            message.error('Failed to navigate to subject pages');
            console.error('Navigation error:', error);
        }
    }, [navigate]);

    // Memoized values
    const columns = useMemo(() => [
        { 
            title: "S.No", 
            dataIndex: "sno", 
            key: "sno",
            width: 60,
            align: 'center',
        },
        { 
            title: "Subject Name", 
            dataIndex: "subjectName", 
            key: "subjectName",
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            ),
        },
        { 
            title: "Class", 
            dataIndex: "class", 
            key: "class",
            width: 100,
        },
        {
            title: "Subject Image", 
            dataIndex: "subjectImage", 
            key: "subjectImage",
            width: 120,
            render: (image) => (
                image ? (
                    <Image
                        src={image}
                        alt="Subject"
                        width={60}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        preview={{
                            mask: <Eye size={16} />,
                        }}
                    />
                ) : (
                    <div className="w-15 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )
            ),
        },
        {
            title: "Total Pages",
            dataIndex: "totalPages",
            key: "totalPages",
            width: 120,
            align: 'center',
            render: (val, record) => (
                <Tooltip title="Click to view/manage pages">
                    <div
                        className="flex items-center justify-center gap-2 text-blue-600 cursor-pointer hover:text-blue-800"
                        onClick={() => handleTotalPagesClick(record)}
                    >
                        {val} <Eye size={14} />
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            render: (createdAt) => {
                try {
                    return new Date(createdAt).toLocaleDateString();
                } catch {
                    return 'Invalid Date';
                }
            },
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: [
                            {
                                key: "view",
                                label: (
                                    <div className="flex items-center gap-2 text-black">
                                        <EyeIcon size={14} /> View Details
                                    </div>
                                ),
                                onClick: () => handleTotalPagesClick(record),
                            },
                            {
                                key: "edit",
                                label: (
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Edit2 size={14} /> Edit
                                    </div>
                                ),
                                onClick: () => message.info('Edit functionality coming soon'),
                            },
                            {
                                key: "delete",
                                label: (
                                    <Popconfirm
                                        title="Delete Subject"
                                        description={`Are you sure you want to delete "${record.subjectName}"?`}
                                        onConfirm={() => handleDelete(record._id, record.subjectName)}
                                        okText="Yes"
                                        cancelText="No"
                                        okButtonProps={{ danger: true }}
                                    >
                                        <div className="flex items-center gap-2 text-red-500">
                                            {isDeleting === record._id ? (
                                                <LoadingOutlined size={14} />
                                            ) : (
                                                <Trash2 size={14} />
                                            )}
                                            Delete
                                        </div>
                                    </Popconfirm>
                                ),
                            },
                        ],
                    }}
                >
                    <Button type="link" style={{ color: "black" }}>
                        <EllipsisVertical />
                    </Button>
                </Dropdown>
            ),
        },
    ], [handleTotalPagesClick, handleDelete, isDeleting]);

    const isFormDisabled = isLoading || isUploading;

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Subject Management</h2>
                <div className="flex gap-2">
                    <Tooltip title="Refresh data">
                        <Button 
                            icon={<RefreshCw size={16} />} 
                            onClick={handleRefresh}
                            loading={isLoading}
                        />
                    </Tooltip>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                    className="mb-4"
                />
            )}

            {/* Controls */}
            <div className="flex justify-end gap-2 mb-4">
                <Select
                    className="w-1/4 min-w-48"
                    placeholder="Select Class"
                    onChange={setSelectedClassId}
                    value={selectedClassId}
                    loading={isLoading}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {classes.map((cls) => (
                        <Option key={cls._id} value={cls._id}>
                            {cls.className}
                        </Option>
                    ))}
                </Select>

                <Button
                    type="primary"
                    icon={<PlusCircle size={18} />}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    Create Subject
                </Button>
            </div>

            {/* Table */}
            <Spin spinning={isLoading} tip="Loading subjects...">
                <Table
                    columns={columns}
                    dataSource={subjectData}
                    pagination={{
                        ...pagination,
                        position: ["bottomRight"],
                        pageSizeOptions: ["8", "16", "24", "50"],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                    className="custom-table"
                    locale={{
                        emptyText: selectedClassId ? (
                            <Empty 
                                description="No subjects found for this class" 
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <Empty 
                                description="Please select a class to view subjects" 
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                />
            </Spin>

            {/* Create Subject Modal */}
            <Modal
                title="Create New Subject"
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                    disabled={isFormDisabled}
                >
                    <Form.Item
                        name="classId"
                        label="Class"
                        rules={[{ required: true, message: 'Please select a class' }]}
                    >
                        <Select 
                            placeholder="Select a class"
                            showSearch
                            filterOption={(input, option) =>
                                option?.children?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {classes.map((cls) => (
                                <Option key={cls._id} value={cls._id}>
                                    {cls.className}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Subject Title"
                        rules={[
                            { required: true, message: 'Please enter a subject title' },
                            { min: 2, message: 'Title must be at least 2 characters' },
                            { max: 100, message: 'Title must not exceed 100 characters' },
                        ]}
                    >
                        <Input 
                            placeholder="Enter subject title" 
                            showCount
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item label="Subject Image">
                        {previewImage && (
                            <div className="mb-3 flex flex-col items-center">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    width={128}
                                    height={128}
                                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                                />
                                <Button
                                    type="link"
                                    danger
                                    onClick={resetImageState}
                                    className="mt-2"
                                >
                                    Remove Image
                                </Button>
                            </div>
                        )}

                        <Upload
                            showUploadList={false}
                            accept="image/jpeg,image/png,image/webp"
                            beforeUpload={handleImageUpload}
                            disabled={isUploading}
                        >
                            <Button 
                                icon={<UploadOutlined />} 
                                loading={isUploading}
                                disabled={isFormDisabled}
                            >
                                {file ? 'Change Image' : 'Select Image'}
                            </Button>
                        </Upload>
                        <div className="text-gray-500 text-sm mt-1">
                            Supported formats: JPEG, PNG, WebP (Max 5MB)
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading || isUploading}
                            block
                            size="large"
                        >
                            {isLoading ? 'Creating Subject...' : 'Create Subject'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Legacy Image Preview Modal (keeping for compatibility) */}
            {subjectImagePreview && (
                <Modal
                    open={!!subjectImagePreview}
                    onCancel={() => setSubjectImagePreview(null)}
                    footer={null}
                    centered
                    width="auto"
                >
                    <Image 
                        src={subjectImagePreview} 
                        alt="Subject Preview" 
                        style={{ maxWidth: '100%', maxHeight: '80vh' }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default SubjectCreate;