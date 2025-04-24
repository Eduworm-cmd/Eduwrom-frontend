import store from "@/Store/store";
import { apiRequest } from "@/utils/apiRequest";

// Set Value In Local Storage
const SetLocalStorage = (key, value) => {
    if (typeof window !== "undefined") {
        const stringValue = typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
    }
};

// Convert Image To Base64
const ConvertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


// Get User From Store
const GetUser = () => {
    const user = store.getState()?.auth?.user;
    return user || null;
};


//Super Admin Register
const SuperAdminRegister = async (body) => {
    return await apiRequest("superadmin-auth/register", {
        method: "POST",
        body,
    });
};

//Super Admin Login
const SuperAdminLogin = async (body) => {
    return await apiRequest("superadmin-auth/login", {
        method: "POST",
        body,
    });
};

// Create School By Super Admin
const CreateSchool = async (body) => {
    return await apiRequest("schooladmin-auth/create-by-superadmin", {
        method: "POST",
        body,
    });
};

// Create Staff By Super Admin
const CreateStafff = async (body) => {
    return await apiRequest("staff", {
        method: "POST",
        body,
    });
}

// Get All Grades
const GetGrades = async (body) => {
    return await apiRequest("grade", {
        method: "GET",
        body,
    });
}
// Grade By Id
const GetGradeById = async (body) => {
    return await apiRequest(`grade/${body}`, {
        method: "GET",
        body,
    });
}

// Create Grade
const CreateGrade = async (body) => {
    return await apiRequest("grade", {
        method: "POST",
        body,
    });
}

//Get All Schools
const GetSchools = async (body) => {
    return await apiRequest("schooladmin-auth", {
        method: "GET",
        body,
    });
}

// Get School Branches
const GetSchoolBranches = async (body) => {
    return await apiRequest("branches/forschool", {
        method: "GET",
        body,
    });
}


// Get All Levels
const GetLevels = async (body) => {
    return await apiRequest("level", {
        method: "GET",
        body,
    });
}
// Create Academic Year
const CreateAcademicYear = async (body) => {
    return await apiRequest("academic", {
        method: "POST",
        body,
    });
}

// Get Academic Year By School Id
const GetAcademicYearsById = async (params = "") => {
    const query = new URLSearchParams({ params }).toString();
    return await apiRequest(`academic?${query}`, {
        method: "GET",
    });
};


export {
    SetLocalStorage,
    ConvertImageToBase64,
    GetUser,
    SuperAdminRegister,
    SuperAdminLogin,
    CreateSchool,
    CreateStafff,
    GetGrades,
    GetGradeById,
    CreateGrade,
    GetSchools,
    GetLevels,
    GetAcademicYearsById,
    GetSchoolBranches,
};
