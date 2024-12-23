import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddRole from "./AddRole";
import ConfirmModal from "./DeleteConfrimation";

const Roles = () => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [isAddingNewRole, setIsAddingNewRole] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/roles/read")
      .then((response) => {
        setRolesData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles data:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddNewRole = () => {
    navigate("/admin/roles/add");
  };

  const handleSaveRole = (newRoleName) => {
    const newRole = { id: Date.now(), roleName: newRoleName, status: "Active" };
    setRolesData([...rolesData, newRole]);
    setIsAddingNewRole(false);
  };

  const handleEditClick = (id) => {
    navigate(`/admin/roles/edit/${id}`);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const filteredRoles = useMemo(() => {
    const sortedRoles = [...rolesData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return sortedRoles.filter((role) => {
      const roleName = role?.role_name || "";
      const search = searchTerm?.toLowerCase() || "";
      return roleName.toLowerCase().includes(search);
    });
  }, [rolesData, searchTerm, sortConfig]);

  const handleDeleteClick = (roleId) => {
    setRoleToDelete(roleId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async (roleId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/roles/roles/${roleId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRolesData(rolesData.filter((role) => role.id !== roleId));
        setIsModalOpen(false);
        setRoleToDelete(null);
      } else {
        console.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRoleToDelete(null);
  };

  return (
    <div className="container mx-auto p-4">
      {isAddingNewRole ? (
        <AddRole onSave={handleSaveRole} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                />
              </svg>
              <h1 className="text-3xl font-bold">Roles</h1>
            </div>

            <div className="relative w-full max-w-2xl">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  className="border rounded-md py-2 px-6 pl-12 w-full text-lg"
                  placeholder="Search"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <button
              className="bg-custom-purple text-white py-3 px-4 rounded-lg"
              onClick={handleAddNewRole}
            >
              Add New
            </button>
          </div>
          <div className="overflow-x-auto mt-8 mb-8">
            <table className="min-w-full bg-white text-lg border-spacing-2 text-center">
              <thead>
                <tr className="bg-yellow-200">
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    Id{" "}
                    <i
                      className={`fa fa-sort ${
                        sortConfig.key === "id" ? sortConfig.direction : ""
                      }`}
                      aria-hidden="true"
                    ></i>
                  </th>
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer"
                    onClick={() => handleSort("role_name")}
                  >
                    Role Name{" "}
                    <i
                      className={`fa fa-sort ${
                        sortConfig.key === "role_name"
                          ? sortConfig.direction
                          : ""
                      }`}
                      aria-hidden="true"
                    ></i>
                  </th>
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status{" "}
                    <i
                      className={`fa fa-sort ${
                        sortConfig.key === "status" ? sortConfig.direction : ""
                      }`}
                      aria-hidden="true"
                    ></i>
                  </th>
                  <th className="py-2 px-4 border-b text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRoles.map((role) => (
                  <tr
                    key={role.id}
                    className={`${
                      role.status === "Active" ? "bg-gray-50" : "bg-white"
                    } my-2`}
                  >
                    <td className="py-2 px-4 border-b text-center">
                      {role.id}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {role.role_name}
                    </td>
                    <td
                      className={`py-2 px-4 border-b text-center ${
                        role.status === "Active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {role.status}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <div className="flex justify-center items-center space-x-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                          onClick={() => handleEditClick(role.id)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                          onClick={() => handleDeleteClick(role.id)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ConfirmModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            id={roleToDelete}
            title="Delete role"
            message="Are you sure you want to delete this role?"
          />
        </>
      )}
    </div>
  );
};

export default Roles;
