import React, { useState } from "react";
import vectImage from "../assets/Img/vect.png";
import logo from "../assets/Img/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        email,
        password,
      });
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      setError(
        error.response ? error.response.data.message : "An error occurred"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e0eaf3] to-[#cfdef3]">
      <div className="flex w-full max-w-8xl">
        <div className="flex-1 flex items-center justify-center ml-4">
          <img
            src={vectImage}
            alt="Register Illustration"
            className="w-full max-w-2xl h-96 object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center px-18 py-12 lg:px-32 ml-2 mr-22">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <img
                alt="Your Company"
                src={logo}
                className="mx-auto h-18 w-auto"
              />
              <h2 className="mt-0 text-center text-2xl mb-10 tracking-tight text-gray-700">
                Welcome to Digitalflake Admin
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Confirm Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-purple-900 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-600 focus-visible:outline-2 focus-visible:outline-purple-600"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
