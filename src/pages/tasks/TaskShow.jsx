import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TaskShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/tasks/${id}`)
      .then((res) => res.json())
      .then((data) => setTask(data))
      .catch((err) => console.error("Error fetching task:", err));
  }, [id]);

  if (!task) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Overview</h1>
          <p className="text-gray-500 mt-1">Detailed task information</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/tasks")}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/tasks/${id}/edit`)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {[
          "task_id",
          "task_name",
          "project_id",
          "type",
          "assigned_to",
          "priority",
          "deadline",
          "status",
          "dependencies",
          "skills_required",
          "description",
        ].map((field, i) => (
          <div key={i} className={["description", "skills_required"].includes(field) ? "col-span-3" : ""}>
            <p className="text-sm text-gray-500 capitalize">{field.replace("_", " ")}</p>
            <p
              className={`font-semibold text-gray-800 ${
                field === "status" &&
                (task.status === "Completed"
                  ? "text-green-600"
                  : task.status === "Pending"
                  ? "text-yellow-600"
                  : task.status === "In Progress"
                  ? "text-blue-600"
                  : "")
              }`}
            >
              {task[field] && task[field] !== "" && !Number.isNaN(task[field])
                ? Array.isArray(task[field])
                  ? task[field].length > 0
                    ? task[field].join(", ")
                    : "-"
                  : task[field]
                : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskShow;
