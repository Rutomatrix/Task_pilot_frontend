import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Emp_ID: "",
    Team_ID: "",
    Name: "",
    Role: "",
    Skillset: "",
    Current_Tasks: "",
    Status: "",
    Comments: "",
    Email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Convert Skillset + Current_Tasks to arrays before sending
      const payload = {
        ...formData,
        Skillset: formData.Skillset ? formData.Skillset.split(",").map(s => s.trim()) : [],
        Current_Tasks: formData.Current_Tasks ? formData.Current_Tasks.split(",").map(t => t.trim()) : [],
      };

      const res = await fetch("http://localhost:8000/api/employees/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create employee");

      alert("✅ Employee created successfully!");
      navigate("/employees");
    } catch (error) {
      console.error(error);
      alert("❌ Error creating employee");
    }
  };

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
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Add New Employee</h1>

        <button
          onClick={() => navigate("/employees")}
          className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {fields.map((field, i) => (
          <div key={i} className={field === "Comments" ? "col-span-3" : ""}>
            <p className="text-sm text-gray-500 capitalize">
              {field.replace("_", " ")}
            </p>

            {field === "Comments" ? (
              <textarea
                name={field}
                value={formData[field]}
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

export default EmployeeAdd;
