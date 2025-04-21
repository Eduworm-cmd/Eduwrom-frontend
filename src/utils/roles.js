import { LayoutDashboard, Inbox, Users, Settings, BarChart, User, School, NotebookPen } from "lucide-react";

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
        { title: "Add Staff", url: "/eduworm-admin/staff/add" },
        { title: "Staff List", url: "/eduworm-admin/staff/list" },
      ]
    },
    {
      title: "LMS Management",
      icon: NotebookPen,
      items: [
        { title: "Content & Assigement", url: "/eduworm-admin/lms" },
        { title: "Add Teacher", url: "/admin/teachers/add" },
      ]
    },

    {
      title: "Role Delegation & Approval Workflows",
      icon: Users,
      items: [
        { title: "Teacher Admin List", url: "/admin/teachers" },
        { title: "Staff List", url: "/admin/teachers" },
        { title: "Add Staff", url: "/eduworm-admin/add-staff" },
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

const schoolAdminData = {
  title: "School Admin Pannel",
  buttons: [
    {
      title: "Dashboard",
      url: "/eduworm-admin/home",
      icon: LayoutDashboard,
    },
    {
      title: "AI Reports",
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
      title: "Center Management",
      icon: Users,
      items: [
        { title: "Student Data", url: "/eduworm-admin" },
        { title: "Staff Data", url: "/eduworm-admin/school/list" },
        { title: "Academic Year", url: "/eduworm-admin/staff/add" },
        { title: "Grade Management", url: "/eduworm-admin/staff/list" },
        { title: "Classroom Management", url: "/eduworm-admin/staff/list" },
      ]
    },

    {
      title: "LMS Management",
      icon: NotebookPen,
      items: [
        { title: "Playlist/ Assignment", url: "/eduworm-admin/lms" },
        { title: "Content", url: "/admin/teachers/add" },
        { title: "Scheduled List", url: "/admin/teachers/add" },
        { title: "Assignment History", url: "/admin/teachers/add" },
      ]
    },

    {
      title: "Lesson Management",
      icon: Users,
      items: [
        { title: "Lesson Plan", url: "/admin/teachers" },
        { title: "PlayList / Assignment", url: "/eduworm-school/playlist" },
        { title: "Content", url: "/eduworm-school/content" },
        { title: "Schedule List", url: "/eduworm-school/scheduleList" },
        { title: "Tech", url: "/admin/teachers" },
      ]
    },

    {
      title: "Finance & Billing",
      icon: Users,
      items: [
        { title: "Invoice", url: "/eduworm-admin/curriculum" },
        { title: "Balance & Refund", url: "/eduworm-admin/curriculum" },
        { title: "Receipts", url: "/eduworm-admin/curriculum" },
      ]
    },
    {
      title: "Document Management",
      icon: Users,
      items: [
        { title: "Manage Documents", url: "/admin/teachers" },
        { title: "Daily Diary", url: "/admin/teachers/add" },
      ]
    },
    {
      title: "",
      icon: Users,
      items: [
        { title: "Manage Documents", url: "/admin/teachers" },
        { title: "Daily Diary", url: "/admin/teachers/add" },
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
