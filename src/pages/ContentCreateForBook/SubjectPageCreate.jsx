import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    AllPagesBySubjectId,
    createSubjectPage,
    deleteSubjectPage,
} from '@/Network/Super_Admin/auth';
import {
    Button,
    Dropdown,
    Form,
    Table,
    Modal,
    Upload,
    message,
    InputNumber,
    Spin,
    Image,
    Empty,
    Alert,
    Tooltip,
    Popconfirm,
    Card,
    Statistic,
    Typography,
    Space,
    Input,
} from 'antd';
import { UploadOutlined, LoadingOutlined, } from '@ant-design/icons';
import { EllipsisVertical, EyeIcon, Trash2, Edit2, Search, ArrowLeft, RefreshCw, PlusCircle } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const { Title, Text } = Typography;
const { Search: AntSearch } = Input;

const SubjectPageCreate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [form] = Form.useForm();

    const [pagesData, setPagesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState(null);
    const [subjectInfo, setSubjectInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { id: subjectId } = params;
    const { classId } = location.state || {};

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    });

    // Validation and utility functions
    const validateImageFile = useCallback((file) => {
        const isImage = file.type.startsWith('image/');
        const isValidSize = file.size / 1024 / 1024 < 10; // 10MB limit
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);

        if (!isImage || !isValidType) {
            message.error('Please upload a valid image file (JPEG, PNG, or WebP)');
            return false;
        }

        if (!isValidSize) {
            message.error('Image size must be less than 10MB');
            return false;
        }

        return true;
    }, []);

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

    const resetForm = useCallback(() => {
        form.resetFields();
        setPreviewImage('');
        setFile(null);
        setError(null);
    }, [form]);

    // API functions
    const fetchPagesData = useCallback(async (page = 1) => {
        if (!subjectId) {
            setError('Subject ID is required');
            return;
        }

        try {
            setTableLoading(true);
            setError(null);

            const limit = pagination.pageSize;
            const response = await AllPagesBySubjectId(subjectId, page, limit);

            if (!response?.data) {
                throw new Error('Invalid response format');
            }

            const skip = (page - 1) * limit;
            const formattedData = response.data.map((item, index) => ({
                key: item._id,
                sno: skip + index + 1,
                classId: item.classId,
                subjectId: item.SubjectId?._id || 'Unknown',
                subjectName: item.SubjectId?.title || 'Unknown Subject',
                pagetitle: item.title || `Page ${skip + index + 1}`,
                pageImage: item.imageUrl,
                pageContentId: item.SubjectPageContent,
                _id: item._id,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            }));

            setPagesData(formattedData);
            setFilteredData(formattedData);

            // Extract subject info from first item if available
            if (formattedData.length > 0 && !subjectInfo) {
                setSubjectInfo({
                    name: formattedData[0].subjectName,
                    totalPages: response.pagination?.totalItems || formattedData.length,
                });
            }

            setPagination(prev => ({
                ...prev,
                current: page,
                total: response.pagination?.totalItems || formattedData.length,
            }));

        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch pages';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error fetching pages:', error);
            setPagesData([]);
            setFilteredData([]);
        } finally {
            setTableLoading(false);
        }
    }, [subjectId, pagination.pageSize, subjectInfo]);

    const handleSubmit = async (values) => {
        if (!values.pageNo) {
            message.error('Page number is required');
            return;
        }

        if (!file) {
            message.error('Please select an image');
            return;
        }

        if (!classId || !subjectId) {
            message.error('Missing required parameters');
            return;
        }

        try {
            setIsLoading(true);
            setIsUploading(true);
            setError(null);

            const base64Image = await convertToBase64(file);
            const payload = {
                classId: classId,
                SubjectId: subjectId,
                title: values.pageNo.toString(),
                imageUrl: base64Image
            };

            const response = await createSubjectPage(payload);

            if (response?.success !== false) {
                message.success('Subject page created successfully');
                setIsModalOpen(false);
                resetForm();

                // Refresh data to show new page
                await fetchPagesData(pagination.current);
            } else {
                throw new Error(response?.message || 'Failed to create subject page');
            }

        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to create subject page';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error creating subject page:', err);
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    const handleDelete = async (pageId, pageTitle) => {
        try {
            setIsDeleting(pageId);

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `You want to delete page "${pageTitle}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                allowOutsideClick: false,
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup',
                    header: 'swal2-header',
                    title: 'swal2-title',
                    closeButton: 'swal2-close',
                    icon: 'swal2-icon',
                    actions: 'swal2-actions',
                    confirmButton: 'swal2-confirm',
                    cancelButton: 'swal2-cancel',
                }
            });

            if (result.isConfirmed) {
                const response = await deleteSubjectPage(pageId);

                if (response.success) {
                    await Swal.fire(
                        'Deleted!',
                        `Page "${pageTitle}" has been deleted.`,
                        'success'
                    );
                    await fetchPagesData(pagination.current);
                } else {
                    throw new Error(response.message || 'Failed to delete page');
                }
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to delete page';
            await Swal.fire(
                'Error!',
                errorMessage,
                'error'
            );
            console.error('Error deleting page:', err);
        } finally {
            setIsDeleting(null);
        }
    };
      

    const handleImageUpload = async (file) => {
        if (!validateImageFile(file)) {
            return Upload.LIST_IGNORE;
        }

        try {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
            setFile(file);
        } catch (error) {
            message.error('Failed to process image');
            console.error('Error processing image:', error);
        }

        return false;
    };

    const handleModalCancel = useCallback(() => {
        setIsModalOpen(false);
        resetForm();
    }, [resetForm]);

    const handleTableChange = useCallback((newPagination) => {
        setPagination(prev => ({
            ...prev,
            ...newPagination,
        }));
        fetchPagesData(newPagination.current);
    }, [fetchPagesData]);

    const handleRefresh = useCallback(() => {
        fetchPagesData(pagination.current);
    }, [fetchPagesData, pagination.current]);

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);

        if (!value.trim()) {
            setFilteredData(pagesData);
        } else {
            const filtered = pagesData.filter(item =>
                item.subjectName.toLowerCase().includes(value.toLowerCase()) ||
                item.pagetitle.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filtered);
        }

        // Reset pagination when searching
        setPagination(prev => ({ ...prev, current: 1 }));
    }, [pagesData]);

    const handleGoBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // Effects
    useEffect(() => {
        if (!subjectId) {
            setError('Subject ID is missing');
            return;
        }

        fetchPagesData(1);
    }, [subjectId]);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, pagesData]);

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);


    // Handle Add Page Content
    const handleAddPageContent = useCallback((record)=>{
        if(!record._id||!record.subjectId || !record.classId){
            return
        }        

        try{
            navigate(`/eduworm-content/subjectPage/add/content/${record._id}`, {
                state: {
                    subjectId: record.subjectId,
                    classId: record.classId,
                },
            })
        }catch(error){
            console.log(error);
        }
    },[navigate])
    // Memoized values
    const columns = useMemo(() => [
        {
            title: 'S.No',
            dataIndex: 'sno',
            key: 'sno',
            width: 60,
            align: 'center',
        },
        {
            title: 'Subject Name',
            dataIndex: 'subjectName',
            key: 'subjectName',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Page Title',
            dataIndex: 'pagetitle',
            key: 'pagetitle',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Page Image',
            dataIndex: 'pageImage',
            key: 'pageImage',
            width: 120,
            render: (image) => (
                image ? (
                    <Image
                        src={image}
                        alt="Page"
                        width={60}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        preview={{
                            mask: <EyeIcon size={16} />,
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
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (createdAt) => {
                try {
                    return createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';
                } catch {
                    return 'Invalid Date';
                }
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    trigger={['click']}
                    menu={{
                        items: [
                            {
                                key: 'view',
                                label: (
                                    <div className="flex items-center gap-2 text-black">
                                        <EyeIcon size={14} /> View Details
                                    </div>
                                ),
                                onClick: () => message.info('View functionality coming soon'),
                            },
                            {
                                key: 'edit',
                                label: (
                                    <div className="flex items-center gap-2 text-blue-600" onClick={() => navigate(`/eduworm-content/subjectPage/edit/content/${record.pageContentId}`)}>
                                        <Edit2 size={14} /> Edit
                                        {console.log(record)}
                                    </div>
                                ),
                                onClick: () => message.info('Edit functionality coming soon'),
                            },
                            {
                                key: 'AddPageContnent',
                                label: (
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <PlusCircle size={14} /> Add Page Content
                                    </div>
                                ),
                                onClick: () => handleAddPageContent(record),
                            },
                            {
                                key: 'delete',
                                label: (
                                    <div
                                        className="flex items-center gap-2 text-red-500"
                                        onClick={() => handleDelete(record._id, record.pagetitle)}
                                    >
                                        {isDeleting === record._id ? (
                                            <LoadingOutlined size={14} />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                        Delete
                                    </div>
                                ),
                            },
                        ],
                    }}
                >
                    <Button type="link" style={{ color: 'black' }}>
                        <EllipsisVertical />
                    </Button>
                </Dropdown>
            ),
        },
    ], [handleDelete, isDeleting]);

    const isFormDisabled = isLoading || isUploading;

    return (
        <div className="p-0">
            {/* Subject Info Card */}
            {subjectInfo && (
                <Card className="mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Title level={4} className="mb-1">{subjectInfo?.name}</Title>
                        </div>
                        <Statistic
                            title="Total Pages"
                            value={subjectInfo.totalPages}
                            prefix={<span className="text-blue-600">📄</span>}
                        />
                    </div>
                </Card>
            )}

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

            {/* Search and Controls */}
            <div className="mb-4 mt-2 flex items-center justify-between">
                <AntSearch
                    placeholder="Search by subject name or page title..."
                    allowClear
                    enterButton={<Search size={16} />}
                    size="middle"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onSearch={handleSearch}
                    style={{ maxWidth: 400 }}
                />
                <Space>
                    <Tooltip title="Refresh data">
                        <Button
                            icon={<RefreshCw size={16} />}
                            onClick={handleRefresh}
                            loading={tableLoading}
                        />
                    </Tooltip>
                    <Button
                        type="primary"
                        icon={<PlusCircle size={18} />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Page
                    </Button>
                </Space>
            </div>

            {/* Table */}
            <Spin spinning={tableLoading} tip="Loading pages...">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    pagination={{
                        ...pagination,
                        position: ['bottomRight'],
                        pageSizeOptions: ['8', '16', '24', '50'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 'max-content' }}
                    className="custom-table"
                    locale={{
                        emptyText: (
                            <Empty
                                description={
                                    searchTerm
                                        ? "No pages found matching your search"
                                        : "No pages found for this subject"
                                }
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                {!searchTerm && (
                                    <Button
                                        type="primary"
                                        onClick={() => setIsModalOpen(true)}
                                        icon={<PlusCircle size={16} />}
                                    >
                                        Create First Page
                                    </Button>
                                )}
                            </Empty>
                        ),
                    }}
                />
            </Spin>

            {/* Create Page Modal */}
            <Modal
                title="Create New Subject Page"
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    disabled={isFormDisabled}
                >
                    <Form.Item
                        label="Page Number"
                        name="pageNo"
                        rules={[
                            { required: true, message: 'Page number is required' },
                            { type: 'number', min: 1, max: 9999, message: 'Page number must be between 1 and 9999' },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            max={9999}
                            className="w-full"
                            placeholder="Enter page number"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Page Image"
                        required
                        extra="Supported formats: JPEG, PNG, WebP (Max 10MB)"
                    >
                        {previewImage && (
                            <div className="mb-3 flex flex-col items-center">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    width={200}
                                    height={150}
                                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                                />
                                <Button
                                    type="link"
                                    danger
                                    onClick={() => {
                                        if (previewImage.startsWith('blob:')) {
                                            URL.revokeObjectURL(previewImage);
                                        }
                                        setPreviewImage('');
                                        setFile(null);
                                    }}
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
                                size="large"
                            >
                                {file ? 'Change Image' : 'Select Image'}
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading || isUploading}
                            block
                            size="large"
                        >
                            {isLoading ? 'Creating Page...' : 'Create Page'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Legacy Preview Modal (keeping for compatibility) */}
            {previewImage && !isModalOpen && (
                <Modal
                    open={!!previewImage}
                    onCancel={() => {
                        if (previewImage.startsWith('blob:')) {
                            URL.revokeObjectURL(previewImage);
                        }
                        setPreviewImage('');
                    }}
                    footer={null}
                    centered
                    width="auto"
                >
                    <Image
                        src={previewImage}
                        alt="Page Preview"
                        style={{ maxWidth: '100%', maxHeight: '80vh' }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default SubjectPageCreate;