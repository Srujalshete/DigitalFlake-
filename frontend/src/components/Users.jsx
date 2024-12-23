import React, { useState, useEffect } from "react";
import ConfirmModal from "./DeleteConfrimation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/data");
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const rolesResponse = await axios.get(
          "http://localhost:5000/user/role"
        );
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchData();
    fetchRoles();
  }, []);

  const getRoleName = (roleId) => {
    const role = roles.find((role) => role.id === roleId);
    return role ? role.role_name : "Unknown Role";
  };

  const sortUsers = (field) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSortField(field);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setUsers(sortedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    navigate("/admin/users/add");
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        setIsModalOpen(false);
        setUserToDelete(null);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <h1 className="ml-2 text-3xl font-semibold">User</h1>
          </div>
        </div>
        <div className="relative w-2/4 pl-13">
          <input
            type="text"
            className="border rounded-md py-2 px-6 pl-12 w-full text-lg"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="absolute left-3 top-3 text-gray-400 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <button
          className="bg-custom-purple text-white py-3 px-4 rounded-lg"
          onClick={handleAddNew}
        >
          Add New
        </button>
      </div>
      <div className="overflow-x-auto mt-8 mb-8">
        <table className="min-w-full bg-white text-lg border-spacing-2 text-center">
          <thead className="bg-yellow-200">
            <tr>
              <th
                className="py-3 px-6 border-b border-gray-200 text-center cursor-pointer"
                onClick={() => sortUsers("id")}
              >
                Id{" "}
                <i
                  className={`fas fa-sort ${
                    sortField === "id" ? sortDirection : ""
                  }`}
                ></i>
              </th>
              <th
                className="py-3 px-6 border-b border-gray-200 text-center cursor-pointer"
                onClick={() => sortUsers("name")}
              >
                Name{" "}
                <i
                  className={`fas fa-sort ${
                    sortField === "name" ? sortDirection : ""
                  }`}
                ></i>
              </th>
              <th
                className="py-3 px-6 border-b border-gray-200 text-center cursor-pointer"
                onClick={() => sortUsers("mobile")}
              >
                Mobile{" "}
                <i
                  className={`fas fa-sort ${
                    sortField === "mobile" ? sortDirection : ""
                  }`}
                ></i>
              </th>
              <th
                className="py-3 px-6 border-b border-gray-200 text-center cursor-pointer"
                onClick={() => sortUsers("email")}
              >
                Email-Id{" "}
                <i
                  className={`fas fa-sort ${
                    sortField === "email" ? sortDirection : ""
                  }`}
                ></i>
              </th>
              <th className="py-3 px-6 border-b border-gray-200 text-center">
                Role <i className="fa fa-user-circle" aria-hidden="true"></i>
              </th>
              <th
                className="py-3 px-6 border-b border-gray-200 text-center cursor-pointer"
                onClick={() => sortUsers("status")}
              >
                Status{" "}
                <i
                  className={`fas fa-sort ${
                    sortField === "status" ? sortDirection : ""
                  }`}
                ></i>
              </th>
              <th className="py-3 px-6 border-b border-gray-200 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`${
                  user.status === "Active" ? "bg-gray-50" : "bg-white"
                } my-2`}
              >
                <td className="py-3">{user.id}</td>
                <td className="py-3">{user.name}</td>
                <td className="py-3">{user.mobile}</td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">{getRoleName(user.role_id)}</td>
                <td
                  className={`py-3 ${
                    user.status === "Active" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {user.status}
                </td>

                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center items-center space-x-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                      onClick={() => handleEdit(user.id)}
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
                      onClick={() => handleDeleteClick(user.id)}
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

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          id={userToDelete}
          title="Delete User"
          message="Are you sure you want to delete this user?"
        />
      </div>
    </div>
  );
};

export default UserManagement;
