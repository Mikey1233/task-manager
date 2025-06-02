import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_DATA_USER } from "../utils/data";
import { UserContext } from "../context/userContext";
import {toast} from "sonner"
function SideMenu({ activeMenu }) {
  const { user, clearUser } = useContext(UserContext);
  const [SideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/logout");
  };
  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_DATA_USER
      );
    }
    return () => {};
  }, [user]);
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      toast.success("logged Out successfully!")
      return;
    }

    navigate(route);
  };
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center pt-5 mb-7">
        <div className="relative">
          <img
            src={user?.profileImageUrl || ""}
            alt="Profle Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] bg-main px-3 py-0.5 rounded mt-1 font-medium text-white">
            Admin
          </div>
        )}
        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {SideMenuData.map((item, index) => (
        <button
          key={index}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? "text-main  bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
              : ""
          } py-3 px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default SideMenu;
