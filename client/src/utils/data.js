import {
  LuLayoutDashboard,
  LuUser,
  LuClipboard,
  LuSquarePlus,
  LuLogOut,
  LuClipboardCheck,
  LuUsers,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
    {
    id: "02",
    label: "Manange Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
    {
    id: "03",
    label: "Create Task",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
    {
    id: "04",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
    {
    id: "05",
    label: "logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_DATA_USER = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
    {
    id: "02",
    label: "Manange Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
   {
    id: "05",
    label: "logout",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  }
];


export const PRIORITY_DATA = [
    {label : "low",value :"Low"},
    {label : "Meduim",value : "Meduim"},
    {label :"High",value : "High"}
]

export const STATUS_DATA = [
     {label : "Pending",value :"Pending"},
    {label : "In Progress",value : "In Progress"},
    {label :"Completed",value : "Completed"}
]
export const logIncontent = [
    `Track your daily goals effortlessly 🎯`,
  `Stay in sync across all your devices 📱`,
  `Get smart reminders to never miss a deadline ⏰`,
  `All your tasks in one place 📌`
  ]
export const signUpcontent = [
    `No credit card required, ever 💳`,
  `Create and organize unlimited tasks ✅`,
  `Track your progress visually 📈`,
  `Real-time collaboration 🔄`
  ]