import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddRole = () => {
  const [roleName, setRoleName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRoleNameChange = (event) => {
    setRoleName(event.target.value);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSave = async () => {
    if (!roleName.trim()) {
      setErrorMessage("Role name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/roles/add", {
        role_name: roleName.trim(),
        status: "Active",
      });

      if (response.status === 201) {
        setSuccessMessage("Role added successfully!");
        setRoleName("");
        navigate("/admin/roles");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while adding the role."
      );
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between p-4">
      <div className="flex items-center">
        <Link to="/admin/roles">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-semibold ml-2">Add Role</h1>
      </div>

      <div className="mt-8">
        <div className="relative">
          <input
            type="text"
            id="roleName"
            name="roleName"
            value={roleName}
            onChange={handleRoleNameChange}
            className="mt-1 block w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
          <label
            htmlFor="roleName"
            className="absolute -top-3 left-3 bg-white px-1 text-lg font-medium text-gray-700"
          >
            Role Name
          </label>
        </div>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 mt-2">{successMessage}</p>
        )}
      </div>

      <div className="flex justify-end mt-auto mb-12 pb-14">
        <Link
          to="/admin/roles"
          className="mr-4 px-6 py-3 border border-gray-300 rounded-full text-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-purple-700 text-lg text-white rounded-full hover:bg-purple-800"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddRole;
