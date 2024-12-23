import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditRole = () => {
  const [role_name, setRoleName] = useState("");
  const [status, setStatus] = useState("Active");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/roles/read/${id}`
        );
        const roleData = response.data;

        console.log(roleData.role_name);

        setRoleName(roleData.role_name);
        setStatus(roleData.status);
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    fetchRoleData();
  }, [id]);

  const handleRoleNameChange = (e) => {
    setRoleName(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/roles/update/${id}`,
        {
          role_name,
          status,
        }
      );

      console.log("Role updated:", response.data);
      navigate("/admin/roles");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  return (
    <div className="bg-white min-h-screen flex flex-col justify-between p-8">
      <div className="flex items-center mb-8">
        <Link to="/admin/roles">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 mr-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-semibold">Edit Role</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="role-name"
            type="text"
            value={role_name}
            onChange={handleRoleNameChange}
          />
          <label
            className="absolute left-3 -top-2.5 bg-white px-1 text-gray-700 text-sm font-bold"
            htmlFor="role-name"
          >
            Role Name
          </label>
        </div>

        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            id="status"
            value={status}
            onChange={handleStatusChange}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <label
            className="absolute left-3 -top-2.5 bg-white px-1 text-gray-700 text-sm font-bold"
            htmlFor="status"
          >
            Status
          </label>
        </div>
      </div>

      <div className="flex justify-end mt-auto pb-14 m-4">
        <Link
          to="/admin/roles"
          className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full mr-4"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          className="bg-custom-purple text-white font-semibold py-2 px-6 rounded-full"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditRole;
