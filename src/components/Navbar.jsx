import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Users,
  Briefcase,
  ClipboardList,
  UserCog,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Chat", icon: <MessageSquare size={18} />, path: "/chat" },
  ];

  const generalItems = [
    { name: "Team", icon: <Users size={18} />, path: "/team" },
    { name: "Client", icon: <Briefcase size={18} />, path: "/client" },
    { name: "Project", icon: <ClipboardList size={18} />, path: "/project" },
    { name: "Task", icon: <ClipboardList size={18} />, path: "/task" },
    { name: "Employees", icon: <UserCog size={18} />, path: "/employees" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between p-6 rounded-tr-3xl rounded-br-3xl">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-10">
          <img
            src="/images/taskpilot_logo.svg"
            alt="Logo"
            className="w-250 h-10"
          />
        </div>

        {/* Menu */}
        <nav className="space-y-4">
          <div className="text-gray-400 text-sm font-semibold uppercase mb-2">
            General
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-medium cursor-pointer ${
                    location.pathname === item.path
                      ? "bg-[#28abe2]/10 text-[#28abe2]"
                      : "text-gray-700 hover:bg-[#f2f7fa]"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-gray-400 text-sm font-semibold uppercase mt-8 mb-2">
            Menu
          </div>
          <ul className="space-y-2">
            {generalItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-medium cursor-pointer ${
                    location.pathname === item.path
                      ? "bg-[#28abe2]/10 text-[#28abe2]"
                      : "text-gray-700 hover:bg-[#f2f7fa]"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer Profile Section */}
      <div className="flex items-center justify-between bg-[#f2f7fa] rounded-2xl p-3 shadow-sm mt-6">
        <div className="flex items-center space-x-3">
          <img
            src="https://i.pravatar.cc/"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              Aswanth Raja
            </p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-red-500">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
