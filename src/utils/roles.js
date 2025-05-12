import { LayoutDashboard, Inbox, Users, Settings, BarChart, User, School, NotebookPen } from "lucide-react";

export const Roles = {
  SUPERADMIN: 'superadmin',
  SCHOOLADMIN: 'schooladmin',
  TEACHER: 'teacher',
  ACCOUNT: 'accountadmin',
}

const superAdminData = {
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
        { title: "School List", url: "/eduworm-admin/school/list" },
        { title: "Add Branch", url: "/eduworm-admin/schoolbranch/add" },
        { title: "Branch List", url: "/eduworm-admin/schoolbranch/list" },
        { title: "Student Data", url: "/eduworm-admin/students/add" },
        { title: "Staff Data", url: "/eduworm-admin/staff" },
        { title: "Academic Year", url: "/eduworm-admin/academic Year" },
        // { title: "Grade Management", url: "/eduworm-admin/grade" },
        { title: "Classroom Management", url: "/eduworm-admin/class" },
      ]
    },
    {
      title: "LMS Management",
      icon: NotebookPen,
      items: [
        { title: "Playlists & Assigement", url: "/eduworm-admin/playlist" },
        { title: "Content", url: "/eduworm-admin/content" },
        { title: "Sheduled List", url: "/eduworm-admin/scheduleList" },
        { title: "Assignment History", url: "/admin/teachers/add" },
        { title: "Result & Summary", url: "/admin/teachers/add" },
      ]
    },

    {
      title: "Lesson Management",
      icon: Users,
      items: [
        { title: "Lesson Plan", url: "/admin/teachers" },
        { title: "Teach", url: "/admin/teachers" },
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
      url: "/eduworm-school/home",
      icon: LayoutDashboard,
    },
    {
      title: "AI Reports",
      url: "/eduworm-admin/home",
      icon: LayoutDashboard,
    },
  ],

  // footersBtns: [
  //   {
  //     title: "Settings",
  //     url: "/home",
  //     icon: Settings,
  //   },
  // ],

  navMain: [
    {
      title: "Center Management",
      icon: Users,
      items: [
        { title: "Student Data", url: "/eduworm-admin" },
        { title: "Staff Data", url: "/eduworm-admin/school/list" },
        // { title: "Academic Year", url: "/eduworm-admin/staff/add" },
        // { title: "Grade Management", url: "/eduworm-admin/staff/list" },
        // { title: "Classroom Management", url: "/eduworm-admin/staff/list" },
      ]
    },

    {
      title: "LMS Management",
      icon: NotebookPen,
      items: [
        { title: "Playlist/ Assignment", url: "/eduworm-school/playlist" },
        { title: "Content", url: "/eduworm-school/content" },
        { title: "Scheduled List", url:"/eduworm-school/scheduleList" },
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

const teacherData = {
  title: "Teacher Admin Pannel",
  buttons: [
    {
      title: "Dashboard",   
      url: "/eduworm-school/home",
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
      title: "LMS Management",
      icon: NotebookPen,
      items: [
        { title: "Playlist/ Assignment", url: "/eduworm-school/playlist" },
        { title: "Content", url: "/eduworm-school/content" },
        { title: "Scheduled List", url:"/eduworm-school/scheduleList" },
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
      title: "",
      icon: Users,
      items: [
        { title: "Manage Documents", url: "/admin/teachers" },
        { title: "Daily Diary", url: "/admin/teachers/add" },
      ]
    },
  ]
}

const accountAdminData = {
  title: "Account Admin Pannel",
  buttons: [
    {
      title: "Dashboard",   
      url: "/eduworm-school/home",
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
  ]

}



export const MangeRoles = (role = "") => {
  switch (role) {
    case "superadmin":
      return superAdminData;
    case 'teacher':
      return teacherData;
    case 'schooladmin':
      return schoolAdminData;
    case 'accountadmin' :
      return accountAdminData;
    default:
      throw new Error("Invalid role");
  }
};
