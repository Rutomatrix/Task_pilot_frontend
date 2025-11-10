import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Download, Upload, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const Client = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/clients/");
      const data = await res.json();
      // Order by ID ascending
      const sortedData = data.sort((a, b) => a.id - b.id);
      setTeamMembers(sortedData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Excel/CSV import
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/import-clients/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("✅ File uploaded and processed successfully!");
      fetchClients();
    } catch (error) {
      console.error(error);
      alert("❌ Error uploading file");
    }
  };

  // Excel export
  const handleExport = () => {
    if (teamMembers.length === 0) {
      alert("No data available to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      teamMembers.map((m) => ({
        "Client ID": m.client_id,
        "Client Name": m.client_name,
        "Type": m.type || "",
        "Status": m.status || "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients.xlsx");
  };

  // Filtering logic (by name)
  const filteredMembers = search
    ? teamMembers.filter((member) =>
        member.client_name?.toLowerCase().includes(search.toLowerCase())
      )
    : teamMembers;

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMembers.slice(indexOfFirstRow, indexOfLastRow);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/clients/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Delete failed");

        // Remove from frontend state
        setTeamMembers(teamMembers.filter((m) => m.id !== id));
        alert("✅ Client deleted successfully!");
      } catch (error) {
        console.error(error);
        alert("❌ Error deleting client");
      }
    }
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
        <h1 className="text-2xl font-semibold text-gray-800">Client Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/clients/add")}
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
            placeholder="Search by name..."
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
              <th className="px-4 py-3 font-semibold">Client ID</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((member) => (
                <tr key={member.id} className="border-b hover:bg-[#f9fbfc]">
                  <td className="px-4 py-3 text-gray-800">{member.client_id}</td>
                  <td className="px-4 py-3 text-gray-600">{member.client_name}</td>
                  <td className="px-4 py-3 text-gray-600">{member.type}</td>
                  <td className="px-4 py-3 font-medium text-green-600">{member.status}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/clients/${member.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/clients/${member.id}/edit`)}
                        className="text-green-600 hover:text-green-700"
                        title="Edit"
                      >
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
    </div>
  );
};

export default Client;
