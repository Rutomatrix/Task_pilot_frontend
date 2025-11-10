import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ClientShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/clients/${id}`)
      .then((res) => res.json())
      .then((data) => setClient(data))
      .catch((err) => console.error("Error fetching client:", err));
  }, [id]);

  if (!client) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-10 bg-[#f2f7fa] min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Client Overview</h1>
          <p className="text-gray-500 mt-1">Detailed information of client record</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/clients")}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/clients/${id}/edit`)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-3 gap-y-8 gap-x-10">
        {["client_id", "client_name", "type", "status", "active_projects", "description"].map(
          (field, i) => (
            <div key={i} className={field === "description" ? "col-span-3" : ""}>
              <p className="text-sm text-gray-500 capitalize">{field.replace("_", " ")}</p>
              <p
                className={`font-semibold text-gray-800 ${
                  field === "status" &&
                  (client.status === "Active"
                    ? "text-green-600"
                    : client.status === "Inactive"
                    ? "text-red-600"
                    : "")
                }`}
              >
                {client[field] || "N/A"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ClientShow;
