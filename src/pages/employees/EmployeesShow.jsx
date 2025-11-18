import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EmployeeShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.error("Error fetching employee:", err));
  }, [id]);

  if (!employee) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  const fields = [
    { label: "Employee ID", key: "Emp_ID" },
    { label: "Employee Name", key: "Name" },
    { label: "Email", key: "Email" },
    { label: "Team ID", key: "Team_ID" },
    { label: "Role", key: "Role" },
    { label: "Status", key: "Status" },
    { label: "Skillset", key: "Skillset" },
    { label: "Current Tasks", key: "Current_Tasks" },
    { label: "Comments", key: "Comments" },
  ];

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employee Overview</h1>
          <p className="text-gray-500 mt-1">Detailed information of employee record</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/employees")}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/employees/${id}/edit`)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {fields.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="font-semibold text-gray-800">
            {employee[item.key] &&
            employee[item.key] !== "" &&
            !Number.isNaN(employee[item.key])
                ? Array.isArray(employee[item.key])
                ? employee[item.key].length > 0
                    ? employee[item.key].join(", ")
                    : "-"
                : employee[item.key]
                : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeShow;
