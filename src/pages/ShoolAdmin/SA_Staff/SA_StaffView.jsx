import { SchoolStaffByStaffId } from '@/Network/schooladminauth';
import { Edit, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export const SA_StaffView = () => {
    const [loading, setLoading] = useState(true);
    const [staffData, setStaffData] = useState();
    const { id } = useParams();

    const featchStaffData = async (id) => {
        try {
            const response = await SchoolStaffByStaffId(id);
            setStaffData(response.data || {});
            console.log(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        featchStaffData(id);
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader">loading...</div>
            </div>
        )
    }

    return (
        <div>
            <div className="max-w-5xl mx-auto mt-10 space-y-10">
                <div className="bg-white rounded-md shadow-md flex flex-col md:flex-row overflow-hidden">
                    <div className="md:w-1/3 bg-sky-100 flex flex-col justify-center items-center p-6">
                        <img
                            src={staffData.profile}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-2 border-white shadow bg-slate-200"
                        />
                        <h2 className="mt-4 text-lg font-bold text-gray-800">{`${staffData.firstName} ${staffData.lastName}`}</h2>
                        <div className="space-x-4 mt-4 flex">
                            <button
                                className="bg-yellow-500 cursor-pointer px-4 py-2 text-white rounded-sm flex items-center gap-2"
                                onClick={() => navigate(`/eduworm-admin/staff/edit/${staffData.id}`)}
                            >
                                <Edit size={18} /> Edit
                            </button>
                            <button className="bg-red-500 cursor-pointer px-4 py-2 text-white rounded-sm flex items-center gap-2">
                                <Trash size={18} /> Deactivate
                            </button>
                        </div>
                    </div>

                    <div className="md:w-2/3 p-6">
                        <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Detail label="First Name " value={staffData.firstName} />
                            <Detail label="Last Name " value={staffData.lastName} />
                            <Detail label="DOB " value={staffData.dateOfBirth} />
                            <Detail label="Employee Id " value={staffData.employeeId} />
                            <Detail label="Phone Number " value={staffData.phoneNumber} />
                            <Detail label="Email Address " value={staffData.emailId} />
                            <Detail label="Role " value={staffData.employeeRole} />
                            <Detail label="Gender " value={staffData.gender} />
                            <Detail label="Department " value={staffData.department} />
                            <Detail label="Joinig Date " value={staffData.createdAt.split("T")[0]} />
                            {
                                staffData.employeeRole === "teacher" && (
                                    <Detail label="Class Assig n" value={staffData.class.className} />
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Additional Details</h3>
                    <div className="space-y-2">
                        <DetailWithHR label="Current Address " value={staffData.address.currentAddress} />
                        <DetailWithHR label="Parmanent Address " value={staffData.address.permanentAddress} />
                        <DetailWithHR label="Religion " value={staffData.religion} />
                        <DetailWithHR label="Nationality " value={staffData.nationality} />
                        <DetailWithHR label="Emergency " value={staffData.nationality} />
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-sky-500 mb-4">Staff Bank Details</h3>
                    <div className="space-y-2">
                        <DetailWithHR label="Account No " value={staffData.employeeBankDeatils.accountNumber} />
                        <DetailWithHR label="Name As Bank " value={staffData.employeeBankDeatils.nameAsPerBank} />
                        <DetailWithHR label="Bank Name " value={staffData.employeeBankDeatils.bankName} />
                        <DetailWithHR label="Branch Name " value={staffData.employeeBankDeatils.bankBranch} />
                        <DetailWithHR label="IFSC Code " value={staffData.employeeBankDeatils.ifscCode} />
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-sky-500 mb-4">Documents Details</h3>
                    <div className="space-y-2 flex justify-between">
                        <div>
                            <label className='my-5'>Aadhar Card</label>
                            <div className='w-100'>
                                <img src={staffData.document.aadharCard} alt="" />

                            </div>
                        </div>
                        <div>
                            <label className='mb-9'>Pan Card</label>
                            <div className='w-100'>
                                <img src={staffData.document.panCard} alt="" />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DetailWithHR = ({ label, value }) => (
    <>
        <div className="text-lg"><span className="font-semibold">{label}:</span> {value || '—'}</div>
        <hr />
    </>
);

const Detail = ({ label, value }) => (
    <div className="text-lg">
        <span className="font-semibold">{label}:</span> {value || '—'}
    </div>
);