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

const FetchMenuItems = async (body) => {
    return await apiRequest("menu/items/all", {
        method: "GET",
        body,
    })
}

const UpdateMenuItems = async (id, body) => {
    return await apiRequest(`menu/item/${id}`, {
        method: "PUT",
        body,
    })
}

const ToogleMenuItem = async (id) => {
    return await apiRequest(`menu/item/${id}/toggle`, {
        method: "PATCH",
        body,
    })
}
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


// Get All Classes 
const GetClasses = async (body) => {
    return await apiRequest("class/all", {
        method: "GET",
        body
    })
}

// Class Dropdown
const ClassesDropdown = async (body) => {
    return await apiRequest("class/dropdown", {
        method: "GET",
        body
    })
}


// Get All Grades
const GetGrades = async (body) => {
    return await apiRequest("grade", {
        method: "GET",
        body,
    });
}
// Grade By Id
const GetGradeById = async (id) => {
    return await apiRequest(`grade/${id}`, {
        method: "GET",
        body: {},
    });
}

// Create Grade
const CreateGrade = async (body) => {
    return await apiRequest("grade", {
        method: "POST",
        body,
    });
}
// Update Grade
const UpdateGrade = async (id, body) => {
    return await apiRequest(`grade/${id}`, {
        method: "PUT",
        body,
    });
};

// Deactivate Grade
const DeactivateGrade = async ({ id, isActive }) => {
    return await apiRequest(`grade/${id}`, {
        method: "PUT",
        body: { isActive },
    });
};

//Get All Schools
const GetSchools = async (body) => {
    return await apiRequest("schooladmin-auth", {
        method: "GET",
        body,
    });
}

const SchoolsDropdwon = async (body) => {
    return await apiRequest("school/dropdown", {
        method: "GET",
        body,
    });
}

//Get All Schools
const GetAllSchools = async (body) => {
    return await apiRequest("school/all", {
        method: "GET",
        body,
    });
}

// Create School By Super Admin
const CreateSchool = async (body) =>{
    return await apiRequest('school/create',{
        method:"POST",
        body
    })
}

// Get School By Id
const GetSchoolById = async (schoolId) => {
    return await apiRequest(`school/${schoolId}`, {
        method: "GET",
    });
};

// Get School Branches
const GetSchoolBranches = async (schoolId) => {
    return await apiRequest("branches/forschool", {
        method: "GET",
        params: { schoolId },
    });
};


const GetBranchById = async (id) => {
    return await apiRequest(`auth_SchoolBranch/branches/${id}`, {
        method: "GET",
        
    });
};

// Get All Levels
const GetLevels = async (body) => {
    return await apiRequest("level", {
        method: "GET",
        body,
    });
}

// Get All Academic Year
const GetAllAcademicYear = async (page = 1, limit = 10) => {
    return await apiRequest(`academicYear/AllAcademicYear?page=${page}&limit=${limit}`, {
      method: "GET",
    });
};

// Academic Year for Dropdown 
const AcademicYearDropdown = async (body) => {
    return await apiRequest("academicYear/dropdown", {
        method: "GET",
        body,
    })
}
  

// Create Academic Year
const CreateAcademicYear = async (body) => {
    return await apiRequest("academicYear/createAcademicYear", {
        method: "POST",
        body,
    });
}

// Update AcademicYear
const UpdateAcademicYear = async (id, body) => {
    return await apiRequest(`academic/${id}`, {
        method: "PATCH",
        body,
    });
};


// Deactive Academic year 
const DeactivateAcademicYear = async (yearId, isActive) => {
    return await apiRequest(`academic-years/${yearId}`, {
        method: "PATCH",
        body: { active: isActive },
    });
};

// Get Academic Year By School Id
const GetAcademicYearsById = async (schoolId) => {
    return await apiRequest("academic", {
        method: "GET",
        params: { schoolId },
    });
};



const StaffLogin = async(body) =>{
    return await apiRequest("SA_Staff/staff_login",{
        method:"POST",
        body,
    })
}

const AddStaff = async(body) =>{
    return await apiRequest("SA_Staff/staffCreate",{
        method:"POST",
        body
    })
}
const GetAllStaff = async(body) =>{
    return await apiRequest("SA_Staff/all",{
        method:"GET",
        body
    })
}

const GetStaffById = async (id,body) =>{
    return await apiRequest(`SA_Staff/${id}`,{
        method:"GET",
        body
    })
}







// Content Management APIS

// Add Content 
const AddContent = async (body) => {
    return await apiRequest("content", {
        method: "POST",
        body: body,
    });
};



export {
    SetLocalStorage,
    ConvertImageToBase64,
    GetUser,
    FetchMenuItems,
    UpdateMenuItems,
    ToogleMenuItem,
    SuperAdminRegister,
    SuperAdminLogin,
    GetClasses,
    GetAllSchools,
    SchoolsDropdwon,
    GetBranchById,
    ClassesDropdown,
    GetSchoolById,
    CreateSchool,
    StaffLogin,
    AddStaff,
    GetAllStaff,
    GetStaffById,
    GetGrades,
    GetGradeById,
    CreateGrade,
    DeactivateGrade,
    UpdateGrade,
    GetSchools,
    GetLevels,
    AcademicYearDropdown,
    GetAllAcademicYear,
    GetAcademicYearsById,
    CreateAcademicYear,
    DeactivateAcademicYear,
    UpdateAcademicYear,
    GetSchoolBranches,
    AddContent,
};
