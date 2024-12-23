import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../components/login";
import AdminDashboard from "../components/Admindashboard";
import Roles from "../components/Roles";
import AddRole from "../components/AddRole";
import EditRole from "../components/editrole";
import Dashboard from "../components/Dashboard";
import Users from "../components/Users";
import AddUser from "../components/AddUser";
import EditUser from "../components/edituser";
import Register from "../components/register";
import Reset from "../components/restpassword";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  return true;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/auth/reset-password" element={<Reset />} />

        {/* Protected Routes (Admin Dashboard Layout) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          {/* Nested Routes inside AdminDashboard */}
          <Route
            index
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="roles"
            element={
              <PrivateRoute>
                <Roles />
              </PrivateRoute>
            }
          />
          <Route
            path="roles/add"
            element={
              <PrivateRoute>
                <AddRole />
              </PrivateRoute>
            }
          />
          <Route
            path="roles/edit/:id"
            element={
              <PrivateRoute>
                <EditRole />
              </PrivateRoute>
            }
          />
          <Route
            path="users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="users/add"
            element={
              <PrivateRoute>
                <AddUser />
              </PrivateRoute>
            }
          />
          <Route
            path="users/edit/:id"
            element={
              <PrivateRoute>
                <EditUser />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
