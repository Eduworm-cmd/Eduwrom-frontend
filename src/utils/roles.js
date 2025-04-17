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
      buttons: [
        {
          title: "Dashboard",
          url: "/eduworm-admin/home",
        },
      ],
    },
  ],

  footersBtns: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    }
  ],

  navMain:[
     {
        title: "Center Management",
        icon: Users,
        items:[
          {title: "Student Data" , url:"/student-data"},
          {title:"Staff Data", url:"/staff-data"},
          {title:"Academic Year", url:"/academic-year"},
          {title:"Grade Mangement", url:"/grade-management"},
          {title:"ClassRoom Management", url:"/classroom-management"},
        ]
     },
     {
        title:"LMS Module",
        icons: Users,
        items:[
          { title:"Playlist / Assigement" , url:"/playlist-assigenment"},
          {title:"Content ", url:"/content"},
          {title:"Scheduled List", url:"/scheduled-list"},
          {title:"Assignment History", url:"/assignment-history"},
          {title:"Results / Summary", url:"/results-summary"},
        ]

    },
    {
       title:"Lesson Managemnt", url:""
    }
  ],

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
