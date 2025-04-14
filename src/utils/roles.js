import { LayoutDashboard, Inbox, Users, Settings, BarChart, User, School } from "lucide-react"; 

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
      title: "School Management",
      icon: Users,
      items: [
        { title: "Add School", url: "/eduworm-admin/school/add" },
        { title: "School List", url: "/eduworm-admin/school/list" },
        { title: "Add Staff", url: "/admin/teachers/add" },
        { title: "Staff List", url: "/eduworm-admin/staff/list" },
      ]
    },
<<<<<<< HEAD
    
=======
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
>>>>>>> 75c96d4c8cda2a2be9d3f519714fa4466fb4b479
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
        { title: "Teacher Admin List", url: "/admin/teachers" },
        { title: "Staff List", url: "/admin/teachers" },
        { title: "Add Staff", url: "/eduworm-admi" },
      ]
    },
    {
      title: "Course & Curriculum Pages",
      icon: Users,
      items: [
        { title: "Curriculum List", url: "/eduworm-admin/curriculum" },
        { title: "Add Class", url: "/eduworm-admin/curriculum" },
      ]
    },
    {
      title: "Library & Resource Catalog",
      icon: Users,
      items: [
        { title: "E‑books List", url: "/admin/teachers" },
        { title: "Videos", url: "/admin/teachers/add" },
        { title: "Lesson Plans", url: "/admin/teachers/add" },
      ]
    },
    {
      title: "Notification Schedules",
      icon: Users,
      items: [
        { title: "Notification ", url: "/eduworm-admin/Notification" },
        { title: "Delivery Schedules", url: "/admin/teachers/add" },
        { title: "Communication Logs", url: "/eduworm-admin/communication-hub" },
      ]
    },
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
