import store from "@/Store/store";
import { apiRequest } from "@/utils/apiRequest";

const SetLocalStorage = (key, value) => {
    if (typeof window !== "undefined") {
        const stringValue = typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
    }
};

const GetUser = () => {
    const user = store.getState()?.auth?.user;
    return user || null;
};

const SuperAdminRegister = async (body) => {
    return await apiRequest("superadmin-auth/register", {
        method: "POST",
        body,
    });
};

const SuperAdminLogin = async (body) => {
    return await apiRequest("superadmin-auth/login", {
        method: "POST",
        body,
    });
};

const CreateSchool = async (body) => {
    return await apiRequest("schooladmin-auth/create-by-superadmin", {
        method: "POST",
        body,
    });
};

const CreateStafff = async (body) =>{
    return await apiRequest("staff", {
        method: "POST",
        body,
    });
}


export {
    SetLocalStorage,
    GetUser,
    SuperAdminRegister,
    SuperAdminLogin,
    CreateSchool,
    CreateStafff,
};
