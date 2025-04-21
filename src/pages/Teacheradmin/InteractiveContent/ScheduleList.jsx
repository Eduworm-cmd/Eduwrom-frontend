import React, { useState } from 'react';
import { Table, Modal, Input, Select, Button, Badge, Tooltip } from 'antd';
import {
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    ReloadOutlined,
    EyeOutlined,
} from '@ant-design/icons';
const { Option } = Select;

const ScheduleList = () => {
    // State variables
    const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
    const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [gradeFilter, setGradeFilter] = useState(null);
    const [classFilter, setClassFilter] = useState(null);
    const [searchText, setSearchText] = useState('');

    // Static data for schedules
    const scheduleData = [
        {
            key: '1',
            srNo: 1,
            title: 'Demo Playlist',
            assignedClasses: 'KG - 1',
            assignedStudents: 4,
            assignee: 'Sales Demo Branch',
            createdDate: '15/4/2025, 4:59:56 PM',
            activityCount: 26,
            scheduledOn: '15-04-2025 4:59 PM',
            students: [
                { name: 'Nirali H.', class: 'KG - 1', parentName: 'Mrs. H', mobile: '+91 1100001127', academicYear: 'AY 2024 - 2025' },
                { name: 'Charlotte Harris', class: 'KG - 1', parentName: 'KG Parent', mobile: '+91 9878912341', academicYear: 'AY 2024 - 2025' },
                { name: 'Fatima S.', class: 'KG - 1', parentName: 'Mrs. S', mobile: '+91 1100001126', academicYear: 'AY 2024 - 2025' },
                { name: 'Sagnik Sinha', class: 'KG - 1', parentName: 'Manisha Sinha', mobile: '+97 1882070781', academicYear: 'AY 2024 - 2025' },
            ],
            activities: [
                { id: 'G-8317', internalTitle: 'Recap_number_comparison_LKG_SB2_68', externalTitle: 'Recap - number comparison' },
                { id: 'V-4089', internalTitle: 'Kitchen', externalTitle: 'Kitchen' },
                { id: 'G-4076', internalTitle: 'Big_and_small_LKG_SB1_33', externalTitle: 'Big and small' },
                { id: 'G-4178', internalTitle: 'Phonic_Sound_g', externalTitle: "Phonic Sound 'g'" },
            ]
        },
        {
            key: '2',
            srNo: 2,
            title: 'Sing_a_long',
            assignedClasses: 'Nursery',
            assignedStudents: 6,
            assignee: 'Aasif cg-admin',
            createdDate: '8/4/2025, 2:03:22 PM',
            activityCount: 1,
            scheduledOn: '11-04-2025 2:03 PM',
            students: [
                { name: 'Aiden Smith', class: 'Nursery', parentName: 'Mr. Smith', mobile: '+91 9876543211', academicYear: 'AY 2024 - 2025' },
                { name: 'Zara Khan', class: 'Nursery', parentName: 'Mrs. Khan', mobile: '+91 8765432100', academicYear: 'AY 2024 - 2025' },
            ],
            activities: [
                { id: 'V-4020', internalTitle: 'Letter_Bb_PCB1', externalTitle: 'Letter Bb' },
            ]
        },
        {
            key: '3',
            srNo: 3,
            title: 'Big_and_small',
            assignedClasses: 'Nursery, KG - 2',
            assignedStudents: 2,
            assignee: 'Sales Demo Branch',
            createdDate: '5/4/2025, 5:38:57 PM',
            activityCount: 1,
            scheduledOn: '05-04-2025 6:41 PM',
            students: [
                { name: 'Ethan Wong', class: 'KG - 2', parentName: 'Mr. Wong', mobile: '+91 7654321009', academicYear: 'AY 2024 - 2025' },
                { name: 'Maya Patel', class: 'Nursery', parentName: 'Dr. Patel', mobile: '+91 6543210098', academicYear: 'AY 2024 - 2025' },
            ],
            activities: [
                { id: 'G-4076', internalTitle: 'Big_and_small_LKG_SB1_33', externalTitle: 'Big and small' },
            ]
        },
        {
            key: '4',
            srNo: 4,
            title: 'स्वर_अ_HINDI',
            assignedClasses: 'KG - 1',
            assignedStudents: 4,
            assignee: 'Sales Demo Branch',
            createdDate: '30/3/2025, 2:29:02 PM',
            activityCount: 1,
            scheduledOn: '30-03-2025 2:29 PM',
            students: [
                { name: 'Aarav Kumar', class: 'KG - 1', parentName: 'Mr. Kumar', mobile: '+91 5432100987', academicYear: 'AY 2024 - 2025' },
            ],
            activities: [
                { id: 'G-1571', internalTitle: 'Pilot Tour Video Quiz', externalTitle: 'Pilot Tour Video Quiz' },
            ]
        },
        {
            key: '5',
            srNo: 5,
            title: 'स्वर_आ_HINDI',
            assignedClasses: 'KG - 1',
            assignedStudents: 4,
            assignee: 'Animesh cg-admin',
            createdDate: '27/3/2025, 12:29:59 PM',
            activityCount: 1,
            scheduledOn: '29-03-2025 1:30 PM',
            students: [
                { name: 'Riya Sharma', class: 'KG - 1', parentName: 'Mrs. Sharma', mobile: '+91 4321009876', academicYear: 'AY 2024 - 2025' },
            ],
            activities: [
                { id: 'G-4177', internalTitle: 'Phonic_Sound_f', externalTitle: "Phonic Sound 'f'" },
            ]
        },
        {
            key: '6',
            srNo: 6,
            title: 'Community_Helpers',
            assignedClasses: 'Nursery',
            assignedStudents: 5,
            assignee: 'Aasif cg-admin',
            createdDate: '22/3/2025, 10:53:19 AM',
            activityCount: 1,
            scheduledOn: '28-03-2025 10:53 AM',
            students: [
                { name: 'Lucas Miller', class: 'Nursery', parentName: 'Ms. Miller', mobile: '+91 3210098765', academicYear: 'AY 2024 - 2025' },
            ],
            activities: [
                { id: 'G-6439', internalTitle: 'Stem_Firefighter_NUR_GA_46', externalTitle: 'Stem: Firefighter' },
            ]
        },
    ];

    // Filter function for schedules
    const filteredData = scheduleData.filter(item => {
        const matchesGrade = !gradeFilter || item.assignedClasses.includes(gradeFilter);
        const matchesClass = !classFilter || item.assignedClasses.includes(classFilter);
        const matchesSearch = !searchText ||
            item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.assignee.toLowerCase().includes(searchText.toLowerCase());

        return matchesGrade && matchesClass && matchesSearch;
    });

    // Open student modal
    const showStudentModal = (record) => {
        setSelectedSchedule(record);
        setIsStudentModalVisible(true);
    };

    // Open activity modal
    const showActivityModal = (record) => {
        setSelectedSchedule(record);
        setIsActivityModalVisible(true);
    };

    // Close modals
    const handleModalClose = () => {
        setIsStudentModalVisible(false);
        setIsActivityModalVisible(false);
    };

    // Reset filters
    const resetFilters = () => {
        setGradeFilter(null);
        setClassFilter(null);
        setSearchText('');
    };

    // Main table columns
    const columns = [
        {
            title: 'Sr.No',
            dataIndex: 'srNo',
            key: 'srNo',
            width: 80,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 180,
        },
        {
            title: 'Assigned Classes',
            dataIndex: 'assignedClasses',
            key: 'assignedClasses',
            width: 150,
            render: (classes) => (
                <span className="bg-purple-100 text-purple-800 rounded-md px-2 py-1 text-sm">
                    {classes}
                </span>
            ),
        },
        {
            title: 'Assigned Students',
            dataIndex: 'assignedStudents',
            key: 'assignedStudents',
            width: 150,
            render: (students, record) => (
                <Button
                    type="link"
                    className="text-purple-700 font-medium"
                    onClick={() => showStudentModal(record)}
                >
                    {students} Assigned
                </Button>
            ),
        },
        {
            title: 'Assignee',
            dataIndex: 'assignee',
            key: 'assignee',
            width: 180,
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 180,
        },
        {
            title: 'Activity Count',
            dataIndex: 'activityCount',
            key: 'activityCount',
            width: 130,
            render: (count, record) => (
                <div onClick={() => showActivityModal(record)} className="flex items-center cursor-pointer">
                    <span className="mr-2">{count}</span>
                    <Badge status="processing" className="bg-gray-400 rounded-full" />
                </div>
            ),
        },
        {
            title: 'Scheduled On',
            dataIndex: 'scheduledOn',
            key: 'scheduledOn',
            width: 180,
        },
        {
            title: 'Edit',
            key: 'edit',
            width: 80,
            render: () => (
                <Tooltip title="Edit">
                    <Button type="text" icon={<EditOutlined />} className="text-gray-500" />
                </Tooltip>
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            width: 80,
            render: () => (
                <Tooltip title="Delete">
                    <Button type="text" icon={<DeleteOutlined />} className="text-gray-500" />
                </Tooltip>
            ),
        },
    ];

    // Student modal columns
    const studentColumns = [
        {
            title: 'Sr.No',
            dataIndex: 'srNo',
            key: 'srNo',
            width: 80,
        },
        {
            title: 'Student Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Class',
            dataIndex: 'class',
            key: 'class',
            width: 100,
        },
        {
            title: 'Parent Details',
            key: 'parentDetails',
            width: 230,
            render: (text, record) => (
                <div>
                    <div>Name: {record.parentName}</div>
                    <div>mobile: {record.mobile}</div>
                </div>
            ),
        },
        {
            title: 'Academic Year',
            dataIndex: 'academicYear',
            key: 'academicYear',
            width: 150,
        },
    ];

    // Activity modal columns
    const activityColumns = [
        {
            title: 'Sr.No',
            dataIndex: 'srNo',
            key: 'srNo',
            width: 80,
        },
        {
            title: 'Content ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
        },
        {
            title: 'Internal Title',
            dataIndex: 'internalTitle',
            key: 'internalTitle',
            width: 300,
        },
        {
            title: 'External Title',
            dataIndex: 'externalTitle',
            key: 'externalTitle',
            width: 250,
        },
    ];

    // Add Sr.No to students and activities
    const prepareStudentData = () => {
        if (!selectedSchedule) return [];
        return selectedSchedule.students.map((student, index) => ({
            ...student,
            srNo: index + 1,
            key: index,
        }));
    };

    const prepareActivityData = () => {
        if (!selectedSchedule) return [];
        return selectedSchedule.activities.map((activity, index) => ({
            ...activity,
            srNo: index + 1,
            key: index,
        }));
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Schedule List</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
                <Select
                    placeholder="Grade"
                    allowClear
                    style={{ width: 200 }}
                    value={gradeFilter}
                    onChange={setGradeFilter}
                >
                    <Option value="KG - 1">KG - 1</Option>
                    <Option value="KG - 2">KG - 2</Option>
                    <Option value="Nursery">Nursery</Option>
                </Select>

                <Select
                    placeholder="Class"
                    allowClear
                    style={{ width: 200 }}
                    value={classFilter}
                    onChange={setClassFilter}
                >
                    <Option value="KG - 1">KG - 1</Option>
                    <Option value="KG - 2">KG - 2</Option>
                    <Option value="Nursery">Nursery</Option>
                </Select>

                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                />

                <Button
                    icon={<ReloadOutlined />}
                    onClick={resetFilters}
                    className="flex items-center"
                >
                    Reset Filter
                </Button>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}–${range[1]} of ${total}`,
                    }}
                    scroll={{ x: 1200 }}
                    className="border-t border-gray-200"
                />
            </div>

            {/* Student Modal */}
            <Modal
                title="Assigned Students"
                open={isStudentModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="ok" type="primary" onClick={handleModalClose} className="bg-purple-700">
                        Ok
                    </Button>,
                ]}
                width={1000}
            >
                <Table
                    columns={studentColumns}
                    dataSource={prepareStudentData()}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}–${range[1]} of ${total}`,
                    }}
                />
            </Modal>

            {/* Activity Modal */}
            <Modal
                title="Assignment Activity"
                open={isActivityModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="ok" type="primary" onClick={handleModalClose} className="bg-purple-700">
                        Ok
                    </Button>,
                ]}
                width={1000}
            >
                <Table
                    columns={activityColumns}
                    dataSource={prepareActivityData()}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}–${range[1]} of ${total}`,
                    }}
                />
            </Modal>
        </div>
    );
};

export default ScheduleList;