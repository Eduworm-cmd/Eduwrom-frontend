import { apiRequest } from "@/utils/apiRequest";


const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const SchoolAdminLoginByEmail = async (body) => {
    return await apiRequest("auth_SchoolBranch/login-email", {
        method: "POST",
        body,
    })
}

const SchoolAdminLoginByPhone = async (body) => {
    return await apiRequest("auth_SchoolBranch/login", {
        method: "POST",
        body,
    })
}

const SchoolAdminVerifyOTP = async (body) => {
    return await apiRequest("auth_SchoolBranch/verify", {
        method: "POST",
        body,
    })
}

const SchoolStaffById = async (id, limit, page) => {
    return await apiRequest(`staff/${id}?limit=${limit}&page=${page}`, {
        method: "GET",
    })
}

const SchoolStaffByStaffId = async (id) => {
    return await apiRequest(`staff/getStaff/${id}`, {
        method: "GET",
    })
}

const deleteSchoolStaff = async (id) => {
    return await apiRequest(`staff/delete/${id}`, {
        method: "DELETE",
    })
}

const updateSchoolStaff = async (id, data) => {
    return await apiRequest(`staff/updateStaff/${id}`, {
        method: "PUT",
        body: data
    })
}

const createSchoolStaff = async (data) => {
    return await apiRequest('staff/create', {
        method: "POST",
        body: data
    })
}

const overAllSchoolStaff = async (limit,page) => {
    return await apiRequest(`staff/overall?limit=${limit}&page=${page}`, {
        method: "GET",
    })
}



export {
    SchoolAdminLoginByEmail,
    SchoolAdminLoginByPhone,
    SchoolAdminVerifyOTP,
    SchoolStaffById,
    SchoolStaffByStaffId,
    updateSchoolStaff,
    deleteSchoolStaff,
    createSchoolStaff,
    overAllSchoolStaff
}