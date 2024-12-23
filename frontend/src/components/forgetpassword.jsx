import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Send email to backend for password reset
      const response = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email }
      );

      setMessage(response.data.message);
      setTimeout(() => {
        console.log("Redirecting to /login...");
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Error sending request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="p-8 w-[600px] max-w-full">
        <h2 className="text-3xl font-semibold text-custom-purple mb-4 text-center">
          Forgot Your Password?
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address, and we’ll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-medium text-white rounded-md focus:outline-none ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-custom-purple hover:bg-purple-800"
            }`}
          >
            {loading ? "Processing..." : "Request Reset Link"}
          </button>
        </form>
        {message && (
          <p className="text-center mt-4 text-gray-600" aria-live="polite">
            {message}
          </p>
        )}
        <p className="text-center mt-4 text-sm text-gray-600">
          <a href="/" className="text-custom-purple hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
