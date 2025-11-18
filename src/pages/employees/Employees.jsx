import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Download, Upload, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/employees/");
      const data = await res.json();

      const sorted = data.sort((a, b) => a.id - b.id);
      setEmployees(sorted);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Import Excel
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/import-employees/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("✅ Employees imported successfully!");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("❌ Error importing employees");
    }
  };

  // Export Excel
  const handleExport = () => {
    if (employees.length === 0) {
      alert("No data available to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      employees.map((e) => ({
        "Emp_ID": e.Emp_ID,
        "Team_ID": e.Team_ID || "",
        "Name": e.Name || "",
        "Role": e.Role || "",
        "Skillset": Array.isArray(e.Skillset) ? e.Skillset.join(", ") : e.Skillset || "",
        "Current_Tasks": Array.isArray(e.Current_Tasks) ? e.Current_Tasks.join(", ") : e.Current_Tasks || "",
        "Status": e.Status || "",
        "Email": e.Email || "",
        "Comments": e.Comments || "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employees.xlsx");
  };

  // Search filter
  const filteredEmployees = search
    ? employees.filter((e) =>
        e.Name?.toLowerCase().includes(search.toLowerCase())
      )
    : employees;

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredEmployees.slice(indexOfFirst, indexOfLast);

  // Delete modal
  const handleDeleteClick = (emp) => {
    setEmployeeToDelete(emp);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete?.id) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/employees/${employeeToDelete.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setEmployees(employees.filter((e) => e.id !== employeeToDelete.id));
      setModalOpen(false);
      alert("✅ Employee deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting employee");
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setEmployeeToDelete(null);
  };

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Employee Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/employees/add")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Add
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Download size={16} /> Export
          </button>

          <label className="flex items-center gap-2 bg-[#f2f7fa] border px-4 py-2 rounded-lg cursor-pointer hover:bg-[#eaf2f6]">
            <Upload size={16} /> Import
            <input
              type="file"
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by employee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>

        <button
          onClick={() => setSearch("")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md p-5 overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-[#f2f7fa] text-gray-700">
              <th className="px-4 py-3 font-semibold">Employee ID</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Team ID</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-[#f9fbfc]">
                  <td className="px-4 py-3">{emp.Emp_ID}</td>
                  <td className="px-4 py-3">{emp.Name}</td>
                  <td className="px-4 py-3">{emp.Role}</td>
                  <td className="px-4 py-3">{emp.Team_ID}</td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    {emp.Status}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/employees/${emp.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(emp)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No matching employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete employee "${employeeToDelete?.Name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Employees;
