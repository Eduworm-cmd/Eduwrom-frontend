import { LayoutDashboard, Inbox, Users, Settings, BarChart, User, School } from "lucide-react"; // Ensure you're importing necessary icons

export const Roles = {
    SUPERADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    PARENT: 'parent'
}



const superAdminData = {
  buttons: [
    {
      title: "Dashboard",
      url: "/super-admin-pannel/home",
      icon: LayoutDashboard,
    },
    {
      title: "Account",
      url: "/home",
      icon: LayoutDashboard, 
    },
  ],
  footersBtns: [
    {
      title: "Settings",
      url: "/home",
      icon: Settings, 
    },
  ],
  navMain: [
    {
      title: "Teacher",
      icon: Users,
      items: [
        { title: "Teachers List", url: "/super-admin/teachers" },
        { title: "Add Teacher", url: "/super-admin/add-teacher" },
      ],
    },
    {
      title: "Students",
      icon: Users, 
      items: [
        { title: "Students List", url: "/super-admin/students" },
        { title: "Add Student", url: "/super-admin/add-student" },
      ],
    },
    {
      title: "Schools",
      icon: School,
      items: [
        { title: "Schools List", url: "/super-admin/schools" },
        { title: "Add School", url: "/super-admin/add-school" },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      items: [
        { title: "Profile", url: "/super-admin/profile" },
        { title: "System Settings", url: "/super-admin/settings" },
      ],
    },
  ],
};

const teacherData = {
  buttons: [
    {
      title: "Dashboard",
      url: "/super-admin-pannel/home",
      icon: LayoutDashboard,
    },
  ],
  footersBtns: [
    {
      title: "Settings",
      url: "/home",
      icon: Settings, // Settings icon for footer button
    },
  ],
  navMain: [
    {
      title: "Lessons",
      icon: Inbox, 
      items: [
        { title: "Lessons List", url: "/super-admin-pannel/content/mange" },
        { title: "Add Lessons", url: "/super-admin-pannel/content/add" },
      ],
    },
    {
      title: "My Classes",
      icon: Inbox, 
      items: [
        { title: "Class Schedule", url: "/teacher/classes/schedule" },
        { title: "Student List", url: "/teacher/classes/students" },
      ],
    },
    {
      title: "Assignments",
      icon: Inbox, 
      items: [
        { title: "View Assignments", url: "/teacher/assignments" },
        { title: "Add Assignment", url: "/teacher/assignments/add" },
      ],
    },
    {
      title: "Profile",
      icon: User, 
      items: [
        { title: "My Profile", url: "/teacher/profile" },
        { title: "Settings", url: "/teacher/settings" },
      ],
    },
  ],
};

const adminData = {
  buttons: [
    {
      title: "Dashboard",
      url: "/home",
      icon: LayoutDashboard,
    },
  ],
  footersBtns: [
    {
      title: "Settings",
      url: "/home",
      icon: Settings,
    },
  ],
  navMain: [
    {
      title: "Home",
      icon: LayoutDashboard, 
      items: [
        { title: "Dashboard", url: "/admin/dashboard" },
      ],
    },
    {
      title: "Manage Teachers",
      icon: Users,
      items: [
        { title: "Teachers List", url: "/admin/teachers" },
        { title: "Add Teacher", url: "/admin/teachers/add" },
      ],
    },
    {
      title: "Manage Students",
      icon: Users,
      items: [
        { title: "Students List", url: "/admin/students" },
        { title: "Add Student", url: "/admin/students/add" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart,
      items: [
        { title: "Attendance Report", url: "/admin/reports/attendance" },
        { title: "Performance Report", url: "/admin/reports/performance" },
      ],
    },
    {
      title: "Settings",
      icon: Settings, 
      items: [
        { title: "Profile", url: "/admin/profile" },
      ],
    },
  ],
};



export const MangeRoles = (role = "") => {
    switch (role) {
        case Roles.ADMIN:
            return adminData;

        case Roles.TEACHER:
            return teacherData;

        case Roles.SUPERADMIN:
            return superAdminData;

        case Roles.STUDENT:
            return {};

        default:
            throw new Error("Invalid role");
    }
};
