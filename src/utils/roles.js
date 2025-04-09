import { LayoutDashboard, Inbox, Users, Settings, BarChart, User, School } from "lucide-react"; // Ensure you're importing necessary icons


export const Roles = {
    SUPERADMIN: 'admin',
    SCHOOLADMIN: 'schooladmin',
    TEACHER: 'teacher',
}

const adminData = {
  title: "Super Admin Pannel",
  buttons: [
    {
      title: "Dashboard",
      url: "/eduworm-admin/home",
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
      title: "Theme & Branding Control",
      icon: Users,
      items: [
        { title: "School List", url: "/eduworm-admin/school/list" },
        { title: "Add School", url: "/eduworm-admin/school/add" },
      ]
    },
    {
      title: "License & Subscription",
      icon: Users,
      items: [
        { title: "License Subscription", url: "/eduworm-admin/licens-subscription-home" },
        { title: "Add Teacher", url: "/admin/teachers/add" },
      ]
    },
    {
      title: "Notification Schedules",
      icon: Users,
      items: [
        { title: "Teachers List", url: "/admin/teachers" },
        { title: "Add Teacher", url: "/admin/teachers/add" },
      ]
    },
    {
      title: "Multi‑School / Campus Configuration",
      icon: Users,
      items: [
        { title: "Teachers List", url: "/admin/teachers" },
        { title: "Add Teacher", url: "/admin/teachers/add" },
      ]
    },
    {
      title: "Role Delegation & Approval Workflows",
      icon: Users,
      items: [
        { title: "Teachers List", url: "/admin/teachers" },
        { title: "Add Teacher", url: "/admin/teachers/add" },
      ]
    },
    {
      title: "Course & Curriculum Pages",
      icon: Users,
      items: [
        { title: "Teachers List", url: "/admin/teachers" },
        { title: "Add Teacher", url: "/admin/teachers/add" },
      ]
    },
    {
      title: "Library & Resource Catalog",
      icon: Users,
      items: [
        { title: "Teachers List", url: "/admin/teachers" },
        { title: "Add Teacher", url: "/admin/teachers/add" },
      ]
    }
  ]
    
}




export const MangeRoles = (role = "") => {
    switch (role) {
        case "admin":
            return adminData;
        case 'teacher':
            return teacherData;

        case 'schooladmin':
            return schoolAdminData;
        default:
            throw new Error("Invalid role");
    }
};
