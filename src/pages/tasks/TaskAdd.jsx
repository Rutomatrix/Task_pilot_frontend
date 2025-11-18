import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TaskAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    task_id: "",
    task_name: "",
    project_id: [],
    type: "",
    assigned_to: [],
    priority: "",
    deadline: "",
    status: "",
    dependencies: [],
    description: "",
    skills_required: [],
  });

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle comma-separated array fields
  const handleArrayChange = (e) => {
    const name = e.target.name;
    const value = e.target.value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create task");

      alert("✅ Task created successfully!");
      navigate("/tasks");
    } catch (error) {
      console.error(error);
      alert("❌ Error creating task");
    }
  };

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Add New Task</h1>
        <button
          onClick={() => navigate("/tasks")}
          className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {/* String fields */}
        {[
          { key: "task_id", label: "Task ID" },
          { key: "task_name", label: "Task Name" },
          { key: "type", label: "Type" },
          { key: "priority", label: "Priority" },
          { key: "status", label: "Status" },
          { key: "deadline", label: "Deadline", type: "datetime-local" },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <p className="text-sm text-gray-500">{label}</p>
            <input
              type={type || "text"}
              name={key}
              value={formData[key] ?? ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        ))}

        {/* Array fields */}
        {[
          { key: "project_id", label: "Project ID (comma-separated)" },
          { key: "assigned_to", label: "Assigned To (comma-separated)" },
          { key: "dependencies", label: "Dependencies (comma-separated)" },
          { key: "skills_required", label: "Skills Required (comma-separated)" },
        ].map(({ key, label }) => (
          <div key={key}>
            <p className="text-sm text-gray-500">{label}</p>
            <input
              name={key}
              value={formData[key].join(", ")}
              onChange={handleArrayChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        ))}

        {/* Description (full width) */}
        <div className="col-span-3">
          <p className="text-sm text-gray-500">Description</p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 h-24"
          />
        </div>
      </div>

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

export default TaskAdd;
