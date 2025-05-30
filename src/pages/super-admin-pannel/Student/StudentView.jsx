import React, { useEffect, useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// import userImage from "../../../assets/Images/teacher.webp";
import { DeleteStudent, studentGetById } from '@/Network/Super_Admin/auth';

export const StudentView = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();


    const handleDeleteStudent = async () => {
        const confirmed = window.confirm("Are you sure you want to deactivate this student?");
        if (!confirmed) return;
        try {
            await DeleteStudent(id);
            alert("Student has been deactivated successfully.");
            navigate("/eduworm-admin/students"); 
        } catch (error) {
            console.error("Failed to delete student:", error);
            alert("Something went wrong while deactivating the student.");
        }
    };
    

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await studentGetById(id);
                setStudent(response.student);
                console.log("Student data:", response);
            } catch (error) {
                console.error("Failed to fetch student data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStudent();
    }, [id]);

    if (loading) return <p className="p-4 text-lg">Loading student data...</p>;

    return (
        <>
            <div className="max-w-7xl mx-auto mt-10">
                {/* Profile Section */}
                <div className="bg-white rounded-md shadow-md overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3 p-6 bg-blue-100 flex flex-col items-center justify-center">
                        <img
                            src={"https://img.favpng.com/14/3/22/stock-photography-computer-icons-user-png-favpng-TWgLj8kmcdnekcpWySfpV97h3.jpg"}
                            alt="Student"
                            className="w-32 h-32 rounded-full object-cover border-2 border-white shadow"
                        />
                        <h2 className="mt-4 text-xl font-bold text-gray-800">
                            {student?.firstName} {student?.lastName}
                        </h2>
                        <p className="text-gray-600">{student?.class?.className || "Class not assigned"}</p>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => navigate(`/eduworm-admin/students/edit/${id}`)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                <Edit size={18} /> Edit
                            </button>
                            <button
                                onClick={handleDeleteStudent}
                                className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                <Trash size={18} /> Deactivate
                            </button>



                            
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="md:w-2/3 p-6">
                        <h3 className="text-2xl font-semibold text-blue-600 mb-4">Student Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><strong>Roll No:</strong> {student?.rollNo || "—"}</div>
                            <div><strong>Admission No:</strong> {student?.admissionNumber || "—"}</div>
                            <div><strong>Date of Birth:</strong> {student?.dateOfBirth?.split("T")[0] || "—"}</div>
                            <div><strong>Date of Joining:</strong> {student?.dateOfJoining?.split("T")[0] || "—"}</div>
                            <div><strong>Gender:</strong> {student?.gender || "—"}</div>
                            <div><strong>Blood Group:</strong> {student?.bloodGroup || "—"}</div>
                            <div><strong>Enrollment Status:</strong> {student?.enrollmentStatus || "—"}</div>
                            <div><strong>School:</strong> {student?.school?.schoolName || "—"}</div>
                            <div><strong>Branch:</strong> {student?.schoolBranch?.name || "—"}</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Additional Info Sections */}
            <div className="max-w-7xl mx-auto mt-12 space-y-10">

                {/* Emergency Contact */}
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">📞 Emergency Contact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Name</span>
                            <span className="font-medium">{student?.emergencyContact?.name || "—"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Relation</span>
                            <span className="font-medium">{student?.emergencyContact?.relation || "—"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Phone</span>
                            <span className="font-medium">{student?.emergencyContact?.phone || "—"}</span>
                        </div>
                    </div>
                </section>

                {/* Documents */}
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">📄 Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Aadhar Card</span>
                            <span className="font-medium">{student?.documents?.aadharCard || "—"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Transfer Certificate</span>
                            <span className="font-medium">{student?.documents?.transferCertificate || "—"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Student ID Card</span>
                            <span className="font-medium">{student?.documents?.studentIDCard || "—"}</span>
                        </div>
                    </div>
                </section>

                {/* Parent Details */}
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">👨‍👩‍👧 Parent Details</h3>
                    {student?.parents && student.parents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {student.parents.map((parent, index) => (
                                <div key={index} className="border rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition">
                                    <p className="mb-1"><span className="text-sm text-gray-500">Name:</span> <span className="font-medium">{parent.firstName} {parent.lastName}</span></p>
                                    <p className="mb-1"><span className="text-sm text-gray-500">Phone:</span> <span className="font-medium">{parent.phoneNumber}</span></p>
                                    <p><span className="text-sm text-gray-500">Email:</span> <span className="font-medium">{parent.email || "—"}</span></p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No parent details available.</p>
                    )}
                </section>
            </div>


        </>
    );
};
