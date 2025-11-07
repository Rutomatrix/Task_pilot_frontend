import React from "react";
import { PlusCircle, Users, Briefcase, ClipboardList, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const navigate = useNavigate();

  const cards = [
    { title: "Total Projects", value: 24, subtitle: "Increased from last month", color: "from-[#28abe2] to-[#f68633]" },
    { title: "Total Clients", value: 12, subtitle: "New 3 clients this month", color: "from-green-400 to-emerald-600" },
    { title: "Total Teams", value: 8, subtitle: "Added 2 new teams", color: "from-blue-500 to-cyan-400" },
    { title: "Total Employees", value: 42, subtitle: "2 joined recently", color: "from-purple-500 to-pink-500" },
  ];

  const recentProjects = [
    { name: "Website Revamp", client: "Acme Corp", status: "Running", deadline: "Nov 20, 2025" },
    { name: "Mobile App", client: "TechVision", status: "Pending", deadline: "Dec 10, 2025" },
    { name: "Brand Design", client: "Pixel Ltd", status: "Completed", deadline: "Oct 28, 2025" },
  ];

  const recentClients = [
    { name: "Acme Corp", contact: "John Doe", email: "john@acme.com" },
    { name: "TechVision", contact: "Jane Smith", email: "jane@techvision.com" },
  ];

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-[#f2f7fa]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Get an overview of your business performance at a glance.</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-[#28abe2] text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2">
            <PlusCircle size={18} /> <span>Add Project</span>
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100">
            Import Data
          </button>
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
              <th className="py-3 px-4 rounded-tl-lg">Project Name</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-tr-lg">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((project, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4">{project.name}</td>
                <td className="py-3 px-4">{project.client}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : project.status === "Running"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="py-3 px-4">{project.deadline}</td>
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
            onClick={() => navigate("/client")}
            className="text-[#28abe2] text-sm font-medium hover:underline"
          >
            View All
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-[#f2f7fa] text-gray-700">
            <tr>
              <th className="py-3 px-4 rounded-tl-lg">Client Name</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4 rounded-tr-lg">Email</th>
            </tr>
          </thead>
          <tbody>
            {recentClients.map((client, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4">{client.name}</td>
                <td className="py-3 px-4">{client.contact}</td>
                <td className="py-3 px-4">{client.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/team")}
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg cursor-pointer transition flex flex-col items-center justify-center text-center"
        >
          <UserCog size={36} className="text-[#28abe2] mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">Teams Overview</h3>
          <p className="text-gray-500 text-sm mt-1">Manage and collaborate efficiently.</p>
        </div>

        <div
          onClick={() => navigate("/task")}
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg cursor-pointer transition flex flex-col items-center justify-center text-center"
        >
          <ClipboardList size={36} className="text-[#f68633] mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">Tasks Summary</h3>
          <p className="text-gray-500 text-sm mt-1">Track progress and deadlines.</p>
        </div>

        <div
          onClick={() => navigate("/employees")}
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg cursor-pointer transition flex flex-col items-center justify-center text-center"
        >
          <Users size={36} className="text-[#28abe2] mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">Employees Overview</h3>
          <p className="text-gray-500 text-sm mt-1">Monitor team performance.</p>
        </div>
      </div>
    </main>
  );
};

export default Content;
