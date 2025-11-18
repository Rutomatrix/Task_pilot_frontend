import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Download, Upload, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // ✅ Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/tasks/");
      const data = await res.json();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setTasks(sortedData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Excel/CSV import
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/import-tasks/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("✅ File uploaded and processed successfully!");
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("❌ Error uploading file");
    }
  };

  // ✅ Excel export
  const handleExport = () => {
    if (tasks.length === 0) {
      alert("No data available to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      tasks.map((t) => ({
        "Task_ID": t.task_id,
        "Task_Name": t.task_name,
        "Project_ID": Array.isArray(t.project_id) ? t.project_id.join(", ") : t.project_id || "",
        "Type": t.type || "",
        "Assigned_To": Array.isArray(t.assigned_to) ? t.assigned_to.join(", ") : t.assigned_to || "",
        "Priority": t.priority || "",
        "Deadline": t.deadline ? new Date(t.deadline).toLocaleDateString() : "",
        "Status": t.status || "",
        "Dependencies": Array.isArray(t.dependencies) ? t.dependencies.join(", ") : t.dependencies || "",
        "Description": t.description || "",
        "Skills_Required": Array.isArray(t.skills_required) ? t.skills_required.join(", ") : t.skills_required || "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "tasks.xlsx");
  };

  // ✅ Filtering logic (by task name)
  const filteredTasks = search
    ? tasks.filter((task) =>
        task.task_name?.toLowerCase().includes(search.toLowerCase())
      )
    : tasks;

  // ✅ Pagination
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTasks.slice(indexOfFirstRow, indexOfLastRow);

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete?.id) return;

    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${taskToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      setModalOpen(false);
      setTaskToDelete(null);
      alert("✅ Task deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error deleting task");
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setTaskToDelete(null);
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
        <h1 className="text-2xl font-semibold text-gray-800">Task Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/tasks/add")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Add
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#28abe2] text-white px-4 py-2 rounded-lg hover:bg-[#2198cc]"
          >
            <Download size={16} /> Export
          </button>
          <label className="flex items-center gap-2 bg-[#f2f7fa] border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#eaf2f6]">
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

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by task name..."
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
              <th className="px-4 py-3 font-semibold">Task ID</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((task) => (
                <tr key={task.id} className="border-b hover:bg-[#f9fbfc]">
                  <td className="px-4 py-3 text-gray-800">{task.task_id}</td>
                  <td className="px-4 py-3 text-gray-600">{task.task_name}</td>
                  <td className="px-4 py-3 text-gray-600">{task.type}</td>
                  <td className="px-4 py-3 text-gray-600">{task.priority}</td>
                  <td className="px-4 py-3 font-medium text-green-600">{task.status}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/tasks/${task.id}/edit`)}
                        className="text-green-600 hover:text-green-700"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                        onClick={() => handleDeleteClick(task)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No matching records found.
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
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${taskToDelete?.task_name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Tasks;
