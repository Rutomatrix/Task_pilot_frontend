import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Convert array fields into comma-separated string for input
        setFormData({
          ...data,
          Skillset: Array.isArray(data.Skillset)
            ? data.Skillset.join(", ")
            : data.Skillset || "",
          Current_Tasks: Array.isArray(data.Current_Tasks)
            ? data.Current_Tasks.join(", ")
            : data.Current_Tasks || "",
        });
      })
      .catch((err) => console.error("Error fetching employee:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = {
      Emp_ID: formData.Emp_ID,
      Team_ID: formData.Team_ID,
      Name: formData.Name,
      Role: formData.Role,
      Skillset: formData.Skillset
        ? formData.Skillset.split(",").map((s) => s.trim())
        : [],
      Current_Tasks: formData.Current_Tasks
        ? formData.Current_Tasks.split(",").map((t) => t.trim())
        : [],
      Status: formData.Status,
      Comments: formData.Comments,
      Email: formData.Email,
    };

    const response = await fetch(`http://localhost:8000/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Employee details updated successfully!");
      navigate(`/employees/${id}`);
    } else {
      alert("Error updating employee!");
    }
  };

  if (!formData) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  const fields = [
    "Emp_ID",
    "Team_ID",
    "Name",
    "Role",
    "Skillset",
    "Current_Tasks",
    "Status",
    "Comments",
    "Email",
  ];

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Employee</h1>
          <p className="text-gray-500 mt-1">
            Update employee information below
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/employees/${id}`)}
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
        {fields.map((field, i) => (
          <div
            key={i}
            className={field === "Comments" ? "col-span-3" : ""}
          >
            <p className="text-sm text-gray-500 capitalize">
              {field.replace("_", " ")}
            </p>

            {field === "Comments" ? (
              <textarea
                name={field}
                value={formData[field] ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1 h-24"
              />
            ) : (
              <input
                name={field}
                value={formData[field] ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder={
                  field === "Skillset" || field === "Current_Tasks"
                    ? "Comma-separated values"
                    : ""
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeEdit;
