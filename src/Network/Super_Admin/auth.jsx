import { apiRequest } from "@/utils/apiRequest";

const Register = async ({ authorization, body }) =>{
    const url = "schooladmin-auth/register";
    return await apiRequest(url,{
        method: "POST",
        authorization,
        body,
    })
}

const OTPVerify = async ({ authorization , body }) =>{
    const url = "schooladmin-auth/verify";
    return await apiRequest(url,{
        method: "POST",
        authorization,
        body,
    })
}

const Login = async ({ authorization, body }) =>{
    const url = "schooladmin-auth/login";
    return await apiRequest(url,{
        method: "POST",
        authorization,
        body,
    })
}

export { Register , OTPVerify , Login};
