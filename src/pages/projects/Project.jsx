import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Download, Upload, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";

const Project = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/projects/");
      const data = await res.json();
      // Order by ID ascending
      const sortedData = data.sort((a, b) => a.id - b.id);
      setProjects(sortedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Excel/CSV import
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/import-projects/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("✅ File uploaded and processed successfully!");
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("❌ Error uploading file");
    }
  };

  // Excel export
  const handleExport = () => {
    if (projects.length === 0) {
      alert("No data available to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      projects.map((p) => ({
        "Project ID": p.project_id,
        "Project Name": p.name,
        "Client ID": Array.isArray(p.client_id) ? p.client_id.join(", ") : p.client_id,
        "Linked Inventory": Array.isArray(p.linked_inventory) ? p.linked_inventory.join(", ") : p.linked_inventory,
        "Status": p.status || "",
        "Start Date": p.start_date || "",
        "End Date": p.end_date || "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, "projects.xlsx");
  };

  // Filtering logic (by name)
  const filteredProjects = search
    ? projects.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProjects.slice(indexOfFirstRow, indexOfLastRow);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete?.id) return; // safety check

    try {
      const res = await fetch(`http://localhost:8000/api/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      setModalOpen(false);
      setProjectToDelete(null);
      alert("✅ Project deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error deleting project");
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setProjectToDelete(null);
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
        <h1 className="text-2xl font-semibold text-gray-800">Project Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/projects/add")}
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
            placeholder="Search by project name..."
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
              <th className="px-4 py-3 font-semibold">Project ID</th>
              <th className="px-4 py-3 font-semibold">Project Name</th>
              <th className="px-4 py-3 font-semibold">Client ID(s)</th>
              <th className="px-4 py-3 font-semibold">Linked Inventory</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((p) => (
                <tr key={p.id} className="border-b hover:bg-[#f9fbfc]">
                  <td className="px-4 py-3 text-gray-800">{p.project_id}</td>
                  <td className="px-4 py-3 text-gray-600">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {Array.isArray(p.client_id) ? p.client_id.join(", ") : p.client_id}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {Array.isArray(p.linked_inventory)
                      ? p.linked_inventory.join(", ")
                      : p.linked_inventory}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">{p.status}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/projects/${p.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${p.id}/edit`)}
                        className="text-green-600 hover:text-green-700"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                        onClick={() => handleDeleteClick(p)}
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
        message={`Are you sure you want to delete "${projectToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Project;
