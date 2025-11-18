import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProjectShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => console.error("Error fetching project:", err));
  }, [id]);

  if (!project) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Project Overview</h1>
          <p className="text-gray-500 mt-1">Detailed information of the project record</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/projects/${id}/edit`)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {[
          "project_id",
          "name",
          "client_id",
          "priority",
          "status",
          "deadline",
          "description",
        ].map((field, i) => (
          <div key={i} className={field === "description" ? "col-span-3" : ""}>
            <p className="text-sm text-gray-500 capitalize">
              {field.replace("_", " ")}
            </p>
            <p
              className={`font-semibold text-gray-800 ${
                field === "status" &&
                (project.status === "Active"
                  ? "text-green-600"
                  : project.status === "Inactive"
                  ? "text-red-600"
                  : "")
              }`}
            >
              {project[field] &&
              project[field] !== "" &&
              !Number.isNaN(project[field])
                ? Array.isArray(project[field])
                  ? project[field].length > 0
                    ? project[field].join(", ")
                    : "-"
                  : field === "deadline" && project[field]
                  ? (() => {
                      const d = new Date(project[field]);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const year = d.getFullYear();
                      return `${day}-${month}-${year}`;
                    })()
                  : project[field]
                : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectShow;
