import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
  const [file, setFile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState("Active");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/role");
        const data = await response.json();

        const activeRoles = data.filter((role) => role.status === "Active");
        setRoles(activeRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const fileURL = URL.createObjectURL(selectedFile);
    setImagePreview(fileURL);
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!name) validationErrors.name = "Name is required";
    if (!mobile || !/^\d{10}$/.test(mobile))
      validationErrors.mobile = "Valid mobile number is required";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      validationErrors.email = "Valid email is required";
    if (!roleId) validationErrors.role = "Role is required";
    if (!file) validationErrors.profileImage = "Profile image is required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("role_id", roleId);
    formData.append("status", status);
    formData.append("profile_image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/user/create-user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("User created successfully:", response.data);
      alert("User created successfully!");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error creating user - email already exist:", error);
      alert("Error creating user. Please try again.");
    }
  };

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
          <h1 className="text-3xl font-semibold">Add User</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="absolute top-1 left-3 bg-white px-1 text-lg font-medium text-gray-700">
                Name
              </label>
              <input
                className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>
            <div className="relative">
              <label className="absolute top-1 left-3 bg-white px-1 text-lg font-medium text-gray-700">
                Mobile
              </label>
              <input
                className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {errors.mobile && (
                <span className="text-red-500 text-sm">{errors.mobile}</span>
              )}
            </div>
            <div className="relative">
              <label className="absolute top-1 left-3 bg-white px-1 text-lg font-medium text-gray-700">
                Email-Id
              </label>
              <input
                className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-3 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                id="roles"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              <label
                className="absolute left-3 -top-2.5 bg-white px-1 text-gray-700 text-sm font-bold"
                htmlFor="status"
              >
                Role
              </label>
              {errors.role && (
                <span className="text-red-500 text-sm">{errors.role}</span>
              )}
            </div>
            <div className="col-span-2 flex items-center space-x-6">
              <div className="border border-gray-300 rounded-lg relative">
                <label className="absolute -top-3 left-2 text-center bg-white text-lg font-medium text-gray-700">
                  Upload Image
                </label>
                <div className="mt-8 p-4">
                  <img
                    alt="User avatar placeholder"
                    className="w-24 h-24 rounded-full"
                    height="100"
                    src={imagePreview}
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
                  accept="image/jpeg, image/jpg, image/png"
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
              {errors.profileImage && (
                <span className="text-red-500 text-sm">
                  {errors.profileImage}
                </span>
              )}
            </div>
          </div>
          <div className="min-h-screen flex flex-col">
            <div className="flex justify-end mt-80 m-4">
              <Link
                to="/admin/users"
                className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full mr-4"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-custom-purple text-white font-semibold py-2 px-6 rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
