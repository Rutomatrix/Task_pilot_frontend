import React, { useState } from "react";
import { Eye, Edit, Trash2, Download, Upload } from "lucide-react";

const Team = () => {
  // Mock team data
  const initialData = [
    { id: 1, name: "Akila Nithya", role: "Frontend Developer", department: "Engineering", status: "Active" },
    { id: 2, name: "Ragul Rajkumar", role: "Backend Developer", department: "Engineering", status: "Inactive" },
    { id: 3, name: "Aswanth Raja", role: "Project Manager", department: "Management", status: "Active" },
    { id: 4, name: "Nithya Raj", role: "QA Engineer", department: "Testing", status: "Active" },
    { id: 5, name: "Varsha", role: "UI Designer", department: "Design", status: "Active" },
    { id: 6, name: "Karthik", role: "DevOps Engineer", department: "Engineering", status: "Inactive" },
    { id: 7, name: "Sanjay", role: "Full Stack Developer", department: "Engineering", status: "Active" },
    { id: 8, name: "Aadhira", role: "Product Analyst", department: "Management", status: "Active" },
    { id: 9, name: "Ramesh", role: "Support Engineer", department: "Testing", status: "Active" },
  ];

  const [teamMembers, setTeamMembers] = useState(initialData);
  const [filters, setFilters] = useState({ search: "", department: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filtering logic
  const filteredMembers = teamMembers.filter((member) => {
    return (
      member.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.department ? member.department === filters.department : true) &&
      (filters.status ? member.status === filters.status : true)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMembers.slice(indexOfFirstRow, indexOfLastRow);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id));
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Role,Department,Status"]
        .concat(teamMembers.map((m) => `${m.name},${m.role},${m.department},${m.status}`))
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "team_members.csv";
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    alert(`Imported file: ${file.name} (You can handle actual parsing via PapaParse or similar)`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Task Management</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#28abe2] text-white px-4 py-2 rounded-lg hover:bg-[#2198cc]"
          >
            <Download size={16} /> Export
          </button>
          <label className="flex items-center gap-2 bg-[#f2f7fa] border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#eaf2f6]">
            <Upload size={16} /> Import
            <input type="file" className="hidden" accept=".csv" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-[#28abe2]"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Department</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-52 focus:outline-none focus:ring-2 focus:ring-[#28abe2]"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="">All</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
            <option value="Testing">Testing</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Status</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-[#28abe2]"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          onClick={() => setFilters({ search: "", department: "", status: "" })}
          className="ml-auto bg-[#28abe2] text-white px-4 py-2 rounded-lg hover:bg-[#2198cc]"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md p-5 overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-[#f2f7fa] text-gray-700">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Department</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((member) => (
                <tr key={member.id} className="border-b hover:bg-[#f9fbfc]">
                  <td className="px-4 py-3 text-gray-800">{member.name}</td>
                  <td className="px-4 py-3 text-gray-600">{member.role}</td>
                  <td className="px-4 py-3 text-gray-600">{member.department}</td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      member.status === "Active" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {member.status}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="text-[#28abe2] hover:text-[#1e90bb]" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="text-green-600 hover:text-green-700" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-600 text-sm">
            Showing {indexOfFirstRow + 1}–
            {Math.min(indexOfLastRow, filteredMembers.length)} of {filteredMembers.length}
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border text-gray-600 hover:bg-[#f2f7fa]"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? "bg-[#28abe2] text-white border-[#28abe2]"
                    : "text-gray-600 hover:bg-[#f2f7fa]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border text-gray-600 hover:bg-[#f2f7fa]"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
