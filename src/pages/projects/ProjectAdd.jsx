import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_id: "",
    name: "",
    client_id: [],
    linked_inventory: [],
    status: "",
    priority: "",
    deadline: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle array fields (comma-separated input)
    if (name === "client_id" || name === "linked_inventory") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((v) => v.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      // Adjust to match backend field aliases
      const payload = {
        Project_ID: formData.project_id,
        Name: formData.name,
        Client_ID: formData.client_id,
        Linked_Inventory: formData.linked_inventory,
        Status: formData.status,
        Priority: formData.priority,
        Deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        Description: formData.description,
      };

      const res = await fetch("http://localhost:8000/api/projects/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create project");

      alert("✅ Project created successfully!");
      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert("❌ Error creating project");
    }
  };

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Add New Project</h1>
        <button
          onClick={() => navigate("/projects")}
          className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>

      {/* Form Fields */}
      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {[
          "project_id",
          "name",
          "client_id",
          "linked_inventory",
          "status",
          "priority",
          "deadline",
          "description",
        ].map((field, i) => (
          <div key={i} className={field === "description" ? "col-span-3" : ""}>
            <p className="text-sm text-gray-500 capitalize">
              {field.replace("_", " ")}
            </p>
            <input
              name={field}
              value={
                Array.isArray(formData[field])
                  ? formData[field].join(", ")
                  : formData[field] ?? ""
              }
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder={
                field === "client_id" || field === "linked_inventory"
                  ? "Enter comma-separated values"
                  : ""
              }
              type={field === "deadline" ? "date" : "text"}
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProjectAdd;
