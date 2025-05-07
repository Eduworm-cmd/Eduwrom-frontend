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

export {
    SchoolAdminLoginByEmail,
    SchoolAdminLoginByPhone,
    SchoolAdminVerifyOTP,
}