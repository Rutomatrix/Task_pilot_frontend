import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/clients/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((err) => console.error("Error fetching client:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = {
        Client_ID: formData.client_id,
        Client_Name: formData.client_name,
        Description: formData.description,
        Type: formData.type,
        Status: formData.status,
        Active_Projects: formData.active_projects,
    };

    const response = await fetch(`http://localhost:8000/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        alert("Client details updated successfully!");
        navigate(`/clients/${id}`);
    } else {
        alert("Error updating client!");
    }
  };


  if (!formData) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Client</h1>
          <p className="text-gray-500 mt-1">Update client information below</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/clients/${id}`)}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {["client_id", "client_name", "type", "status", "active_projects", "description"].map(
          (field, i) => (
            <div key={i} className={field === "description" ? "col-span-3" : ""}>
              <p className="text-sm text-gray-500 capitalize">{field.replace("_", " ")}</p>
              <input
                name={field}
                value={formData[field] ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ClientEdit;
