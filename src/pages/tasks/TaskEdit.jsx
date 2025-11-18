import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  // Fetch task by ID
  useEffect(() => {
    fetch(`http://localhost:8000/api/tasks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Convert arrays to comma-separated strings for editing
        setFormData({
          ...data,
          project_id: data.project_id?.join(", ") || "",
          assigned_to: data.assigned_to?.join(", ") || "",
          dependencies: data.dependencies?.join(", ") || "",
          skills_required: data.skills_required?.join(", ") || "",
        });
      })
      .catch((err) => console.error("Error fetching task:", err));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert comma-separated strings back to arrays before saving
  const handleSave = async () => {
    const payload = {
      Task_ID: formData.task_id,
      Task_Name: formData.task_name,
      Project_ID: formData.project_id
        ? formData.project_id.split(",").map((v) => v.trim()).filter((v) => v)
        : [],
      Type: formData.type,
      Assigned_To: formData.assigned_to
        ? formData.assigned_to.split(",").map((v) => v.trim()).filter((v) => v)
        : [],
      Priority: formData.priority,
      Deadline: formData.deadline,
      Status: formData.status,
      Dependencies: formData.dependencies
        ? formData.dependencies.split(",").map((v) => v.trim()).filter((v) => v)
        : [],
      Description: formData.description,
      Skills_Required: formData.skills_required
        ? formData.skills_required.split(",").map((v) => v.trim()).filter((v) => v)
        : [],
    };

    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update task");

      alert("✅ Task updated successfully!");
      navigate(`/tasks/${id}`);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("❌ Error updating task!");
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
          <h1 className="text-3xl font-bold text-gray-800">Edit Task</h1>
          <p className="text-gray-500 mt-1">Update task details below</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/tasks/${id}`)}
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
        {/* Text Fields */}
        {[
          "task_id",
          "task_name",
          "type",
          "priority",
          "status",
          "deadline",
        ].map((field, i) => (
          <div key={i}>
            <p className="text-sm text-gray-500 capitalize">
              {field.replace("_", " ")}
            </p>
            <input
              name={field}
              value={formData[field] ?? ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              type={field === "deadline" ? "datetime-local" : "text"}
            />
          </div>
        ))}

        {/* Array Fields */}
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
              value={formData[key] ?? ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        ))}

        {/* Description */}
        <div className="col-span-3">
          <p className="text-sm text-gray-500">Description</p>
          <textarea
            name="description"
            value={formData.description ?? ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 h-24"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskEdit;
