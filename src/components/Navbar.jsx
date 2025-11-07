import React from "react";
import {
  Home,
  MessageSquare,
  Users,
  Briefcase,
  ClipboardList,
  UserCog,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Chat", icon: MessageSquare, path: "/chat" },
  ];

  const generalItems = [
    { name: "Team", icon: Users, path: "/team" },
    { name: "Client", icon: Briefcase, path: "/client" },
    { name: "Project", icon: ClipboardList, path: "/project" },
    { name: "Task", icon: ClipboardList, path: "/task" },
    { name: "Employees", icon: UserCog, path: "/employees" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between p-6 rounded-tr-3xl rounded-br-3xl fixed top-0 left-0 h-screen">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-10">
          <img
            src="/images/taskpilot_logo.svg"
            alt="Logo"
            className="w-48 h-10"
          />
        </div>

        {/* Menu */}
        <nav className="space-y-4">
          <div className="text-gray-400 text-sm font-semibold uppercase mb-2">
            Menu
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-medium cursor-pointer transition ${
                      active
                        ? "bg-[#28abe2]/10 text-[#28abe2]"
                        : "text-gray-700 hover:bg-[#f2f7fa]"
                    }`}
                  >
                    <Icon size={18} /> <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="text-gray-400 text-sm font-semibold uppercase mt-8 mb-2">
            General
          </div>
          <ul className="space-y-2">
            {generalItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-medium cursor-pointer transition ${
                      active
                        ? "bg-[#28abe2]/10 text-[#28abe2]"
                        : "text-gray-700 hover:bg-[#f2f7fa]"
                    }`}
                  >
                    <Icon size={18} /> <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer Section */}
      <div className="flex items-center space-x-3 border-t border-gray-200 pt-4">
        <img
          src="https://i.pravatar.cc/"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-gray-800 font-medium">Aswanth Raja</p>
          <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-[#28abe2]">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
