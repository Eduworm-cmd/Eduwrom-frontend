import { apiRequest } from "@/utils/apiRequest";

const SchoolAdminLoginByEmail = async(body) => {
    return await apiRequest("schooladmin-auth/login-email",{
        method: "POST",
        body,
    })
}

const SchoolAdminLoginByPhone = async(body) => {
    return await apiRequest("schooladmin-auth/login",{
        method: "POST",
        body,
    })
}

const SchoolAdminVerifyOTP = async(body) => {
    return await apiRequest("schooladmin-auth/verify",{
        method: "POST",
        body,
    })
}

export {
    SchoolAdminLoginByEmail,
    SchoolAdminLoginByPhone,
    SchoolAdminVerifyOTP,
}