import React, { useEffect, useState, useRef } from "react";
import { PlusCircle, Users, ClipboardList, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8000/api/projects/"),
          fetch("http://localhost:8000/api/clients/"),
          fetch("http://localhost:8000/api/teams/"),
          fetch("http://localhost:8000/api/employees/"),
          fetch("http://localhost:8000/api/tasks/"),
        ]);

        const [proj, cli, tm, emp, tsk] = await Promise.all(
          responses.map((r) => r.json())
        );

        setProjects(proj || []);
        setClients(cli || []);
        setTeams(tm || []);
        setEmployees(emp || []);
        setTasks(tsk || []);
      } catch {
        setProjects([]);
        setClients([]);
        setTeams([]);
        setEmployees([]);
        setTasks([]);
      }
    };

    fetchData();
  }, []);

  // Dashboard Summary Cards
  const cards = [
    {
      title: "Total Projects",
      value: projects.length,
      subtitle: "Projects in system",
      color: "from-[#28abe2] to-[#f68633]",
    },
    {
      title: "Total Clients",
      value: clients.length,
      subtitle: "Client organizations",
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "Total Teams",
      value: teams.length,
      subtitle: "Active teams",
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Total Employees",
      value: employees.length,
      subtitle: "Employees available",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const recentProjects = [...projects]
    .sort((a, b) => a.name.localeCompare(b.name))   // ASC order
    .slice(0, 3)                                    // first 3 after sorting
    .map((p) => ({
      project_id: p.project_id,
      name: p.name,
      client_ids: Array.isArray(p.client_id) ? p.client_id.join(", ") : p.client_id || "N/A",
      status: p.status || "N/A",
    }));

  const recentClients = [...clients]
    .sort((a, b) => a.client_name.localeCompare(b.client_name))  // ASC order
    .slice(0, 3)
    .map((c) => ({
      client_id: c.client_id,
      name: c.client_name,
      type: c.type || "N/A",
      status: c.status || "N/A",
    }));

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-[#f2f7fa]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">
            Get an overview of your business performance at a glance.
          </p>
        </div>

        {/* Add Button w/ Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="bg-[#28abe2] text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <PlusCircle size={18} />
            <span>Add</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border z-50">
              {[
                { name: "Add Project", path: "/projects/add" },
                { name: "Add Client", path: "/clients/add" },
                { name: "Add Team", path: "/teams/add" },
                { name: "Add Task", path: "/tasks/add" },
                { name: "Add Employee", path: "/employees/add" },
              ].map((item) => (
                <button
                  key={item.name}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(item.path);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-md cursor-pointer hover:scale-105 transform transition`}
          >
            <h2 className="text-sm font-medium opacity-90">{card.title}</h2>
            <p className="text-4xl font-bold mt-2">{card.value}</p>
            <span className="text-sm opacity-80">{card.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardList size={20} className="text-[#28abe2]" />
            Recent Projects
          </h2>
          <button
            onClick={() => navigate("/project")}
            className="text-[#28abe2] text-sm font-medium hover:underline"
          >
            View All
          </button>
        </div>

        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-[#f2f7fa] text-gray-700">
            <tr>
              <th className="py-3 px-4">Project ID</th>
              <th className="py-3 px-4">Project Name</th>
              <th className="py-3 px-4">Client ID(s)</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((project, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4">{project.project_id}</td>
                <td className="py-3 px-4">{project.name}</td>
                <td className="py-3 px-4">{project.client_ids}</td>
                <td className="py-3 px-4">{project.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Recent Clients */}
      <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-[#28abe2]" />
            Recent Clients
          </h2>
          <button
            onClick={() => navigate("/clients")}
            className="text-[#28abe2] text-sm font-medium hover:underline"
          >
            View All
          </button>
        </div>

        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-[#f2f7fa] text-gray-700">
            <tr>
              <th className="py-3 px-4">Client ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentClients.map((client, index) => (
                <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4">{client.client_id}</td>
                <td className="py-3 px-4">{client.name}</td>
                <td className="py-3 px-4">{client.type}</td>
                <td className="py-3 px-4">{client.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/teams")}
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg cursor-pointer flex flex-col items-center text-center"
        >
          <UserCog size={36} className="text-[#28abe2] mb-2" />
          <h3 className="text-lg font-semibold">Teams Overview</h3>
          <p className="text-gray-500 text-sm">Manage and collaborate efficiently.</p>
        </div>

        <div
          onClick={() => navigate("/tasks")}
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg cursor-pointer flex flex-col items-center text-center"
        >
          <ClipboardList size={36} className="text-[#f68633] mb-2" />
          <h3 className="text-lg font-semibold">Tasks Summary</h3>
          <p className="text-gray-500 text-sm">Track progress and deadlines.</p>
        </div>

        <div
          onClick={() => navigate("/employees")}
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg cursor-pointer flex flex-col items-center text-center"
        >
          <Users size={36} className="text-[#28abe2] mb-2" />
          <h3 className="text-lg font-semibold">Employees Overview</h3>
          <p className="text-gray-500 text-sm">Monitor team performance.</p>
        </div>
      </div>
    </main>
  );
};

export default Content;