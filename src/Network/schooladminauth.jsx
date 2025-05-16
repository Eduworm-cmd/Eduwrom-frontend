import { apiRequest } from "@/utils/apiRequest";

const SchoolAdminLoginByEmail = async(body) => {
    return await apiRequest("auth_SchoolBranch/login-email",{
        method: "POST",
        body,
    })
}

const SchoolAdminLoginByPhone = async(body) => {
    return await apiRequest("auth_SchoolBranch/login",{
        method: "POST",
        body,
    })
}

const SchoolAdminVerifyOTP = async(body) => {
    return await apiRequest("auth_SchoolBranch/verify",{
        method: "POST",
        body,
    })
}

const SchoolStaffById = async(id,limit,page) => {
    return await apiRequest(`staff/${id}?limit=${limit}&page=${page}`,{
        method: "GET",
    })
}

const SchoolStaffByStaffId = async(id) => {
    return await apiRequest(`staff/getStaff/${id}`,{
        method: "GET",
    })
}

const deleteSchoolStaff = async(id, data) =>{
    return await apiRequest(`staff/updateStaff/${id}`,{
        method: "DELETE",
        body:data
    })
}

const updateSchoolStaff = async(id, data) =>{
    return await apiRequest(`staff/updateStaff/${id}`,{
        method: "PUT",
        body:data
    })
}


export {
    SchoolAdminLoginByEmail,
    SchoolAdminLoginByPhone,
    SchoolAdminVerifyOTP,
    SchoolStaffById,
    SchoolStaffByStaffId,
    deleteSchoolStaff,
}