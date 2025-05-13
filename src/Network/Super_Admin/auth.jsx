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
const CreateClass = async (body) => {
    return await apiRequest("class/create", {
        method: "POST",
        body
    })
}

// Update Classes 
const UpdateClass = async (id,body) => {
    return await apiRequest(`class/${id}`, {
        method: "PUT",
        body
    })
}
// Delete Class 
const DeleteClass = async (id,body) => {
    return await apiRequest(`class/${id}`, {
        method: "DELETE",
        body
    })
}

// Get Classe By Id 
const Class_By_Id = async (id,body) => {
    return await apiRequest(`class/view/${id}`, {
        method: "GET",
        body
    })
}


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


const DeleteSchoolById = async (schoolId) => {
    return await apiRequest(`school/deleteSchool/${schoolId}`, {
        method: "DELETE",
    });
};




const UpdateSchool = async (id, body) => {
    return await apiRequest(`school/updateSchool/${id}`, {
        method: "PUT",
        body,
    });
};

const studentGetById = async (id) => {
    return await apiRequest(`superStudent/ById/${id}`, {
        method: "GET",
    });
};

const CreateStudent = async (body) => {
    return await apiRequest("superStudent/create", {
        method: "POST",
        body,
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

// Create School By Super Admin
const CreateBranch = async (body) =>{
    return await apiRequest('auth_SchoolBranch/create_SchoolBranch',{
        method:"POST",
        body
    });
}

// Get All Stundents 
const GetAllStudent = async (body) =>{
    return await apiRequest('superStudent/all',{
        method:"GET",
        body
    });
}
// Get All Stundents By branch 
const GetAllStudentByBranch = async (id, page = 1, limit = 10) => {
  return await apiRequest(`superStudent/branch/${id}?page=${page}&limit=${limit}`, {
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
    return await apiRequest(`academicYear/${id}`, {
        method: "PUT",
        body,
    });
};


// Deactive Academic year 
const DeleteAcademicYear = async (yearId, isActive) => {
    return await apiRequest(`academicYear/${yearId}`, {
        method: "DELETE",
        body: { active: isActive },
    });
};

// Get Academic Year By Id
const GetAcademicYearsById = async (id) => {
    return await apiRequest(`academicYear/${id}`, {
        method: "GET",
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

const UpdateStaff = async(id,payload) =>{
    return await apiRequest(`SA_Staff/${id}`,{
        method:"PUT",
        body: payload,
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
const DeleteStaff = async (id) =>{
    return await apiRequest(`SA_Staff/${id}`,{
        method:"DELETE",
    })
}

const UpdateStudent = async (id, payload) => {
    return await apiRequest(`superStudent/${id}`, {
        method: "PUT",
        body: payload,
    });
};
const DeleteStudent = async (id) => {
    return await apiRequest(`superStudent/${id}`, {
        method: "DELETE",
    });
};







// Content Management APIS

// Add Content 
const AddContent = async (body) => {
    return await apiRequest("content", {
        method: "POST",
        body: body,
    });
};



export {
    UpdateStudent,
    CreateStudent,
    DeleteSchoolById,
    UpdateSchool,
    SetLocalStorage,
    ConvertImageToBase64,
    GetUser,
    FetchMenuItems,
    UpdateMenuItems,
    ToogleMenuItem,
    SuperAdminRegister,
    SuperAdminLogin,
    GetClasses,
    CreateClass,
    DeleteClass,
    UpdateClass,
    Class_By_Id,
    GetAllSchools,
    SchoolsDropdwon,
    GetBranchById,
    ClassesDropdown,
    GetSchoolById,
    GetAllStudentByBranch,
    GetAllStudent,
    CreateSchool,
    CreateBranch,
    StaffLogin,
    AddStaff,
    GetAllStaff,
    UpdateStaff,
    GetStaffById,
    DeleteStaff,
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
    DeleteAcademicYear,
    UpdateAcademicYear,
    GetSchoolBranches,
    AddContent,
    studentGetById,
    DeleteStudent
};
