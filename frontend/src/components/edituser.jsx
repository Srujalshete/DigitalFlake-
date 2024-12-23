import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const [file, setFile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    mobile: "",
    email: "",
    role_id: "",
    profile_image: "",
    status: "Active",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/user/data/${id}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    axios
      .get("http://localhost:5000/user/role")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 10485760) {
      alert("File size exceeds 10MB");
    } else {
      setFile(selectedFile);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("mobile", userData.mobile);
    formData.append("email", userData.email);
    formData.append("role_id", userData.role_id);
    formData.append("status", userData.status);

    if (file) formData.append("profile_image", file);

    try {
      const response = await axios.put(
        `http://localhost:5000/user/update-user/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("User updated successfully:", response.data);
      navigate("/admin/users");
      alert("User Details Update Sucessfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(
        "Failed to update user. Please check the input data and try again."
      );
    }
  };

  const { name, mobile, email, role_id, profile_image, status } = userData;

  return (
    <div className="bg-white p-4 h-screen flex flex-col">
      <div className="max-w-6xl mx-2 flex-grow">
        <div className="flex items-center mb-6">
          <Link to="/admin/users">
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
          <h1 className="text-3xl font-semibold">Edit User</h1>
        </div>
        <span className="text-sm font-ligth text-red-500">
          *Choose role before update Profile Image or Status
        </span>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="absolute top-1 left-3 bg-white px-1 text-lg font-medium text-gray-700">
                Name
              </label>
              <input
                className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                type="text"
                value={name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <label className="absolute top-1 left-3 bg-white px-1 text-lg font-medium text-gray-700">
                Mobile
              </label>
              <input
                className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                type="text"
                value={mobile}
                onChange={(e) =>
                  setUserData({ ...userData, mobile: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <label className="absolute top-1 left-3 bg-white px-1 text-lg font-medium text-gray-700">
                Email-Id
              </label>
              <input
                className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                type="text"
                value={email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-3 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                id="role"
                value={role_id}
                onChange={(e) =>
                  setUserData({ ...userData, role_id: e.target.value })
                }
              >
                {roles.map(
                  (role) =>
                    role.status === "Active" && (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    )
                )}
              </select>
              <label
                className="absolute left-3 -top-2.5 bg-white px-1 text-gray-700 text-sm font-bold"
                htmlFor="role"
              >
                Role
              </label>
            </div>

            <div className="flex flex-row items-center justify-center space-x-6">
              <div className="col-span-2 flex items-center space-x-6">
                <div className="border border-gray-300 rounded-lg relative">
                  <label className="absolute -top-3 left-2 text-center bg-white text-lg font-medium text-gray-700">
                    Upload Image
                  </label>
                  <div className="mt-8 p-4">
                    <img
                      alt="User avatar"
                      className="w-24 h-24 rounded-full"
                      height="100"
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : `http://localhost:5000/images/${profile_image}`
                      }
                      width="100"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 w-48 h-48">
                  <i className="fas fa-upload text-3xl text-gray-400"></i>
                  <p className="text-lg text-gray-500 mt-2 text-center">
                    Upload Maximum allowed file size is 10MB
                  </p>
                  <input
                    type="file"
                    name="profile_image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer text-indigo-600 text-sm"
                  >
                    Click to Upload
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-start space-x-8">
              {" "}
              <div className="relative">
                <select
                  className="block appearance-none w-80 bg-white border border-gray-400 hover:border-gray-500 px-8 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  id="status"
                  value={status}
                  onChange={(e) =>
                    setUserData({ ...userData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <label
                  className="absolute left-3 -top-2.5 bg-white px-1 text-gray-700 text-sm font-bold"
                  htmlFor="status"
                >
                  Status
                </label>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M14.95 7.95a.5.5 0 0 0-.7 0L10 12.2 5.75 7.95a.5.5 0 1 0-.7.7l4.5 4.5a.5.5 0 0 0 .7 0l4.5-4.5a.5.5 0 0 0 0-.7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex justify-end mt-auto pb-16 m-4">
        <Link
          to="/admin/users"
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

export default EditUser;
