import React from "react";
import { PlusCircle } from "lucide-react";

const Content = () => {
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Plan, prioritize, and accomplish your tasks with ease.</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#28abe2] to-[#f68633] rounded-2xl p-6 text-white shadow-md">
          <h2 className="text-sm font-medium">Total Projects</h2>
          <p className="text-3xl font-bold mt-2">24</p>
          <span className="text-sm">Increased from last month</span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Ended Projects</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">10</p>
          <span className="text-sm text-green-600">↑ Increased</span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Running Projects</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
          <span className="text-sm text-green-600">↑ Increased</span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Pending Projects</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">2</p>
          <span className="text-sm text-orange-500">On Discuss</span>
        </div>
      </div>
    </main>
  );
};

export default Content;