import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeamsAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    team_id: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/teams/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create team");

      alert("✅ Team created successfully!");
      navigate("/teams");
    } catch (error) {
      console.error(error);
      alert("❌ Error creating team");
    }
  };

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Add New Team</h1>
        <button
          onClick={() => navigate("/teams")}
          className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {["team_id", "category"].map((field, i) => (
          <div key={i} className="">
            <p className="text-sm text-gray-500 capitalize">{field.replace("_", " ")}</p>
            <input
              name={field}
              value={formData[field] ?? ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
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

export default TeamsAdd;
